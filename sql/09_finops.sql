-- Alpine Retail / SnowPro Core — Lab 09 · FinOps (resource monitors & usage)
-- Run monitor DDL as ACCOUNTADMIN. Queries as ROLE_CORE_LAB_ADMIN OK.
-- ACCOUNT_USAGE views can lag ~45 minutes to 3 hours — exam loves this.

USE ROLE ACCOUNTADMIN;

-- ---------------------------------------------------------------------------
-- 1) Resource monitor — notify then suspend at thresholds
-- ---------------------------------------------------------------------------
CREATE OR REPLACE RESOURCE MONITOR RM_ALPINE_LAB
  WITH CREDIT_QUOTA = 20
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS
    ON 50 PERCENT DO NOTIFY
    ON 75 PERCENT DO NOTIFY
    ON 100 PERCENT DO SUSPEND;

SHOW RESOURCE MONITORS LIKE 'RM_ALPINE%';

-- Attach to daily warehouse (monitor watches this WH's credits)
ALTER WAREHOUSE WH_CORE_XS SET RESOURCE_MONITOR = RM_ALPINE_LAB;

-- Optional: also attach medium WH used in scale demos
ALTER WAREHOUSE WH_CORE_M SET RESOURCE_MONITOR = RM_ALPINE_LAB;

-- Inspect
SHOW WAREHOUSES LIKE 'WH_CORE%';

-- ---------------------------------------------------------------------------
-- 2) Credit math awareness (comments — relative sizes)
-- ---------------------------------------------------------------------------
/*
-- Relative credit burn while a WH is running (approx, standard sizes):
--   X-Small (XS) = 1 credit / hour
--   Small         = 2
--   Medium (M)    = 4
--   Large         = 8
--   … doubles each full size step
-- Auto-suspend stops warehouse compute credits when idle.
-- Cloud Services layer has its own metering (metadata, auth, etc.) —
--   often offset daily; exam: not "free forever", separate from WH credits.
*/

-- ---------------------------------------------------------------------------
-- 3) ACCOUNT_USAGE — warehouse metering (lag warning)
-- ---------------------------------------------------------------------------
USE ROLE ACCOUNTADMIN;
-- Prefer ACCOUNTADMIN or a role granted IMPORTED PRIVILEGES on SNOWFLAKE

SELECT START_TIME, END_TIME, WAREHOUSE_NAME,
       CREDITS_USED, CREDITS_USED_COMPUTE, CREDITS_USED_CLOUD_SERVICES
  FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
 WHERE WAREHOUSE_NAME IN ('WH_CORE_XS', 'WH_CORE_M')
   AND START_TIME >= DATEADD(day, -7, CURRENT_TIMESTAMP())
 ORDER BY START_TIME DESC
 LIMIT 20;
-- If empty: wait for lag, or you haven't burned credits yet this week.

-- ---------------------------------------------------------------------------
-- 4) QUERY_HISTORY sample (who burned what)
-- ---------------------------------------------------------------------------
SELECT START_TIME, USER_NAME, ROLE_NAME, WAREHOUSE_NAME,
       TOTAL_ELAPSED_TIME, BYTES_SCANNED,
       LEFT(QUERY_TEXT, 80) AS QUERY_START
  FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
 WHERE START_TIME >= DATEADD(day, -1, CURRENT_TIMESTAMP())
 ORDER BY START_TIME DESC
 LIMIT 15;

-- Information Schema alternative (faster, shorter retention — session):
USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
SELECT QUERY_ID, USER_NAME, WAREHOUSE_NAME, EXECUTION_STATUS,
       TOTAL_ELAPSED_TIME
  FROM TABLE(INFORMATION_SCHEMA.QUERY_HISTORY_BY_SESSION())
 ORDER BY START_TIME DESC
 LIMIT 10;

-- ---------------------------------------------------------------------------
-- 5) Cleanup note — leave monitor attached for the course, or detach:
-- ---------------------------------------------------------------------------
/*
ALTER WAREHOUSE WH_CORE_XS UNSET RESOURCE_MONITOR;
ALTER WAREHOUSE WH_CORE_M UNSET RESOURCE_MONITOR;
DROP RESOURCE MONITOR IF EXISTS RM_ALPINE_LAB;
*/
