-- Leather Nexus V31. Run on a backup/empty DB first. Older tables are NOT dropped.
CREATE DATABASE IF NOT EXISTS dct CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dct;

CREATE TABLE IF NOT EXISTS Main_User (
  Userid VARCHAR(20) NOT NULL PRIMARY KEY,
  Password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS TopMgmt_Users (
  UserID VARCHAR(20) NOT NULL PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  Industry VARCHAR(255) NOT NULL,
  Address TEXT NOT NULL,
  Email VARCHAR(254) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'Top Management',
  status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  UNIQUE KEY uq_top_management_industry (Industry),
  UNIQUE KEY uq_top_management_email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Dept_Users (
  UserID VARCHAR(20) NOT NULL PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  emailid VARCHAR(255) NOT NULL,
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Active','Suspended') NOT NULL DEFAULT 'Active',
  INDEX ix_department_industry (industry),
  CONSTRAINT fk_department_industry FOREIGN KEY (industry)
    REFERENCES TopMgmt_Users (Industry) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Development only; change this credential before any deployment.
INSERT INTO Main_User (Userid, Password) VALUES ('Admin', 'P@ssc0de')
  ON DUPLICATE KEY UPDATE Userid = Userid;
