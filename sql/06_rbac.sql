-- Alpine Retail / SnowPro Core — Lab 06 · RBAC
-- Run as ROLE_CORE_LAB_ADMIN (Lab 00 must exist: LAB.CUSTOMERS).
-- Proof blocks: run separately — do NOT "Run All" past USE ROLE FR_ANALYST.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;

-- ---------------------------------------------------------------------------
-- 1) Functional roles (job badges) + access role (key-ring)
-- ---------------------------------------------------------------------------
CREATE ROLE IF NOT EXISTS FR_ANALYST
  COMMENT = 'Alpine analyst — Kai job badge';

CREATE ROLE IF NOT EXISTS FR_DATA_ENGINEER
  COMMENT = 'Alpine data engineer — Riley job badge';

CREATE ROLE IF NOT EXISTS AR_LAB_READ
  COMMENT = 'Access role: SELECT on LAB practice tables';

-- ---------------------------------------------------------------------------
-- 2) USAGE on database + schema (required before object grants matter)
-- ---------------------------------------------------------------------------
GRANT USAGE ON DATABASE ALPINE_RETAIL TO ROLE AR_LAB_READ;
GRANT USAGE ON SCHEMA ALPINE_RETAIL.LAB TO ROLE AR_LAB_READ;

-- ---------------------------------------------------------------------------
-- 3) Object privilege → access role → functional role (never grant table→FR direct)
-- ---------------------------------------------------------------------------
GRANT SELECT ON TABLE ALPINE_RETAIL.LAB.CUSTOMERS TO ROLE AR_LAB_READ;

GRANT ROLE AR_LAB_READ TO ROLE FR_ANALYST;
GRANT ROLE AR_LAB_READ TO ROLE FR_DATA_ENGINEER;

-- Warehouse so FR roles can run SELECT
GRANT USAGE ON WAREHOUSE WH_CORE_XS TO ROLE FR_ANALYST;
GRANT USAGE ON WAREHOUSE WH_CORE_XS TO ROLE FR_DATA_ENGINEER;

-- Attach FR roles to your login (edit username)
-- GRANT ROLE FR_ANALYST TO USER IDENTIFIER('"YOUR_USERNAME"');
-- GRANT ROLE FR_DATA_ENGINEER TO USER IDENTIFIER('"YOUR_USERNAME"');

-- ---------------------------------------------------------------------------
-- 4) Inspect grants (ownership + privilege trail)
-- ---------------------------------------------------------------------------
SHOW GRANTS ON TABLE ALPINE_RETAIL.LAB.CUSTOMERS;
SHOW GRANTS TO ROLE AR_LAB_READ;
SHOW GRANTS TO ROLE FR_ANALYST;
SHOW GRANTS OF ROLE AR_LAB_READ;

-- Who owns the table? (creator / OWNERSHIP privilege)
SHOW GRANTS ON TABLE ALPINE_RETAIL.LAB.CUSTOMERS;
-- Look for privilege OWNERSHIP → ROLE_CORE_LAB_ADMIN

-- ---------------------------------------------------------------------------
-- 5) Proof — FR_ANALYST can SELECT (SECONDARY ROLES NONE required)
-- Run this block alone in a new worksheet after granting FR_ANALYST to your user.
-- ---------------------------------------------------------------------------
USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;

SELECT CURRENT_ROLE(), CURRENT_SECONDARY_ROLES();
SELECT CUSTOMER_ID, FULL_NAME, COUNTRY
  FROM LAB.CUSTOMERS
 ORDER BY CUSTOMER_ID
 LIMIT 5;
-- Expect: rows returned

-- ---------------------------------------------------------------------------
-- 6) Proof — without AR_LAB_READ, SELECT fails
-- Demo: revoke then re-grant (run as ROLE_CORE_LAB_ADMIN in another worksheet)
-- ---------------------------------------------------------------------------
/*
USE ROLE ROLE_CORE_LAB_ADMIN;
REVOKE ROLE AR_LAB_READ FROM ROLE FR_ANALYST;

USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
SELECT * FROM ALPINE_RETAIL.LAB.CUSTOMERS;  -- expect: insufficient privileges

USE ROLE ROLE_CORE_LAB_ADMIN;
GRANT ROLE AR_LAB_READ TO ROLE FR_ANALYST;
*/

-- ---------------------------------------------------------------------------
-- 7) Ownership concept (optional demo — leave commented unless teaching transfer)
-- ---------------------------------------------------------------------------
/*
USE ROLE ROLE_CORE_LAB_ADMIN;
-- Transfer ownership of a demo table (creates dependence on FR_DATA_ENGINEER)
CREATE OR REPLACE TABLE LAB.RBAC_OWNERSHIP_DEMO (ID NUMBER);
GRANT OWNERSHIP ON TABLE LAB.RBAC_OWNERSHIP_DEMO
  TO ROLE FR_DATA_ENGINEER COPY CURRENT GRANTS;
SHOW GRANTS ON TABLE LAB.RBAC_OWNERSHIP_DEMO;
*/

-- ---------------------------------------------------------------------------
-- 8) Future grants awareness (schema-level — new tables inherit SELECT for AR)
-- ---------------------------------------------------------------------------
GRANT SELECT ON FUTURE TABLES IN SCHEMA ALPINE_RETAIL.LAB TO ROLE AR_LAB_READ;

SHOW FUTURE GRANTS IN SCHEMA ALPINE_RETAIL.LAB;
