import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const text = relative => readFileSync(join(root, relative), "utf8");
const front = text("frontend/src/pages/MainAdminPage.tsx");
const reg = text("frontend/src/pages/TopManagementRegistrationPage.tsx");
const api = text("frontend/src/services/api.ts");
const route = text("backend/src/routes/registration.routes.ts");
const admin = text("backend/src/routes/admin.routes.ts");
const schema = text("database/schema.sql");
const migration = text("database/alter_topmgmt_email_v37.sql");

assert.match(front, /text-center text-xs font-extrabold uppercase/);
assert.match(front, /text-center text-sm/);
assert.match(front, /view === "table"/);
assert.match(front, /view === "grid"/);
assert.match(front, /registration\.email/);
assert.match(front, /registration\.address/);
assert.match(front, /adminApi\.setStatus/);
assert.match(reg, /type="email"/);
assert.match(reg, /registrationApi\.checkEmail/);
assert.match(reg, /registrationApi\.register/);
assert.match(api, /checkEmail: \(email: string\)/);
assert.match(route, /router\.get\("\/check-email"/);
assert.match(route, /isValidRegistrationEmail\(email\)/);
assert.match(route, /INSERT INTO TopMgmt_Users[\s\S]*Email/);
assert.match(route, /ER_DUP_ENTRY/);
assert.match(admin, /Email AS email/);
assert.match(schema, /Email VARCHAR\(254\) NOT NULL/);
assert.match(schema, /uq_top_management_email/);
assert.match(migration, /ADD COLUMN Email VARCHAR\(254\) NULL/);
assert.match(migration, /ADD UNIQUE KEY uq_top_management_email/);

function loadValidation(relative) {
  const source = text(relative);
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(compiled, context);
  return context.exports;
}
for (const file of ["backend/src/auth/emailValidation.ts", "frontend/src/utils/emailValidation.ts"]) {
  const { normalizeEmail, isValidRegistrationEmail } = loadValidation(file);
  assert.equal(normalizeEmail(" Person@Example.Com "), "person@example.com");
  for (const valid of ["person@company.com", "hr.manager+test@industry.co.in", "USER_01@EXAMPLE.COM"]) assert.equal(isValidRegistrationEmail(valid), true, `${file} should accept ${valid}`);
  for (const invalid of ["", "hello", "person@", "person @example.com", "person..two@example.com", "person@-example.com", "person@example.c", "a".repeat(65)+"@example.com"]) assert.equal(isValidRegistrationEmail(invalid), false, `${file} should reject ${invalid}`);
}
console.log("V37 UI, API, database migration, and frontend/backend email-validation checks passed.");
