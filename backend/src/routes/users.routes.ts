import { Router } from "express";
import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import { modules } from "../data/modules.js";
import type { SessionView } from "../auth/sessions.js";
import { isValidPassword, PASSWORD_MESSAGE } from "../auth/passwordPolicy.js";
import { checkDepartmentUserId, isValidNewUserId } from "../auth/userIdAvailability.js";

interface DeptRow extends RowDataPacket {
  userId: string; name: string; department: string; industry: string;
  email: string; status: "Active" | "Suspended"; createdAt: Date;
}
const router = Router();
const validDepartments = new Set(modules.map((module) => module.title));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function managementIndustry(res: import("express").Response): string {
  const session = res.locals.session as SessionView;
  if (session.role !== "top_management" || !session.industry) throw new Error("Approved industry session required.");
  return session.industry;
}
const duplicate = (error: unknown) => (error as { code?: string })?.code === "ER_DUP_ENTRY";

router.get("/", async (_req, res, next) => {
  try {
    const industry = managementIndustry(res);
    const [rows] = await pool.execute<DeptRow[]>(`
      SELECT UserID AS userId, name, department, industry, emailid AS email,
             status, created_time AS createdAt
      FROM Dept_Users WHERE industry=? ORDER BY created_time DESC`, [industry]);
    res.json(rows);
  } catch (error) { next(error); }
});
router.get("/check-user-id", async (req, res, next) => {
  try {
    managementIndustry(res); // Approval + role checked by the route's middleware.
    const id = req.query.userId;
    if (!isValidNewUserId(id)) {
      res.status(400).json({ message: "Enter a User ID of up to 20 characters." }); return;
    }
    res.json(await checkDepartmentUserId(id.trim()));
  } catch (error) { next(error); }
});
router.post("/", async (req, res, next) => {
  try {
    const industry = managementIndustry(res); // Never trust an industry sent from the browser.
    const { userId, password, name, department, email } = req.body ?? {};
    if (typeof userId !== "string" || typeof password !== "string" || typeof name !== "string" ||
        typeof department !== "string" || typeof email !== "string" ||
        !userId.trim() || !name.trim() || !validDepartments.has(department) || !emailPattern.test(email.trim()) ||
        !isValidNewUserId(userId) || name.length > 255 || email.length > 255) {
      res.status(400).json({ message: "Enter a valid User ID, name, department and email." }); return;
    }
    if (!isValidPassword(password)) {
      res.status(400).json({ message: PASSWORD_MESSAGE }); return;
    }
    const availability = await checkDepartmentUserId(userId.trim());
    if (!availability.available) {
      res.status(409).json({ message: availability.message }); return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.execute<ResultSetHeader>(`
      INSERT INTO Dept_Users (UserID, password, name, department, industry, emailid, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Active')`,
      [userId.trim(), passwordHash, name.trim(), department, industry, email.trim()]);
    res.status(201).json({ message: `Department user created for ${industry}.` });
  } catch (error) {
    if (duplicate(error)) { res.status(409).json({ message: "User ID already exists." }); return; }
    next(error);
  }
});
router.put("/:userId", async (req, res, next) => {
  try {
    const industry = managementIndustry(res);
    const { password, name, department, email } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || name.length > 255 ||
        typeof department !== "string" || !validDepartments.has(department) ||
        typeof email !== "string" || !emailPattern.test(email.trim()) || email.length > 255 ||
        (password !== undefined && typeof password !== "string")) {
      res.status(400).json({ message: "Enter a valid name, department and email." }); return;
    }
    let result: ResultSetHeader;
    if (password) {
      if (!isValidPassword(password)) {
        res.status(400).json({ message: PASSWORD_MESSAGE }); return;
      }
      const hash = await bcrypt.hash(password, 12);
      [result] = await pool.execute<ResultSetHeader>(
        "UPDATE Dept_Users SET password=?, name=?, department=?, emailid=? WHERE UserID=? AND industry=?",
        [hash, name.trim(), department, email.trim(), req.params.userId, industry]);
    } else {
      [result] = await pool.execute<ResultSetHeader>(
        "UPDATE Dept_Users SET name=?, department=?, emailid=? WHERE UserID=? AND industry=?",
        [name.trim(), department, email.trim(), req.params.userId, industry]);
    }
    if (!result.affectedRows) { res.status(404).json({ message: "User not found in your industry." }); return; }
    res.json({ message: "User updated." });
  } catch (error) { next(error); }
});
router.patch("/:userId/status", async (req, res, next) => {
  try {
    const industry = managementIndustry(res);
    const { status } = req.body ?? {};
    if (status !== "Active" && status !== "Suspended") {
      res.status(400).json({ message: "Status must be Active or Suspended." }); return;
    }
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE Dept_Users SET status=? WHERE UserID=? AND industry=?",
      [status, req.params.userId, industry]);
    if (!result.affectedRows) { res.status(404).json({ message: "User not found in your industry." }); return; }
    res.json({ message: `User ${status.toLowerCase()}.` });
  } catch (error) { next(error); }
});
router.delete("/:userId", async (req, res, next) => {
  try {
    const industry = managementIndustry(res);
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM Dept_Users WHERE UserID=? AND industry=?",
      [req.params.userId, industry]);
    if (!result.affectedRows) { res.status(404).json({ message: "User not found in your industry." }); return; }
    res.json({ message: "User deleted." });
  } catch (error) { next(error); }
});
export default router;
