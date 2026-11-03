import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { modules } from "../data/modules.js";
import { badRequest, notFound } from "../utils/http.js";
const router = Router();
const validDepartments = new Set(modules.map((m) => m.title));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.get("/", async (_req, res, next) => {
    try {
        const [rows] = await pool.query(`
      SELECT
        UserID AS userId,
        name,
        department,
        emailid AS email,
        status,
        created_time AS createdAt
      FROM users
      ORDER BY created_time DESC
    `);
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const { userId, password, name, department, email } = req.body;
        if (!userId?.trim() || !password || !name?.trim() || !department || !email?.trim()) {
            return badRequest(res, "All fields are required.");
        }
        if (userId.trim().length > 20)
            return badRequest(res, "User ID must be 20 characters or fewer.");
        if (!validDepartments.has(department))
            return badRequest(res, "Invalid department/module.");
        if (!emailPattern.test(email))
            return badRequest(res, "Enter a valid email address.");
        if (password.length < 8)
            return badRequest(res, "Password must contain at least 8 characters.");
        const passwordHash = await bcrypt.hash(password, 12);
        await pool.execute(`
      INSERT INTO users (UserID, password, name, department, emailid, created_time, status)
      VALUES (?, ?, ?, ?, ?, NOW(), 'Active')
    `, [userId.trim(), passwordHash, name.trim(), department, email.trim()]);
        res.status(201).json({ message: "User added successfully." });
    }
    catch (error) {
        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "User ID already exists." });
        }
        next(error);
    }
});
router.put("/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { password, name, department, email } = req.body;
        if (!name?.trim() || !department || !email?.trim())
            return badRequest(res, "Name, department and email are required.");
        if (!validDepartments.has(department))
            return badRequest(res, "Invalid department/module.");
        if (!emailPattern.test(email))
            return badRequest(res, "Enter a valid email address.");
        let result;
        if (password?.trim()) {
            if (password.length < 8)
                return badRequest(res, "Password must contain at least 8 characters.");
            const passwordHash = await bcrypt.hash(password, 12);
            [result] = await pool.execute("UPDATE users SET password=?, name=?, department=?, emailid=? WHERE UserID=?", [passwordHash, name.trim(), department, email.trim(), userId]);
        }
        else {
            [result] = await pool.execute("UPDATE users SET name=?, department=?, emailid=? WHERE UserID=?", [name.trim(), department, email.trim(), userId]);
        }
        if (!result.affectedRows)
            return notFound(res, "User not found.");
        res.json({ message: "User updated successfully." });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:userId/status", async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        if (status !== "Active" && status !== "Suspended") {
            return badRequest(res, "Status must be Active or Suspended.");
        }
        const [result] = await pool.execute("UPDATE users SET status=? WHERE UserID=?", [status, userId]);
        if (!result.affectedRows)
            return notFound(res, "User not found.");
        res.json({ message: `User ${status === "Active" ? "activated" : "suspended"}.` });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:userId", async (req, res, next) => {
    try {
        const [result] = await pool.execute("DELETE FROM users WHERE UserID=?", [req.params.userId]);
        if (!result.affectedRows)
            return notFound(res, "User not found.");
        res.json({ message: "User deleted successfully." });
    }
    catch (error) {
        next(error);
    }
});
export default router;
