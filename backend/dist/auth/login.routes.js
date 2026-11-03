import { Router } from "express";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import { pool } from "../config/db.js";
import { resolveDepartmentModule } from "./departmentAccess.js";
import { createSession, revokeSession, validateSession } from "./sessions.js";
const router = Router();
const failedLogins = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;
// Compare a legacy JSP plaintext value without converting the new user-management
// passwords back to plaintext. The legacy value is upgraded to bcrypt on login.
function matchesLegacyPlaintext(actual, supplied) {
    const actualBytes = Buffer.from(actual);
    const suppliedBytes = Buffer.from(supplied);
    return actualBytes.length === suppliedBytes.length && timingSafeEqual(actualBytes, suppliedBytes);
}
router.post("/login", async (req, res, next) => {
    try {
        const { userID, password } = (req.body ?? {});
        if (typeof userID !== "string" || typeof password !== "string" ||
            !userID.trim() || !password || userID.length > 20 || password.length > 200) {
            res.status(400).json({ message: "Enter a valid User ID and password." });
            return;
        }
        const loginId = userID.trim();
        const clientKey = `${req.ip ?? req.socket.remoteAddress ?? "unknown"}:${loginId}`;
        const state = failedLogins.get(clientKey);
        if (state && state.blockedUntil > Date.now()) {
            res.status(429).json({ message: "Too many attempts. Try again after 15 minutes." });
            return;
        }
        if (state && state.blockedUntil > 0 && state.blockedUntil <= Date.now())
            failedLogins.delete(clientKey);
        // If the User ID exists in Main_Login, authenticate as Top Management.
        // Otherwise check users, verify the password and read the assigned department.
        const [managementRows] = await pool.execute("SELECT userID, Password FROM Main_Login WHERE userID = ? LIMIT 1", [loginId]);
        let identity = null;
        if (managementRows.length) {
            if (matchesLegacyPlaintext(managementRows[0].Password, password)) {
                identity = { userId: managementRows[0].userID, name: null, role: "top_management", department: null, moduleId: null };
            }
        }
        else {
            const [userRows] = await pool.execute("SELECT UserID, password, name, department, status FROM users WHERE UserID = ? LIMIT 1", [loginId]);
            const user = userRows[0];
            if (user && user.status === "Active") {
                const isBcrypt = /^\$2[aby]\$\d{2}\$/.test(user.password);
                const passwordMatches = isBcrypt
                    ? await bcrypt.compare(password, user.password)
                    : matchesLegacyPlaintext(user.password, password);
                if (passwordMatches) {
                    const module = resolveDepartmentModule(user.department);
                    if (!module) {
                        res.status(403).json({ message: "This user has no recognized department assignment. Contact Top Management." });
                        return;
                    }
                    // Convert any pre-existing JSP plaintext user password to bcrypt after a successful login.
                    if (!isBcrypt) {
                        const newHash = await bcrypt.hash(password, 12);
                        await pool.execute("UPDATE users SET password = ? WHERE UserID = ? AND password = ?", [newHash, user.UserID, user.password]);
                    }
                    identity = { userId: user.UserID, name: user.name, role: "department", department: user.department, moduleId: module.id };
                }
            }
        }
        if (!identity) {
            const attempts = (failedLogins.get(clientKey)?.attempts ?? 0) + 1;
            failedLogins.set(clientKey, {
                attempts,
                blockedUntil: attempts >= MAX_FAILED_ATTEMPTS ? Date.now() + BLOCK_MS : 0,
            });
            res.status(401).json({ message: "Invalid User ID or password, or the account is suspended." });
            return;
        }
        failedLogins.delete(clientKey);
        revokeSession(req, res);
        const session = createSession(res, identity);
        res.setHeader("Cache-Control", "no-store");
        res.json(session);
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", async (req, res, next) => {
    try {
        const session = await validateSession(req, res);
        res.setHeader("Cache-Control", "no-store");
        if (!session) {
            res.status(401).json({ message: "Not authenticated." });
            return;
        }
        res.json(session);
    }
    catch (error) {
        next(error);
    }
});
router.post("/logout", (req, res) => {
    revokeSession(req, res);
    res.setHeader("Cache-Control", "no-store");
    res.json({ message: "Logged out successfully." });
});
export default router;
