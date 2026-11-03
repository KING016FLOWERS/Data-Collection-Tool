# DCT Management Portal — Secure Temporary Login V14

This version builds on the V13 unified sustainable executive theme and adds the login and one-hour session flow.

## Login workflow

1. The **index `/` route** is now a username/password login (no direct Management Portal button).
2. The backend validates the supplied credentials against MySQL `dct.Main_Login`.
3. A valid login redirects to `/dashboard` (Top Management).
4. The sidebar provides an explicit **Sign out** button.
5. An HttpOnly, SameSite=Strict cookie holds an opaque random server-side session token.
6. The session expires **exactly 60 minutes after login** (fixed expiration; activity does not renew it).
7. The frontend logs out when the timer expires; the backend rejects all expired session tokens even if a tab is suspended.
8. Every `/dashboard`, `/users`, and `/modules/01`–`/modules/18` React route is gated by the session; all `/api/users` and `/api/modules` endpoints also require authentication.

## Temporary database table

`database/schema.sql` and the backend initializer create **exactly** this table:

```sql
CREATE TABLE IF NOT EXISTS Main_Login (
  userID VARCHAR(20) NOT NULL PRIMARY KEY,
  Password VARCHAR(255) NOT NULL,
  remarks VARCHAR(255) NULL
);
```

The `Password` column stores a **bcrypt hash**, not the plaintext password. No session columns or additional tables are required. The existing `users` table remains independent and unchanged.

## First run on Windows PowerShell

From the extracted project root:

```powershell
npm install
copy backend\.env.example backend\.env
notepad backend\.env
npm run dev
```

Set the correct MySQL username/password in `backend/.env`. The example environment already contains the **temporary** bootstrap login ID/password requested. On first startup, if `Main_Login` has no row for that User ID, Node bcrypt-hashes the temporary password and inserts the record. Subsequent restarts do **not** overwrite the account or password. If a row with the same ID already exists, verify its stored password instead of expecting reseeding.

- Frontend: http://localhost:5173
- API: http://127.0.0.1:5000/api
- API status: http://127.0.0.1:5000/api/health
- Login: http://localhost:5173

**Security notes:** The example credentials are known and are intended only for temporary, private testing. Change the password before deployment and never commit `backend/.env` to a repository. Sessions use a temporary **in-memory** store, so users are automatically logged out on a backend restart; for multiple production instances, a shared secure session store is needed. The API is intended to be served from the same origin using the included Vite proxy during development. For deployment, serve over HTTPS with `NODE_ENV=production` and configure allowed client origin.

## Validation

From root, `npm run build` runs backend and frontend TypeScript compilation and Vite build after dependencies are installed.
