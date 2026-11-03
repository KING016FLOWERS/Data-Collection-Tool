import { Router } from "express";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { pool } from "../config/db.js";
import { isValidPassword, PASSWORD_MESSAGE } from "../auth/passwordPolicy.js";
import { isValidRegistrationEmail, normalizeEmail } from "../auth/emailValidation.js";
import { updateIndustryAfterProfileEdit, type SessionView } from "../auth/sessions.js";

interface ProfileRow extends RowDataPacket {
  UserID: string;
  password: string;
  Industry: string;
  Address: string;
  Email: string | null;
  role: string;
  status: string;
}

const router = Router();
function publicProfile(row: ProfileRow) {
  return { userId: row.UserID, industry: row.Industry, address: row.Address,
    email: row.Email ?? "", role: row.role, status: row.status };
}
async function matchesCurrentPassword(given: string, saved: string): Promise<boolean> {
  if (/^\$2[aby]\$\d\d\$/.test(saved)) return bcrypt.compare(given, saved);
  const a = Buffer.from(given);
  const b = Buffer.from(saved);
  return a.length === b.length && timingSafeEqual(a, b);
}

router.get("/", async (_req, res, next) => {
  try {
    const session = res.locals.session as SessionView;
    const [records] = await pool.execute<ProfileRow[]>(
      "SELECT UserID, Industry, Address, Email, role, status FROM TopMgmt_Users WHERE UserID=? AND role='Top Management' LIMIT 1",
      [session.userId],
    );
    if (!records.length) { res.status(404).json({ message: "Profile not found." }); return; }
    res.json(publicProfile(records[0]));
  } catch (error) { next(error); }
});

// Checks uniqueness while excluding the CURRENT logged-in Top Management account.
router.get("/check-email", async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!isValidRegistrationEmail(email)) {
      res.status(400).json({ message: "Enter a valid email address." }); return;
    }
    const session = res.locals.session as SessionView;
    const [matches] = await pool.execute<RowDataPacket[]>(
      "SELECT UserID FROM TopMgmt_Users WHERE Email=? AND UserID<>? LIMIT 1",
      [normalizeEmail(email), session.userId],
    );
    res.json({ available: !matches.length, message: matches.length
      ? "This email is registered to another Top Management account."
      : "Email address is available." });
  } catch (error) { next(error); }
});

router.put("/", async (req, res, next) => {
  const session = res.locals.session as SessionView;
  const { industry, address, email, currentPassword, newPassword } = req.body ?? {};
  if (typeof industry !== "string" || !industry.trim() || industry.trim().length > 255 ||
      typeof address !== "string" || !address.trim() || address.length > 2000 ||
      !isValidRegistrationEmail(email) || typeof currentPassword !== "string" ||
      !currentPassword || currentPassword.length > 200 ||
      (newPassword !== undefined && newPassword !== "" && !isValidPassword(newPassword))) {
    res.status(400).json({ message: newPassword && !isValidPassword(newPassword)
      ? PASSWORD_MESSAGE : "Enter valid industry, address, email and current password." });
    return;
  }
  const nextIndustry = industry.trim();
  const nextEmail = normalizeEmail(email);
  let connection: PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [records] = await connection.execute<ProfileRow[]>(
      "SELECT UserID, password, Industry, Address, Email, role, status FROM TopMgmt_Users WHERE UserID=? AND role='Top Management' FOR UPDATE",
      [session.userId],
    );
    const existing = records[0];
    if (!existing || existing.status !== "Approved" || existing.Industry !== session.industry) {
      await connection.rollback();
      res.status(403).json({ message: "Your account is not approved or its industry assignment has changed." });
      return;
    }
    if (!await matchesCurrentPassword(currentPassword, existing.password)) {
      await connection.rollback();
      res.status(403).json({ message: "Current password is incorrect." });
      return;
    }
    const replacementPassword = newPassword ? await bcrypt.hash(newPassword, 12) : existing.password;
    // Never read UserID, role or status from the request for this UPDATE.
    await connection.execute<ResultSetHeader>(
      "UPDATE TopMgmt_Users SET Industry=?, Address=?, Email=?, password=? WHERE UserID=? AND role='Top Management'",
      [nextIndustry, address.trim(), nextEmail, replacementPassword, session.userId],
    );
    // With the V31 FK, changing the parent Industry automatically CASCADEs to
    // Dept_Users. This also handles older installations without that FK.
    if (existing.Industry !== nextIndustry) {
      await connection.execute<ResultSetHeader>(
        "UPDATE Dept_Users SET industry=? WHERE industry=?", [nextIndustry, existing.Industry],
      );
    }
    await connection.commit();
    updateIndustryAfterProfileEdit(session.userId, existing.Industry, nextIndustry);
    res.json({ message: "Profile updated successfully.",
      profile: { userId: existing.UserID, industry: nextIndustry, address: address.trim(),
        email: nextEmail, role: existing.role, status: existing.status },
      departmentSessionsRequireLogin: existing.Industry !== nextIndustry });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => undefined);
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Industry or email is already registered under another Top Management account." });
      return;
    }
    next(error);
  } finally { connection?.release(); }
});

export default router;
