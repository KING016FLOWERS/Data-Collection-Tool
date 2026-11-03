import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { TEMPORARY_LOGIN } from "../auth/temporaryCredentials.js";
dotenv.config();
const dbName = process.env.DB_NAME ?? "dct";
if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
    throw new Error("DB_NAME may contain only letters, numbers and underscores.");
}
const common = {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
};
export const pool = mysql.createPool({
    ...common,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
});
let databaseReady = false;
let lastDatabaseError = "Database has not been initialized yet.";
export function getDatabaseStatus() {
    return { ready: databaseReady, error: databaseReady ? null : lastDatabaseError };
}
export async function ensureSchema() {
    try {
        const bootstrap = await mysql.createConnection(common);
        await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await bootstrap.end();
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        ID INT NOT NULL AUTO_INCREMENT,
        UserID VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        emailid VARCHAR(255) NOT NULL,
        created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(30) NOT NULL DEFAULT 'Active',
        PRIMARY KEY (ID),
        UNIQUE KEY uq_users_userid (UserID)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // This temporary authentication table has exactly the requested three columns.
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS Main_Login (
        userID VARCHAR(20) NOT NULL PRIMARY KEY,
        Password VARCHAR(255) NOT NULL,
        remarks VARCHAR(255) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // TEMPORARY LOCAL LOGIN ONLY: store the specified plaintext password.
        // Upsert resets TM1001 on every backend start to replace any old bcrypt value.
        // Only TM1001 is affected; other Main_Login records remain unchanged.
        await pool.execute(`INSERT INTO Main_Login (userID, Password, remarks)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE Password = ?, remarks = ?`, [
            TEMPORARY_LOGIN.userID,
            TEMPORARY_LOGIN.password,
            TEMPORARY_LOGIN.remarks,
            TEMPORARY_LOGIN.password,
            TEMPORARY_LOGIN.remarks,
        ]);
        console.log("Temporary Main_Login record TM1001 is ready (development-only plaintext).");
        databaseReady = true;
        lastDatabaseError = "";
    }
    catch (error) {
        databaseReady = false;
        lastDatabaseError = error instanceof Error ? error.message : String(error);
        throw error;
    }
}
