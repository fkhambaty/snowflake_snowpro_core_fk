-- DMart — Lab 16: Time Travel & Fail-safe
-- Run as ROLE_CORE_LAB_ADMIN. Tiny chunks match docs/lab-16.html.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Scratch table for DROP / UNDROP / AT|BEFORE demos
CREATE OR REPLACE TABLE SCRATCH_TT (
  ID   NUMBER,
  NOTE STRING
);

INSERT INTO SCRATCH_TT VALUES (1, 'v1-original');

-- Capture a marker before the "bad" change (exam-style: BEFORE is exclusive of the stmt)
-- SELECT CURRENT_TIMESTAMP();  -- note the time if you prefer TIMESTAMP instead of OFFSET

UPDATE SCRATCH_TT SET NOTE = 'v2-oops-bad-edit' WHERE ID = 1;

-- Time Travel: see the prior version (offset in seconds; adjust if needed)
SELECT * FROM SCRATCH_TT AT(OFFSET => -60);

-- Or BEFORE a statement id from QUERY_HISTORY / last DML (exam syntax awareness)
-- SELECT * FROM SCRATCH_TT BEFORE(STATEMENT => '<query_id>');

-- Retention knob (Standard default 1 day; Enterprise can go up to 90)
SHOW PARAMETERS LIKE 'DATA_RETENTION_TIME_IN_DAYS' IN TABLE SCRATCH_TT;

ALTER TABLE SCRATCH_TT SET DATA_RETENTION_TIME_IN_DAYS = 1;

-- Clone at a past point (zero-copy snapshot of history still in retention)
CREATE OR REPLACE TABLE SCRATCH_TT_CLONE_AT
  CLONE SCRATCH_TT AT(OFFSET => -60);

SELECT * FROM SCRATCH_TT_CLONE_AT;

-- DROP then UNDROP (user-recoverable while inside Time Travel window)
DROP TABLE SCRATCH_TT;

UNDROP TABLE SCRATCH_TT;

SELECT * FROM SCRATCH_TT;

-- Fail-safe: NOT something you query. After Time Travel expires, only Snowflake Support
-- can recover (7 days for permanent tables). Transient/temp: no Fail-safe.
-- UNDROP also works for DATABASE and SCHEMA within retention.

-- Cleanup optional scratch clone
-- DROP TABLE IF EXISTS SCRATCH_TT_CLONE_AT;
