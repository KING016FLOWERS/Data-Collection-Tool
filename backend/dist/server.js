import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { ensureSchema, getDatabaseStatus } from "./config/db.js";
import modulesRouter from "./routes/modules.routes.js";
import departmentRouter from "./routes/department.routes.js";
import usersRouter from "./routes/users.routes.js";
import loginRouter from "./auth/login.routes.js";
import { requireAuthentication, requireTopManagement } from "./auth/sessions.js";
dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 5000);
app.use(helmet({ crossOriginResourcePolicy: false }));
// In development all API calls travel through Vite's same-origin /api proxy.
// Do not expose credentialed APIs through permissive cross-origin rules.
app.use(express.json({ limit: "1mb" }));
app.use("/api", (_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
app.use((req, res, next) => {
    // Block cross-origin state-changing requests made with the browser session cookie.
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        const origin = req.headers.origin;
        const configuredClient = process.env.CLIENT_URL ?? "http://localhost:5173";
        const allowed = new Set([configuredClient, "http://localhost:5173", "http://127.0.0.1:5173"]);
        if (origin && !allowed.has(origin) && origin !== `${req.protocol}://${req.headers.host}`) {
            res.status(403).json({ message: "Cross-origin request blocked." });
            return;
        }
    }
    next();
});
app.get("/api/health", (_req, res) => {
    const database = getDatabaseStatus();
    res.status(200).json({ status: "ok", api: true, database });
});
app.use("/api/auth", loginRouter);
app.use("/api/modules", requireAuthentication, modulesRouter);
app.use("/api/department/modules", requireAuthentication, departmentRouter);
app.use("/api/users", requireAuthentication, requireTopManagement, usersRouter);
app.use((_req, res) => res.status(404).json({ message: "API route not found." }));
app.use((error, _req, res, _next) => {
    console.error(error);
    const message = error instanceof Error ? error.message : "Internal server error.";
    const databaseProblem = /ECONNREFUSED|Access denied|Unknown database|connect/i.test(message);
    res.status(databaseProblem ? 503 : 500).json({
        message: databaseProblem
            ? `Database connection failed: ${message}`
            : "Internal server error.",
    });
});
app.listen(port, "127.0.0.1", () => {
    console.log(`DCT API running on http://127.0.0.1:${port}`);
});
ensureSchema()
    .then(() => console.log("MySQL users and Main_Login tables are ready."))
    .catch((error) => {
    console.error("MySQL is not ready. The API remains online so /api/health can report the problem.");
    console.error(error instanceof Error ? error.message : error);
});
