import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { pool } from "../config/db.js";
import { revokeDeletedIndustrySessions } from "../auth/sessions.js";

interface ManagementRow extends RowDataPacket {
  userId: string; industry: string; email: string | null; address: string;
  role: string; status: "Pending" | "Approved" | "Rejected"; departmentUserCount: number;
}
const router = Router();
router.get("/registrations", async (_req, res, next) => {
  try {
    const [rows] = await pool.execute<ManagementRow[]>(`
      SELECT t.UserID AS userId, t.Industry AS industry, t.Email AS email, t.Address AS address, t.role, t.status,
      (SELECT COUNT(*) FROM Dept_Users d WHERE d.industry=t.Industry) AS departmentUserCount
      FROM TopMgmt_Users t ORDER BY FIELD(t.status,'Pending','Approved','Rejected'), t.UserID`);
    res.json(rows);
  } catch (error) { next(error); }
});
router.patch("/registrations/:userId/status", async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    if (status !== "Approved" && status !== "Rejected") {
      res.status(400).json({ message: "Status must be Approved or Rejected." }); return;
    }
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE TopMgmt_Users SET status=? WHERE UserID=? AND role='Top Management'",
      [status, req.params.userId]);
    if (!result.affectedRows) { res.status(404).json({ message: "Registration not found." }); return; }
    res.json({ message: `Top Management registration ${status.toLowerCase()}.` });
  } catch (error) { next(error); }
});
/** Delete both related tables atomically. Never delete accounts from a client-supplied industry alone. */
router.delete("/registrations/:userId", async (req, res, next) => {
  const confirmedUserId = req.body?.confirmUserId;
  const confirmedIndustry = req.body?.confirmIndustry;
  if (typeof confirmedUserId !== "string" || confirmedUserId !== req.params.userId ||
      typeof confirmedIndustry !== "string" || !confirmedIndustry.trim()) {
    res.status(400).json({ message: "Confirm the exact User ID and Industry before deleting." });
    return;
  }
  let connection: PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [matches] = await connection.execute<RowDataPacket[]>(
      "SELECT UserID, Industry FROM TopMgmt_Users WHERE UserID=? AND role='Top Management' FOR UPDATE",
      [req.params.userId],
    );
    if (!matches.length) {
      await connection.rollback(); res.status(404).json({ message: "Top Management registration not found." }); return;
    }
    const industry = String(matches[0].Industry);
    if (industry !== confirmedIndustry) {
      await connection.rollback(); res.status(409).json({ message: "Industry changed; refresh and confirm deletion again." }); return;
    }
    // Industry is a UNIQUE parent key, so this deletes only this manager's users.
    // Delete children first, because Dept_Users normally has ON DELETE RESTRICT.
    const [removedChildren] = await connection.execute<ResultSetHeader>(
      "DELETE FROM Dept_Users WHERE industry=?", [industry],
    );
    const [removedParent] = await connection.execute<ResultSetHeader>(
      "DELETE FROM TopMgmt_Users WHERE UserID=? AND Industry=? AND role='Top Management'",
      [req.params.userId, industry],
    );
    if (removedParent.affectedRows !== 1) {
      throw new Error("Delete cancelled: the management record changed during the operation.");
    }
    await connection.commit();
    revokeDeletedIndustrySessions(req.params.userId, industry);
    res.json({ message: `Deleted Top Management ${req.params.userId} and ${removedChildren.affectedRows} associated department user(s).`,
      deletedDepartmentUsers: removedChildren.affectedRows });
  } catch (error) { if (connection) await connection.rollback().catch(() => undefined); next(error); }
  finally { connection?.release(); }
});

export default router;
