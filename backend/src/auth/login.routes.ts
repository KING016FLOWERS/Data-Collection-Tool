import { Router } from "express";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import { resolveDepartmentModule } from "./departmentAccess.js";
import { createSession, revokeSession, validateSession, type SessionIdentity } from "./sessions.js";

interface AdminRecord extends RowDataPacket { Userid: string; Password: string }
interface ManagerRecord extends RowDataPacket { UserID: string; password: string; Industry: string; status: string; role: string }
interface DepartmentRecord extends RowDataPacket {
  UserID: string; password: string; name: string; department: string; industry: string; status: string;
}
const router = Router();
const rateLimit = new Map<string, { failures: number; lockedUntil: number }>();
const fixedCompare = (saved: string, input: string) => {
  const a = Buffer.from(saved);
  const b = Buffer.from(input);
  return a.length === b.length && timingSafeEqual(a, b);
};
async function checkPassword(password: string, hashedOrTemporary: string) {
  return /^\$2[aby]\$\d\d\$/.test(hashedOrTemporary)
    ? bcrypt.compare(password, hashedOrTemporary)
    : fixedCompare(hashedOrTemporary, password);
}
router.post("/login", async (req, res, next) => {
  try {
    const { userID, password } = req.body ?? {};
    if (typeof userID !== "string" || typeof password !== "string" || !userID.trim() ||
        !password || userID.length > 20 || password.length > 200) {
      res.status(400).json({ message: "Enter a valid User ID and password." }); return;
    }
    const id = userID.trim();
    const key = `${req.ip ?? "local"}:${id}`;
    const previous = rateLimit.get(key);
    if (previous && previous.lockedUntil > Date.now()) {
      res.status(429).json({ message: "Too many attempts. Try again later." }); return;
    }
    if (previous?.lockedUntil && previous.lockedUntil <= Date.now()) rateLimit.delete(key);
    let identity: SessionIdentity | null = null;
    const [admins] = await pool.execute<AdminRecord[]>(
      "SELECT Userid, Password FROM Main_User WHERE Userid=? LIMIT 1", [id],
    );
    if (admins.length) {
      if (await checkPassword(password, admins[0].Password)) identity = {
        userId: admins[0].Userid, name: "Main Administrator", role: "main_admin",
        industry: null, department: null, moduleId: null,
      };
    } else {
      const [managers] = await pool.execute<ManagerRecord[]>(
        "SELECT UserID, password, Industry, role, status FROM TopMgmt_Users WHERE UserID=? LIMIT 1", [id],
      );
      if (managers.length) {
        const manager = managers[0];
        if (await checkPassword(password, manager.password)) {
          if (manager.status !== "Approved") {
            res.status(403).json({ message: manager.status === "Pending"
              ? "Your registration is pending Main Admin approval."
              : "Your registration has been rejected. Contact Main Admin." });
            return;
          }
          if (manager.role !== "Top Management") {
            res.status(403).json({ message: "This account is not authorized for Top Management." }); return;
          }
          identity = { userId: manager.UserID, name: null, role: "top_management",
            industry: manager.Industry, department: null, moduleId: null };
        }
      } else {
        const [users] = await pool.execute<DepartmentRecord[]>(
          "SELECT UserID, password, name, department, industry, status FROM Dept_Users WHERE UserID=? LIMIT 1", [id],
        );
        const user = users[0];
        if (user?.status === "Active" && await checkPassword(password, user.password)) {
          // Upgrade any explicitly migrated legacy plaintext password after a successful login.
          if (!/^\$2[aby]\$\d\d\$/.test(user.password)) {
            const updatedHash = await bcrypt.hash(password, 12);
            await pool.execute("UPDATE Dept_Users SET password=? WHERE UserID=? AND password=?",
              [updatedHash, user.UserID, user.password]);
          }
          const module = resolveDepartmentModule(user.department);
          if (!module) { res.status(403).json({ message: "No valid department assigned." }); return; }
          const [approved] = await pool.execute<ManagerRecord[]>(
            "SELECT UserID, password, Industry, role, status FROM TopMgmt_Users WHERE Industry=? AND status='Approved' LIMIT 1", [user.industry],
          );
          if (approved.length) identity = { userId: user.UserID, name: user.name, role: "department",
            industry: user.industry, department: user.department, moduleId: module.id };
        }
      }
    }
    if (!identity) {
      const failures = (rateLimit.get(key)?.failures ?? 0) + 1;
      rateLimit.set(key, { failures, lockedUntil: failures >= 5 ? Date.now() + 15 * 60_000 : 0 });
      res.status(401).json({ message: "Invalid credentials or inactive account." }); return;
    }
    rateLimit.delete(key);
    revokeSession(req, res);
    res.json(createSession(res, identity));
  } catch (error) { next(error); }
});
router.get("/me", async (req, res, next) => {
  try {
    const session = await validateSession(req, res);
    if (!session) { res.status(401).json({ message: "Not authenticated." }); return; }
    res.json(session);
  } catch (error) { next(error); }
});
router.post("/logout", (req, res) => { revokeSession(req, res); res.json({ message: "Signed out." }); });
export default router;
