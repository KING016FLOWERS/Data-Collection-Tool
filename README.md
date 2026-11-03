# Leather Nexus V31 — Three-account workflow

React 18 / TypeScript / Vite / TailwindCSS / Express / MySQL.

### Entry points
- `/` — shared login for `Main Admin`, approved `Top Management`, `Department User`.
- `/register/top-management` — public Top Management registration (`Pending`).
- `/admin` — Main Admin account approval/rejection dashboard.
- `/dashboard`, `/users`, `/modules/01`...`/modules/18` — Top Management only.
- `/user/modules/01`...`/user/modules/18` — dedicated departmental pages; restricted to assigned module.

### Key rules
- The `TopMgmt_Users.Industry` field is filled at registration and protected by Admin approval.
- Top Management can only list/create/update/suspend/delete `Dept_Users` belonging to **its own industry**.
- `Dept_Users.industry` is assigned **exclusively by the authenticated backend session**.
- Pending and Rejected management accounts cannot sign in; rejecting an approved account revokes its sessions.
- Department access requires both an Active department user and an Approved owner for its industry.
- `Main_User` seed: `Admin / P@ssc0de` (temporary development password only).
- Top Management and departmental passwords use bcrypt hashing. Session duration is 60 minutes **absolute**, not sliding.
- Existing V30 Top Management module pages and department user pages have not been replaced.

### Setup
From the project root:
```
npm install
copy backend\.env.example backend\.env
npm run dev
```
Set MySQL credentials in `backend/.env`. Open `http://localhost:5173`.

Read **MIGRATION_V31.md** before upgrading an existing database. Old `Main_Login` / `users`
tables are left as-is and are not auto-imported because Industry/Address cannot be inferred.


**Migration:** Read [MIGRATION_V31.md](MIGRATION_V31.md) before updating an existing database.

## V32 account registration and validation

New Top Management applicants register at `/register/top-management` and see an approval-pending popup before being redirected automatically to the shared login at `/`. Main Admin approves/rejects applicants at `/admin`. New/changed passwords require 8–15 characters with uppercase, lowercase, numbers and one of `# @ _ $` (no other special characters). User IDs are checked against the account-specific table and across roles because the login is shared. The logged-in industry is shown in the top band of every Top Management page. No database migration is needed. Run `npm run check:structure` for dependency-free regression assertions.


## V34 Department User submodules
See `CHANGELOG_V34.md`. HR (Department User Module 12) has 18 horizontal sections, grouping all 90 questions from the supplied HR questionnaire into a read-only preview ready for future data forms. Management pages are unchanged.

## Version 35 – Module 12 HR navigation

Department User Module 12 now has 16 A–P PDF-aligned People & Workplace sections and read-only previews of 186 master data fields. See `CHANGELOG_V35.md` for details.


## V37: Main Admin view and Top Management email

The Main Admin `/admin` page supports centered Table and responsive Grid views, search,
status filtering, and approval/rejection actions. Top Management sign-up now requires
a unique email address, validated by the frontend, API, and MySQL UNIQUE index.

**Existing DB users:** back up database `dct` and run
`database/alter_topmgmt_email_v37.sql` once before starting V37. Existing
accounts have a NULL Email until a verified address is backfilled. See
`CHANGELOG_V37.md` for details.
