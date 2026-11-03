import { randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import { resolveDepartmentModule } from "./departmentAccess.js";

const COOKIE_NAME = "leather_nexus_session";
export const SESSION_DURATION_MS = 60 * 60 * 1000;
export type UserRole = "main_admin" | "top_management" | "department";
export type SessionIdentity = {
  userId: string;
  name: string | null;
  role: UserRole;
  industry: string | null;
  department: string | null;
  moduleId: string | null;
};
type StoredSession = SessionIdentity & { expiresAt: number };
export type SessionView = SessionIdentity & { expiresAt: string };
const activeSessions = new Map<string, StoredSession>();
interface MainAdminRecord extends RowDataPacket { Userid: string }
interface ManagementRecord extends RowDataPacket { Industry: string; status: string }
interface DepartmentRecord extends RowDataPacket { name: string; department: string; industry: string; status: string }
const cookieOptions = () => ({
  httpOnly: true as const, sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production", path: "/",
});
function readCookie(req: Request): string | undefined {
  return req.headers.cookie?.split(";").map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
}
function expireOldSessions() {
  for (const [token, session] of activeSessions) if (session.expiresAt <= Date.now()) activeSessions.delete(token);
}
const present = (session: StoredSession): SessionView => ({
  userId: session.userId, name: session.name, role: session.role,
  industry: session.industry, department: session.department, moduleId: session.moduleId,
  expiresAt: new Date(session.expiresAt).toISOString(),
});
export function createSession(res: Response, identity: SessionIdentity): SessionView {
  expireOldSessions();
  const token = randomBytes(32).toString("hex");
  const session = { ...identity, expiresAt: Date.now() + SESSION_DURATION_MS };
  activeSessions.set(token, session);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: SESSION_DURATION_MS });
  return present(session);
}
export function revokeSession(req: Request, res: Response) {
  const token = readCookie(req);
  if (token) activeSessions.delete(token);
  res.clearCookie(COOKIE_NAME, cookieOptions());
}
export function getSession(req: Request, res: Response): SessionView | null {
  const token = readCookie(req);
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    activeSessions.delete(token);
    res.clearCookie(COOKIE_NAME, cookieOptions());
    return null;
  }
  return present(session);
}
export async function validateSession(req: Request, res: Response): Promise<SessionView | null> {
  const session = getSession(req, res);
  if (!session) return null;
  if (session.role === "main_admin") {
    const [rows] = await pool.execute<MainAdminRecord[]>("SELECT Userid FROM Main_User WHERE Userid=?", [session.userId]);
    if (rows.length) return session;
  } else if (session.role === "top_management") {
    const [rows] = await pool.execute<ManagementRecord[]>(
      "SELECT Industry, status FROM TopMgmt_Users WHERE UserID=? AND role='Top Management'", [session.userId],
    );
    if (rows[0]?.status === "Approved" && rows[0].Industry === session.industry) return session;
  } else {
    const [rows] = await pool.execute<DepartmentRecord[]>(
      "SELECT name, department, industry, status FROM Dept_Users WHERE UserID=?", [session.userId],
    );
    const current = rows[0];
    const module = current ? resolveDepartmentModule(current.department) : null;
    if (current?.status === "Active" && current.industry === session.industry && module?.id === session.moduleId) {
      // An approved Top Management registration must continue to own this industry.
      const [approved] = await pool.execute<ManagementRecord[]>(
        "SELECT Industry, status FROM TopMgmt_Users WHERE Industry=? AND status='Approved' LIMIT 1", [current.industry],
      );
      if (approved.length) return { ...session, name: current.name };
    }
  }
  revokeSession(req, res);
  return null;
}
export async function requireAuthentication(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await validateSession(req, res);
    if (!session) { res.status(401).json({ message: "Session expired or access revoked. Sign in again." }); return; }
    res.locals.session = session;
    next();
  } catch (error) { next(error); }
}
function requireRole(role: UserRole) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if ((res.locals.session as SessionView | undefined)?.role !== role) {
      res.status(403).json({ message: `Only ${role.replace("_", " ")} accounts can access this resource.` });
      return;
    }
    next();
  };
}
export const requireMainAdmin = requireRole("main_admin");
export const requireTopManagement = requireRole("top_management");
export const requireDepartment = requireRole("department");
export function requireAssignedDepartment(req: Request, res: Response, next: NextFunction) {
  const session = res.locals.session as SessionView | undefined;
  if (session?.role !== "department" || session.moduleId !== req.params.id) {
    res.status(403).json({ message: "This department is not assigned to your account." });
    return;
  }
  next();
}

/** Keep authenticated management sessions consistent after an industry rename.
 * Department sessions from the former industry must reauthenticate so no stale
 * industry access survives the change. Does NOT extend the session deadline.
 */
export function updateIndustryAfterProfileEdit(userId: string, previousIndustry: string, newIndustry: string) {
  if (previousIndustry === newIndustry) return;
  for (const [token, stored] of activeSessions) {
    if (stored.role === "top_management" && stored.userId === userId) {
      stored.industry = newIndustry;
    } else if (stored.role === "department" && stored.industry === previousIndustry) {
      activeSessions.delete(token);
    }
  }
}

/** Immediately invalidate an Admin-deleted management account and its workers. */
export function revokeDeletedIndustrySessions(userId: string, industry: string) {
  for (const [token, stored] of activeSessions) {
    if ((stored.role === "top_management" && stored.userId === userId) ||
        (stored.role === "department" && stored.industry === industry)) {
      activeSessions.delete(token);
    }
  }
}
