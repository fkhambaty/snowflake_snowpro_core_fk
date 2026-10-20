-- DMart — Lab 08 · Governance (masking, RAP, tags)
-- Requires Lab 00 LAB.CUSTOMERS and Lab 06 FR_ANALYST (for proof).
-- Proof: run FR_ANALYST block separately with USE SECONDARY ROLES NONE.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA SECURE;

-- ---------------------------------------------------------------------------
-- 1) PII table in SECURE (clone/copy from LAB.CUSTOMERS)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TABLE CUSTOMERS_PII AS
SELECT * FROM DMART.LAB.CUSTOMERS;

SELECT COUNT(*) AS N FROM CUSTOMERS_PII;

-- ---------------------------------------------------------------------------
-- 2) Masking policy on EMAIL — only lab admin / ACCOUNTADMIN see clear text
--    Policies use CURRENT_ROLE() = primary role (secondaries ignored for body)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE MASKING POLICY MP_EMAIL_MASK AS (VAL STRING)
  RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('ROLE_CORE_LAB_ADMIN', 'ACCOUNTADMIN')
      THEN VAL
    ELSE REGEXP_REPLACE(VAL, '.+@', '****@')
  END;

ALTER TABLE CUSTOMERS_PII
  MODIFY COLUMN EMAIL
  SET MASKING POLICY MP_EMAIL_MASK;

-- ---------------------------------------------------------------------------
-- 3) Row access policy on STATE — analysts see Maharashtra only
-- ---------------------------------------------------------------------------
CREATE OR REPLACE ROW ACCESS POLICY RAP_STATE_MH AS (STATE STRING)
  RETURNS BOOLEAN ->
  CASE
    WHEN CURRENT_ROLE() IN ('ROLE_CORE_LAB_ADMIN', 'ACCOUNTADMIN')
      THEN TRUE
    WHEN CURRENT_ROLE() = 'FR_ANALYST' AND STATE = 'MH'
      THEN TRUE
    ELSE FALSE
  END;

ALTER TABLE CUSTOMERS_PII
  ADD ROW ACCESS POLICY RAP_STATE_MH ON (STATE);

-- ---------------------------------------------------------------------------
-- 4) Object tags (cost / compliance labels)
-- ---------------------------------------------------------------------------
CREATE TAG IF NOT EXISTS TAG_COST_CENTER
  ALLOWED_VALUES 'RETAIL_OPS', 'DATA_PLATFORM', 'MARKETING'
  COMMENT = 'Chargeback label';

CREATE TAG IF NOT EXISTS TAG_DATA_CLASS
  ALLOWED_VALUES 'PUBLIC', 'INTERNAL', 'PII', 'SENSITIVE'
  COMMENT = 'Classification label';

ALTER TABLE CUSTOMERS_PII SET TAG
  TAG_COST_CENTER = 'RETAIL_OPS',
  TAG_DATA_CLASS = 'PII';

ALTER TABLE CUSTOMERS_PII MODIFY COLUMN EMAIL
  SET TAG TAG_DATA_CLASS = 'PII';

SHOW TAGS IN SCHEMA SECURE;
SELECT SYSTEM$GET_TAG(
  'DMART.SECURE.TAG_DATA_CLASS',
  'DMART.SECURE.CUSTOMERS_PII',
  'TABLE'
) AS TABLE_CLASS;

-- ---------------------------------------------------------------------------
-- 5) Classification / lineage awareness (comments — features vary by edition)
-- ---------------------------------------------------------------------------
/*
-- Data Classification (Snowsight / ALTERs): suggest tags for PII columns.
-- Lineage (Snowsight / Account Usage / Horizon): which objects feed which.
-- Exam: lineage helps impact analysis; tags help cost + compliance reporting.
-- Clean Rooms (intro): collaborate on sensitive data without sharing raw rows.
*/

-- ---------------------------------------------------------------------------
-- 6) Proof as ROLE_CORE_LAB_ADMIN — clear email, all states
-- ---------------------------------------------------------------------------
SELECT CUSTOMER_ID, FULL_NAME, EMAIL, STATE
  FROM CUSTOMERS_PII
 ORDER BY CUSTOMER_ID;
-- Expect: full emails · MH + KA + TS rows

-- ---------------------------------------------------------------------------
-- 7) Grant SELECT path for FR_ANALYST via AR_LAB_READ (Lab 06)
-- ---------------------------------------------------------------------------
GRANT USAGE ON DATABASE DMART TO ROLE AR_LAB_READ;
GRANT USAGE ON SCHEMA DMART.SECURE TO ROLE AR_LAB_READ;
GRANT SELECT ON TABLE DMART.SECURE.CUSTOMERS_PII TO ROLE AR_LAB_READ;

-- ---------------------------------------------------------------------------
-- 8) Proof as FR_ANALYST — masked email, Maharashtra rows only
--    Run this block ALONE in a new worksheet:
-- ---------------------------------------------------------------------------
/*
USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;

SELECT CURRENT_ROLE(), CURRENT_SECONDARY_ROLES();
SELECT CUSTOMER_ID, FULL_NAME, EMAIL, STATE
  FROM SECURE.CUSTOMERS_PII
 ORDER BY CUSTOMER_ID;
-- Expect: EMAIL like ****@example.com · STATE = MH only (no KA/TS)
*/

-- ---------------------------------------------------------------------------
-- 9) Inspect policies
-- ---------------------------------------------------------------------------
USE ROLE ROLE_CORE_LAB_ADMIN;
DESC MASKING POLICY MP_EMAIL_MASK;
DESC ROW ACCESS POLICY RAP_STATE_MH;
