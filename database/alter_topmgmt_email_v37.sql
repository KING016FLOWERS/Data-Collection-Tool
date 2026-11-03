-- Leather Nexus V37: run ONCE against an existing V36 (or earlier) database.
-- Back up the database before running these statements.
USE dct;

-- Add the email attribute without inventing addresses for existing accounts.
ALTER TABLE TopMgmt_Users
  ADD COLUMN Email VARCHAR(254) NULL AFTER Address;

-- Enforce case-insensitive uniqueness (table collation: utf8mb4_unicode_ci).
-- MySQL permits multiple NULLs; NEW registrations cannot use NULL because
-- frontend and backend require and validate Email before INSERT.
ALTER TABLE TopMgmt_Users
  ADD UNIQUE KEY uq_top_management_email (Email);

-- Identify existing registrations that must supply their real email addresses.
SELECT UserID, Industry, Email
FROM TopMgmt_Users
WHERE Email IS NULL OR Email = '';

-- Backfill each legacy account with a verified, UNIQUE email address, e.g.:
-- UPDATE TopMgmt_Users SET Email = 'actual.person@company.com' WHERE UserID = 'TM1001';

-- OPTIONAL, after all existing rows have a unique non-empty Email:
-- SELECT COUNT(*) AS without_email FROM TopMgmt_Users WHERE Email IS NULL OR Email = '';
-- ALTER TABLE TopMgmt_Users MODIFY COLUMN Email VARCHAR(254) NOT NULL;
-- The fresh-install schema already defines Email NOT NULL.
