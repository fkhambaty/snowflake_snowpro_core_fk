-- DMart — Lab 04
-- Permanent / Transient / Temporary / External / Iceberg / Dynamic Tables
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Permanent (default) — Time Travel + Fail-safe
CREATE OR REPLACE TABLE LAB.T_PERM (
  ID NUMBER,
  LABEL STRING
);
INSERT INTO LAB.T_PERM VALUES (1, 'permanent');

-- Transient — Time Travel yes (default 1 day), Fail-safe NO
CREATE OR REPLACE TRANSIENT TABLE LAB.T_TRANS (
  ID NUMBER,
  LABEL STRING
);
INSERT INTO LAB.T_TRANS VALUES (1, 'transient');

-- Temporary — session-scoped; gone when session ends; no Fail-safe
CREATE OR REPLACE TEMPORARY TABLE LAB.T_TEMP (
  ID NUMBER,
  LABEL STRING
);
INSERT INTO LAB.T_TEMP VALUES (1, 'temporary — this session only');

SELECT 'PERM' AS kind, * FROM LAB.T_PERM
UNION ALL
SELECT 'TRANS', * FROM LAB.T_TRANS
UNION ALL
SELECT 'TEMP', * FROM LAB.T_TEMP;

SHOW TABLES LIKE 'T_%' IN SCHEMA LAB;

-- External tables = metadata over files on a stage (read-oriented)
-- Need an external stage + files. Pattern only (uncomment when stage has data):
-- CREATE OR REPLACE EXTERNAL TABLE LAB.EXT_ORDERS (
--   ORDER_ID NUMBER AS (VALUE:c1::NUMBER),
--   AMOUNT   NUMBER AS (VALUE:c2::NUMBER)
-- )
-- LOCATION = @LAB.STG_INBOUND/orders/
-- FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1)
-- AUTO_REFRESH = FALSE;

-- Iceberg tables (COF-C03 awareness) — needs catalog + external volume setup.
-- Often unavailable on bare trial without admin setup. Keep commented:
-- CREATE ICEBERG TABLE LAB.IB_ORDERS (
--   ORDER_ID NUMBER,
--   AMOUNT   NUMBER(10,2)
-- )
-- CATALOG = 'SNOWFLAKE'
-- EXTERNAL_VOLUME = 'my_ext_vol'
-- BASE_LOCATION = 'orders/';

-- Dynamic Tables — incremental pipeline object (needs source + lag)
-- May require Enterprise+ features / account settings. Pattern:
CREATE OR REPLACE TABLE LAB.DT_SOURCE (
  EVENT_ID NUMBER,
  EVENT_TS TIMESTAMP_NTZ,
  PAYLOAD  STRING
);
INSERT INTO LAB.DT_SOURCE VALUES
  (1, CURRENT_TIMESTAMP(), 'click'),
  (2, CURRENT_TIMESTAMP(), 'purchase');

-- If CREATE DYNAMIC TABLE fails on your trial, skip — know the syntax for the exam:
-- CREATE OR REPLACE DYNAMIC TABLE LAB.DT_EVENTS
--   TARGET_LAG = '1 minute'
--   WAREHOUSE = WH_CORE_XS
-- AS
--   SELECT EVENT_ID, EVENT_TS, PAYLOAD
--   FROM LAB.DT_SOURCE;

SELECT * FROM LAB.DT_SOURCE;
