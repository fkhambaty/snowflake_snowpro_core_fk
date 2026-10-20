-- DMart — Lab 13
-- Caches · pruning · Query Profile awareness · QAS awareness
-- Run as ROLE_CORE_LAB_ADMIN. Open Query Profile in Snowsight after each run.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Ensure ORDERS exists
CREATE TABLE IF NOT EXISTS LAB.ORDERS (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  ORDER_TS     TIMESTAMP_NTZ,
  AMOUNT_INR   NUMBER(10,2),
  STATUS       STRING
);

-- ---------------------------------------------------------------------------
-- 1) Selective query — good pruning candidate (narrow filter on STATUS)
-- After run: Snowsight → Query History → Profile → TableScan partitions scanned vs total
-- ---------------------------------------------------------------------------
SELECT ORDER_ID, CUSTOMER_ID, AMOUNT_INR, STATUS
FROM LAB.ORDERS
WHERE STATUS = 'PENDING';

-- ---------------------------------------------------------------------------
-- 2) Non-selective / transform-heavy — less pruning help
-- ---------------------------------------------------------------------------
SELECT
  STATUS,
  COUNT(*) AS N,
  SUM(AMOUNT_INR) AS TOTAL_INR,
  AVG(AMOUNT_INR) AS AVG_INR
FROM LAB.ORDERS
GROUP BY STATUS
ORDER BY TOTAL_INR DESC;

-- ---------------------------------------------------------------------------
-- 3) Result cache demo — identical query often hits result cache (0 WH cost)
-- Run twice quickly; second run may show "Result Cache" in Profile / history.
-- ---------------------------------------------------------------------------
SELECT ORDER_ID, AMOUNT_INR FROM LAB.ORDERS WHERE CUSTOMER_ID = 1 ORDER BY ORDER_ID;

-- Same text again:
SELECT ORDER_ID, AMOUNT_INR FROM LAB.ORDERS WHERE CUSTOMER_ID = 1 ORDER BY ORDER_ID;

-- RESULT_SCAN — re-read last query result without re-executing the original SQL
SELECT * FROM TABLE(RESULT_SCAN(LAST_QUERY_ID()));

-- ---------------------------------------------------------------------------
-- Clustering information — only useful if the table is clustered
-- LAB.ORDERS sample is tiny/unclustered; expect empty or skip on error.
-- ---------------------------------------------------------------------------
-- SELECT SYSTEM$CLUSTERING_INFORMATION('LAB.ORDERS');
-- Example when you have a clustered table:
-- ALTER TABLE LAB.ORDERS CLUSTER BY (STATUS);
-- SELECT SYSTEM$CLUSTERING_INFORMATION('LAB.ORDERS', '(STATUS)');

-- Query Acceleration Service (QAS) — Enterprise+ awareness
-- Offloads large scans/filters to serverless acceleration; not a substitute for pruning.
-- ALTER WAREHOUSE WH_CORE_XS SET ENABLE_QUERY_ACCELERATION = TRUE
--   QUERY_ACCELERATION_MAX_SCALE_FACTOR = 4;

SELECT 'Lab 13 profile demos run — open Query Profile in Snowsight' AS STATUS;
