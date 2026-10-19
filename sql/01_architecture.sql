-- Alpine Retail / SnowPro Core — Lab 01
-- Three-layer architecture + editions awareness
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00 bootstrap.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

-- =============================================================================
-- Layer awareness (comments for the exam — not executable "layers")
-- =============================================================================
-- 1) DATABASE STORAGE  — micro-partitions on cloud object storage
-- 2) QUERY PROCESSING  — virtual warehouses (compute credits)
-- 3) CLOUD SERVICES    — auth, metadata, optimizer, result cache coordination
--
-- Editions (feature matrix — know for COF-C03):
--   Standard          — Time Travel default 1 day (up to 1)
--   Enterprise        — Time Travel up to 90 days; Multi-cluster WH
--   Business Critical — + Tri-Secret Secure, PrivateLink, more
--   VPS               — dedicated virtual private Snowflake

-- Who / where am I?
SELECT CURRENT_ACCOUNT() AS account_locator,
       CURRENT_REGION()  AS region,
       CURRENT_ROLE()    AS role,
       CURRENT_WAREHOUSE() AS warehouse,
       CURRENT_DATABASE()  AS database,
       CURRENT_SCHEMA()    AS schema;

-- Account parameters (edition-related knobs show up here)
SHOW PARAMETERS LIKE 'DATA_RETENTION_TIME_IN_DAYS' IN ACCOUNT;
SHOW PARAMETERS LIKE 'MIN_DATA_RETENTION_TIME_IN_DAYS' IN ACCOUNT;

-- Permanent vs Transient — Fail-safe / TT tradeoff demo
CREATE OR REPLACE TABLE LAB.DEMO_PERM_TINY (
  ID NUMBER,
  NOTE STRING
);

CREATE OR REPLACE TRANSIENT TABLE LAB.DEMO_TRANS_TINY (
  ID NUMBER,
  NOTE STRING
);

INSERT INTO LAB.DEMO_PERM_TINY VALUES (1, 'has Fail-safe after TT');
INSERT INTO LAB.DEMO_TRANS_TINY VALUES (1, 'no Fail-safe — cheaper storage');

SHOW TABLES LIKE 'DEMO_%' IN SCHEMA LAB;

-- Prove warehouse is compute context, not a storage container
SELECT CURRENT_WAREHOUSE() AS compute_engine_only;

-- Cleanup optional demos (keep if you want for Lab 04)
-- DROP TABLE IF EXISTS LAB.DEMO_PERM_TINY;
-- DROP TABLE IF EXISTS LAB.DEMO_TRANS_TINY;
