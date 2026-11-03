import assert from "node:assert/strict";
import fs from "node:fs";
import childProcess from "node:child_process";
const read = (file) => fs.readFileSync(file, "utf8");
const policy = read("backend/src/auth/passwordPolicy.ts");
const uiPolicy = read("frontend/src/utils/passwordPolicy.ts");
const backendPattern = policy.match(/export const PASSWORD_PATTERN = \/(.+)\/;/)?.[1];
const uiPattern = uiPolicy.match(/export const PASSWORD_PATTERN = \/(.+)\/;/)?.[1];
assert.ok(backendPattern);
assert.equal(backendPattern, uiPattern, "backend and frontend password requirements must match");
const password = new RegExp(backendPattern);
for (const valid of ["Abcdef1#", "Pass_word7", "ABCabc123$", "Xy987654321@q", "Ab1###########Z", "Aa1$34567890123"]) {
  assert.ok(password.test(valid), `should accept ${valid}`);
}
for (const invalid of ["abcdef1#", "ABCDEF1#", "Abcdefg#", "Abcdef12", "Aa1#", "Abcdefghi12345#X", "Abcdef1!", "Abcdef1%", "Abc def1#", "Abcdef1-é"]) {
  assert.ok(!password.test(invalid), `should reject ${invalid}`);
}
const registration = read("backend/src/routes/registration.routes.ts");
const dept = read("backend/src/routes/users.routes.ts");
const ids = read("backend/src/auth/userIdAvailability.ts");
assert.match(registration, /checkTopManagementUserId\(normalizedId\)/);
assert.match(registration, /isValidPassword\(password\)/);
assert.match(dept, /checkDepartmentUserId\(userId.trim\(\)\)/);
assert.match(dept, /isValidPassword\(password\)/);
assert.match(ids, /FROM TopMgmt_Users/);
assert.match(ids, /FROM Dept_Users/);
assert.match(ids, /FROM Main_User/);
const popup = read("frontend/src/pages/TopManagementRegistrationPage.tsx");
assert.match(popup, /role="dialog"/);
assert.match(popup, /waiting for Main Admin approval/);
assert.match(popup, /window.setTimeout/);
const home = read("frontend/src/pages/HomePage.tsx");
assert.match(home, /Register Top Management/);
assert.match(read("frontend/src/layouts/ManagementLayout.tsx"), /session\?\.industry/);
assert.match(read("backend/src/auth/sessions.ts"), /SESSION_DURATION_MS = 60 \* 60 \* 1000/);
const app = read("frontend/src/App.tsx");
for (let i = 1; i <= 18; i++) {
  const id = String(i).padStart(2,"0");
  assert.ok(app.includes(`path="/modules/${id}"`));
  assert.ok(app.includes(`path="/user/modules/${id}"`));
}
childProcess.execFileSync(process.execPath,["tests/verify-v31.mjs"], {stdio:"inherit"});
console.log("V32 registration, password, ID uniqueness, role routes and industry-header checks passed.");
