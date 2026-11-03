import { randomBytes } from "node:crypto";
import { pool } from "../config/db.js";
import { resolveDepartmentModule } from "./departmentAccess.js";
const SESSION_COOKIE = "dct_session";
export const SESSION_DURATION_MS = 60 * 60 * 1000;
const sessions = new Map();
function cookieOptions() {
    return {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    };
}
function tokenFromRequest(req) {
    return req.headers.cookie?.split(";").map((entry) => entry.trim())
        .find((entry) => entry.startsWith(`${SESSION_COOKIE}=`))
        ?.slice(SESSION_COOKIE.length + 1);
}
function pruneExpiredSessions() {
    const now = Date.now();
    for (const [token, session] of sessions) {
        if (session.expiresAt <= now)
            sessions.delete(token);
    }
}
function sessionView(session) {
    return {
        userId: session.userId,
        name: session.name,
        role: session.role,
        moduleId: session.moduleId,
        department: session.department,
        expiresAt: new Date(session.expiresAt).toISOString(),
    };
}
export function createSession(res, identity) {
    pruneExpiredSessions();
    const token = randomBytes(32).toString("hex");
    const session = { ...identity, expiresAt: Date.now() + SESSION_DURATION_MS };
    sessions.set(token, session);
    res.cookie(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_DURATION_MS });
    return sessionView(session);
}
export function revokeSession(req, res) {
    const token = tokenFromRequest(req);
    if (token)
        sessions.delete(token);
    res.clearCookie(SESSION_COOKIE, cookieOptions());
}
export function getSession(req, res) {
    const token = tokenFromRequest(req);
    if (!token)
        return null;
    const session = sessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
        sessions.delete(token);
        res?.clearCookie(SESSION_COOKIE, cookieOptions());
        return null;
    }
    return sessionView(session);
}
// Fetch current user status and department for each request. This revokes access if
// management suspends, deletes or reassigns the user during an active session.
export async function validateSession(req, res) {
    const session = getSession(req, res);
    if (!session)
        return null;
    if (session.role === "top_management")
        return session;
    const [rows] = await pool.execute("SELECT name, department, status FROM users WHERE UserID = ? LIMIT 1", [session.userId]);
    const current = rows[0];
    const departmentModule = current ? resolveDepartmentModule(current.department) : null;
    if (!current || current.status !== "Active" || departmentModule?.id !== session.moduleId) {
        revokeSession(req, res);
        return null;
    }
    // Use the latest name from MySQL, so name edits appear at the next session refresh.
    return { ...session, name: current.name };
}
// Authentication and authorization are enforced on the server, not only by React.
export async function requireAuthentication(req, res, next) {
    try {
        const session = await validateSession(req, res);
        if (!session) {
            res.status(401).json({ message: "Your session is unavailable or expired. Please sign in again." });
            return;
        }
        res.locals.session = session;
        next();
    }
    catch (error) {
        next(error);
    }
}
export function requireTopManagement(_req, res, next) {
    const session = res.locals.session;
    if (session?.role !== "top_management") {
        res.status(403).json({ message: "Top Management access is required." });
        return;
    }
    next();
}
/** The USER-specific API may only be called by the currently assigned department. */
export function requireAssignedDepartment(req, res, next) {
    const session = res.locals.session;
    if (session?.role !== "department") {
        res.status(403).json({ message: "Department user access is required." });
        return;
    }
    if (session.moduleId !== req.params.id) {
        res.status(403).json({ message: "This module is not assigned to your User ID." });
        return;
    }
    next();
}
