import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { isValidPassword, PASSWORD_MESSAGE } from "../auth/passwordPolicy.js";
import { checkTopManagementUserId, isValidNewUserId } from "../auth/userIdAvailability.js";
import { isValidRegistrationEmail, normalizeEmail } from "../auth/emailValidation.js";
import type { RowDataPacket } from "mysql2";

const router = Router();
const registrationAttempts = new Map<string, { count: number; resetsAt: number }>();
// Public availability check is deliberately rate-limited to reduce account enumeration.
const availabilityChecks = new Map<string, { count: number; expires: number }>();
function consumeAvailabilityQuota(key: string): boolean {
  const now = Date.now();
  const prior = availabilityChecks.get(key);
  const quota = !prior || prior.expires <= now ? { count: 0, expires: now + 60 * 60_000 } : prior;
  quota.count += 1;
  availabilityChecks.set(key, quota);
  return quota.count <= 60;
}

router.get("/check-email", async (req, res, next) => {
  try {
    if (!consumeAvailabilityQuota(req.ip ?? "unknown")) {
      res.status(429).json({ message: "Too many availability checks. Try again later." }); return;
    }
    const email = req.query.email;
    if (!isValidRegistrationEmail(email)) {
      res.status(400).json({ message: "Enter a valid email address." }); return;
    }
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT UserID FROM TopMgmt_Users WHERE Email=? LIMIT 1", [normalizeEmail(email)]
    );
    res.json({ available: rows.length === 0, message: rows.length
      ? "This email address is already registered under Top Management."
      : "Email address is available." });
  } catch (error) { next(error); }
});

router.get("/check-user-id", async (req, res, next) => {
  try {
    if (!consumeAvailabilityQuota(req.ip ?? "unknown")) {
      res.status(429).json({ message: "Too many availability checks. Try again later." }); return;
    }
    const id = req.query.userId;
    if (!isValidNewUserId(id)) {
      res.status(400).json({ message: "Enter a User ID of up to 20 characters." }); return;
    }
    res.json(await checkTopManagementUserId(id.trim()));
  } catch (error) { next(error); }
});
router.post("/", async (req, res, next) => {
  try {
    // Development-only process-local rate limiter; use a shared store for multi-node hosting.
    const ipKey = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    const previous = registrationAttempts.get(ipKey);
    const state = !previous || previous.resetsAt <= now
      ? { count: 0, resetsAt: now + 60 * 60_000 } : previous;
    if (state.count >= 10) {
      res.status(429).json({ message: "Too many registration attempts. Please try later." }); return;
    }
    state.count += 1;
    registrationAttempts.set(ipKey, state);
    const { userId, password, industry, address, email } = req.body ?? {};
    if (typeof userId !== "string" || typeof password !== "string" ||
        typeof industry !== "string" || typeof address !== "string" ||
        !isValidNewUserId(userId) || !isValidRegistrationEmail(email) ||
        !industry.trim() || industry.trim().length > 255 ||
        !address.trim() || address.length > 2000) {
      res.status(400).json({ message: "Enter User ID, valid email, industry and address." }); return;
    }
    if (!isValidPassword(password)) {
      res.status(400).json({ message: PASSWORD_MESSAGE }); return;
    }
    const normalizedId = userId.trim();
    const availability = await checkTopManagementUserId(normalizedId);
    if (!availability.available) {
      res.status(409).json({ message: availability.message }); return;
    }
    const normalizedEmail = normalizeEmail(email);
    const [emailMatches] = await pool.execute<RowDataPacket[]>(
      "SELECT UserID FROM TopMgmt_Users WHERE Email=? LIMIT 1", [normalizedEmail]
    );
    if (emailMatches.length) {
      res.status(409).json({ message: "This email address is already registered under Top Management." }); return;
    }
    const hash = await bcrypt.hash(password, 12);
    await pool.execute(`INSERT INTO TopMgmt_Users
      (UserID, password, Industry, Address, Email, role, status)
      VALUES (?, ?, ?, ?, ?, 'Top Management', 'Pending')`,
      [normalizedId, hash, industry.trim(), address.trim(), normalizedEmail]);
    res.status(201).json({ message: "Registration submitted. Main Admin approval is required before login." });
  } catch (error) {
    if ((error as { code?: string })?.code === "ER_DUP_ENTRY") {
      const conflict = String((error as { sqlMessage?: string }).sqlMessage ?? "");
      if (conflict.includes("uq_top_management_email")) {
        res.status(409).json({ message: "This email address is already registered under Top Management." }); return;
      }
      if (conflict.includes("uq_top_management_industry")) {
        res.status(409).json({ message: "This industry is already registered under Top Management." }); return;
      }
      res.status(409).json({ message: "That User ID is already registered." }); return;
    }
    next(error);
  }
});
export default router;
