/** Dependency-free V31 architecture assertions. Run `node tests/verify-v31.mjs`. */
import assert from "node:assert/strict";
import fs from "node:fs";
const read = (name) => fs.readFileSync(name, "utf8");
const schema = read("database/schema.sql");
const server = read("backend/src/server.ts");
const backendUsers = read("backend/src/routes/users.routes.ts");
const login = read("backend/src/auth/login.routes.ts");
const sessions = read("backend/src/auth/sessions.ts");
const app = read("frontend/src/App.tsx");
const homepage = read("frontend/src/pages/HomePage.tsx");
const registration = read("backend/src/routes/registration.routes.ts");
const approvals = read("backend/src/routes/admin.routes.ts");
for (const name of ["Main_User", "TopMgmt_Users", "Dept_Users"]) {
  assert.match(schema, new RegExp(`CREATE TABLE IF NOT EXISTS ${name} \\(`));
}
assert.match(schema, /DEFAULT 'Pending'/);
assert.match(schema, /DEFAULT 'Top Management'/);
assert.match(backendUsers, /const industry = managementIndustry\(res\)/);
assert.match(backendUsers, /WHERE UserID=\? AND industry=\?/);
assert.match(backendUsers, /Dept_Users/);
assert.match(login, /Main_User/);
assert.match(login, /TopMgmt_Users/);
assert.match(login, /Dept_Users/);
assert.match(sessions, /SESSION_DURATION_MS = 60 \* 60 \* 1000/);
assert.match(sessions, /requireMainAdmin/);
assert.match(app, /path="\/admin"/);
assert.match(homepage, /\/register\/top-management/);
assert.match(server, /requireMainAdmin, adminRouter/);
assert.match(registration, /'Pending'/);
assert.match(approvals, /Approved/);
assert.match(approvals, /Rejected/);
for (let index = 1; index <= 18; index++) {
  const id = String(index).padStart(2, "0");
  assert.match(app, new RegExp(`path="/modules/${id}"`));
  assert.match(app, new RegExp(`path="/user/modules/${id}"`));
  assert.ok(fs.existsSync(`frontend/src/pages/modules/Module${id}Page.tsx`));
  assert.ok(fs.existsSync(`frontend/src/pages/user-modules/UserModule${id}Page.tsx`));
}
console.log("V31 architecture assertions passed: three roles, three tables, 36 module routes, industry scoping, 60-minute sessions.");
