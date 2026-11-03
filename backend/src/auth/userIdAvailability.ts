import type { RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";

export type UserIdAvailability = { available: boolean; message: string };
export function isValidNewUserId(value: unknown): value is string {
  return typeof value === "string" && !!value.trim() && value.trim().length <= 20;
}
export async function checkTopManagementUserId(id: string): Promise<UserIdAvailability> {
  const [top] = await pool.execute<RowDataPacket[]>(
    "SELECT UserID FROM TopMgmt_Users WHERE UserID=? LIMIT 1", [id]);
  if (top.length) return { available: false, message: "This User ID is already registered in Top Management." };
  // The login screen is shared across the three tables; IDs cannot overlap across roles.
  const [admin] = await pool.execute<RowDataPacket[]>(
    "SELECT Userid FROM Main_User WHERE Userid=? LIMIT 1", [id]);
  const [department] = await pool.execute<RowDataPacket[]>(
    "SELECT UserID FROM Dept_Users WHERE UserID=? LIMIT 1", [id]);
  if (admin.length || department.length) return { available: false, message: "This User ID is already used by another account type." };
  return { available: true, message: "User ID is available." };
}
export async function checkDepartmentUserId(id: string): Promise<UserIdAvailability> {
  const [department] = await pool.execute<RowDataPacket[]>(
    "SELECT UserID FROM Dept_Users WHERE UserID=? LIMIT 1", [id]);
  if (department.length) return { available: false, message: "This User ID already exists in Department Users." };
  const [admin] = await pool.execute<RowDataPacket[]>(
    "SELECT Userid FROM Main_User WHERE Userid=? LIMIT 1", [id]);
  const [top] = await pool.execute<RowDataPacket[]>(
    "SELECT UserID FROM TopMgmt_Users WHERE UserID=? LIMIT 1", [id]);
  if (admin.length || top.length) return { available: false, message: "This User ID is already used by another account type." };
  return { available: true, message: "User ID is available." };
}
