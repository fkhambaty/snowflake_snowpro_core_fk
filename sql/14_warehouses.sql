-- Alpine Retail / SnowPro Core — Lab 14
-- Scale UP vs OUT · auto-suspend · multi-cluster awareness · statement timeout
-- IMPORTANT: leave student on WH_CORE_XS (cheap). Do not stay on MEDIUM.
-- Run as ROLE_CORE_LAB_ADMIN (OPERATE on WH_CORE_XS / WH_CORE_M from bootstrap).

USE ROLE ROLE_CORE_LAB_ADMIN;

-- Show current lab warehouses
SHOW WAREHOUSES LIKE 'WH_CORE%';

-- Daily cheap engine (idempotent — keep XS)
CREATE WAREHOUSE IF NOT EXISTS WH_CORE_XS
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Alpine Retail daily lab warehouse';

-- Bigger warehouse for scale-up demos only
CREATE WAREHOUSE IF NOT EXISTS WH_CORE_M
  WAREHOUSE_SIZE = 'MEDIUM'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Scale-up demos only (Lab 14)';

GRANT USAGE, OPERATE ON WAREHOUSE WH_CORE_XS TO ROLE ROLE_CORE_LAB_ADMIN;
GRANT USAGE, OPERATE ON WAREHOUSE WH_CORE_M TO ROLE ROLE_CORE_LAB_ADMIN;

-- ---------------------------------------------------------------------------
-- Scale UP demo: resize WH_CORE_M briefly, then shrink back
-- Resizing is online — running queries finish on old servers; new ones use new size.
-- ---------------------------------------------------------------------------
USE WAREHOUSE WH_CORE_M;

ALTER WAREHOUSE WH_CORE_M SET WAREHOUSE_SIZE = 'MEDIUM';
ALTER WAREHOUSE WH_CORE_M SET AUTO_SUSPEND = 60;
ALTER WAREHOUSE WH_CORE_M SET AUTO_RESUME = TRUE;

-- Tiny proof query on M
SELECT CURRENT_WAREHOUSE() AS WH, CURRENT_ROLE() AS ROLE;

-- Statement timeout (seconds) — exam: protects runaway queries
ALTER WAREHOUSE WH_CORE_M SET STATEMENT_TIMEOUT_IN_SECONDS = 3600;

-- ---------------------------------------------------------------------------
-- Multi-cluster warehouse (Enterprise+) — scale OUT for concurrency
-- MIN/MAX clusters add more warehouses of the same size for queued queries.
-- Standard edition: single cluster only. Leave commented if edition blocks.
-- ---------------------------------------------------------------------------
-- ALTER WAREHOUSE WH_CORE_M SET
--   MIN_CLUSTER_COUNT = 1
--   MAX_CLUSTER_COUNT = 3
--   SCALING_POLICY = 'STANDARD';

-- ---------------------------------------------------------------------------
-- ALWAYS return to cheap XS and suspend M
-- ---------------------------------------------------------------------------
ALTER WAREHOUSE WH_CORE_M SET WAREHOUSE_SIZE = 'XSMALL';
ALTER WAREHOUSE WH_CORE_M SUSPEND;
USE WAREHOUSE WH_CORE_XS;

SHOW WAREHOUSES LIKE 'WH_CORE%';

SELECT
  CURRENT_WAREHOUSE() AS ACTIVE_WH,
  'Stay on WH_CORE_XS for remaining labs' AS REMINDER;
