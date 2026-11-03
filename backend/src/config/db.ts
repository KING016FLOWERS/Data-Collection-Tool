import mysql from "mysql2/promise";
import dotenv from "dotenv";
import type { RowDataPacket } from "mysql2";

dotenv.config();
const dbName = process.env.DB_NAME ?? "dct";
if (!/^[A-Za-z0-9_]+$/.test(dbName)) throw new Error("Invalid database name.");
const connectionOptions = {
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
};
export const pool = mysql.createPool({
  ...connectionOptions, database: dbName, waitForConnections: true,
  connectionLimit: 10, charset: "utf8mb4",
});
let databaseReady = false;
let databaseError = "Not initialized";
export const getDatabaseStatus = () => ({ ready: databaseReady, error: databaseReady ? null : databaseError });

export async function ensureSchema() {
  try {
    const bootstrap = await mysql.createConnection(connectionOptions);
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await bootstrap.end();
    await pool.query(`CREATE TABLE IF NOT EXISTS Main_User (
      Userid VARCHAR(20) PRIMARY KEY NOT NULL,
      Password VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await pool.query(`CREATE TABLE IF NOT EXISTS TopMgmt_Users (
      UserID VARCHAR(20) PRIMARY KEY NOT NULL,
      password VARCHAR(255) NOT NULL,
      Industry VARCHAR(255) NOT NULL,
      Address TEXT NOT NULL,
      Email VARCHAR(254) NOT NULL,
      role VARCHAR(40) NOT NULL DEFAULT 'Top Management',
      status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
      UNIQUE KEY uq_top_management_industry (Industry),
      UNIQUE KEY uq_top_management_email (Email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // CREATE TABLE IF NOT EXISTS does not update existing installations. Require the
    // supplied one-time migration before serving registrations or Admin listings.
    const [emailColumns] = await pool.query<RowDataPacket[]>(
      "SHOW COLUMNS FROM TopMgmt_Users LIKE 'Email'"
    );
    if (!emailColumns.length) throw new Error("TopMgmt_Users.Email is missing. Run database/alter_topmgmt_email_v37.sql first.");
    const [emailIndexes] = await pool.query<RowDataPacket[]>(
      "SHOW INDEX FROM TopMgmt_Users WHERE Key_name = 'uq_top_management_email'"
    );
    if (!emailIndexes.length || Number(emailIndexes[0].Non_unique) !== 0) throw new Error("TopMgmt_Users.Email requires a UNIQUE index. Run database/alter_topmgmt_email_v37.sql first.");
    await pool.query(`CREATE TABLE IF NOT EXISTS Dept_Users (
      UserID VARCHAR(20) PRIMARY KEY NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      emailid VARCHAR(255) NOT NULL,
      created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status ENUM('Active', 'Suspended') NOT NULL DEFAULT 'Active',
      INDEX ix_department_industry (industry),
      CONSTRAINT fk_department_industry FOREIGN KEY (industry)
        REFERENCES TopMgmt_Users (Industry) ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // Set the requested temporary Main Admin credential only if not already present.
    // Environment variable may override the initial seed on a NEW database.
    await pool.execute(
      `INSERT INTO Main_User (Userid, Password) VALUES ('Admin', ?)
       ON DUPLICATE KEY UPDATE Userid = Userid`,
      [process.env.INITIAL_ADMIN_PASSWORD ?? "P@ssc0de"],
    );
    databaseReady = true;
    databaseError = "";
  } catch (error) {
    databaseReady = false;
    databaseError = error instanceof Error ? error.message : String(error);
    throw error;
  }
}
