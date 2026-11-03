-- OPTIONAL migration template. DO NOT RUN before registering and approving the correct Industry.
-- This does NOT assign an Industry automatically. It imports only users you explicitly map.
USE dct;

CREATE TEMPORARY TABLE IF NOT EXISTS Legacy_Industry_Map (
  UserID VARCHAR(20) PRIMARY KEY,
  Industry VARCHAR(255) NOT NULL
);

-- MANUALLY review each old user and insert explicit mappings, for example:
-- INSERT INTO Legacy_Industry_Map (UserID, Industry)
-- VALUES ('USR0001', 'EXACT APPROVED INDUSTRY NAME');

-- Old password values are preserved as-is; the new login verifies bcrypt
-- and can verify legacy plaintext values temporarily. Reset old plaintext
-- user passwords promptly via the Top Management Users page.
INSERT INTO Dept_Users (UserID, password, name, department, industry, emailid, created_time, status)
SELECT old.UserID, old.password, old.name, old.department, mapping.Industry,
       old.emailid, old.created_time,
       CASE WHEN old.status = 'Active' THEN 'Active' ELSE 'Suspended' END
FROM users AS old
JOIN Legacy_Industry_Map AS mapping ON mapping.UserID = old.UserID
JOIN TopMgmt_Users AS manager ON manager.Industry = mapping.Industry AND manager.status = 'Approved'
WHERE NOT EXISTS (SELECT 1 FROM Dept_Users AS existing WHERE existing.UserID = old.UserID);

-- Verify each migrated user and its mapped Industry before enabling access:
SELECT UserID, name, department, industry, status FROM Dept_Users ORDER BY industry, UserID;
