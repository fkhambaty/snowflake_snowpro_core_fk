-- Alpine Retail / SnowPro Core — Lab 15
-- QUALIFY · PIVOT awareness · MERGE · UDF · stored proc · VARIANT / FLATTEN
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00 (LAB.ORDERS, LAB.EVENTS_RAW).

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

-- Ensure sample tables exist
CREATE TABLE IF NOT EXISTS LAB.ORDERS (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  ORDER_TS     TIMESTAMP_NTZ,
  AMOUNT_USD   NUMBER(10,2),
  STATUS       STRING
);

CREATE TABLE IF NOT EXISTS LAB.EVENTS_RAW (
  EVENT_ID   NUMBER,
  PAYLOAD    VARIANT
);

-- ---------------------------------------------------------------------------
-- QUALIFY — filter window-function results without a subquery wrapper
-- Latest order per customer
-- ---------------------------------------------------------------------------
SELECT
  ORDER_ID,
  CUSTOMER_ID,
  ORDER_TS,
  AMOUNT_USD,
  ROW_NUMBER() OVER (PARTITION BY CUSTOMER_ID ORDER BY ORDER_TS DESC) AS RN
FROM LAB.ORDERS
QUALIFY RN = 1;

-- ---------------------------------------------------------------------------
-- PIVOT awareness (shape may vary with data) — statuses as columns
-- ---------------------------------------------------------------------------
SELECT *
FROM (
  SELECT CUSTOMER_ID, STATUS, AMOUNT_USD
  FROM LAB.ORDERS
)
PIVOT (
  SUM(AMOUNT_USD) FOR STATUS IN ('SHIPPED', 'PENDING', 'RETURNED')
) AS P
ORDER BY CUSTOMER_ID;

-- ---------------------------------------------------------------------------
-- MERGE INTO — upsert pattern (Curated from a staging-like source)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TABLE LAB.ORDERS_UPSERT_DEMO (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  STATUS       STRING,
  AMOUNT_USD   NUMBER(10,2)
);

MERGE INTO LAB.ORDERS_UPSERT_DEMO t
USING LAB.ORDERS s
ON t.ORDER_ID = s.ORDER_ID
WHEN MATCHED THEN UPDATE SET
  t.STATUS = s.STATUS,
  t.AMOUNT_USD = s.AMOUNT_USD,
  t.CUSTOMER_ID = s.CUSTOMER_ID
WHEN NOT MATCHED THEN INSERT (ORDER_ID, CUSTOMER_ID, STATUS, AMOUNT_USD)
  VALUES (s.ORDER_ID, s.CUSTOMER_ID, s.STATUS, s.AMOUNT_USD);

SELECT * FROM LAB.ORDERS_UPSERT_DEMO ORDER BY ORDER_ID;

-- ---------------------------------------------------------------------------
-- Simple SQL UDF
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION LAB.FN_USD_TO_CENTS(AMOUNT NUMBER)
  RETURNS NUMBER
  LANGUAGE SQL
AS
  $$ SELECT (AMOUNT * 100)::NUMBER $$;

SELECT ORDER_ID, AMOUNT_USD, LAB.FN_USD_TO_CENTS(AMOUNT_USD) AS CENTS
FROM LAB.ORDERS
LIMIT 5;

-- ---------------------------------------------------------------------------
-- Tiny Snowflake Scripting stored procedure
-- ---------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE LAB.SP_COUNT_ORDERS()
  RETURNS STRING
  LANGUAGE SQL
AS
$$
DECLARE
  n NUMBER;
BEGIN
  SELECT COUNT(*) INTO n FROM LAB.ORDERS;
  RETURN 'ORDERS row count = ' || n;
END;
$$;

CALL LAB.SP_COUNT_ORDERS();

-- JavaScript proc alternative (same idea — pick one for the exam story)
-- CREATE OR REPLACE PROCEDURE LAB.SP_COUNT_ORDERS_JS()
--   RETURNS STRING
--   LANGUAGE JAVASCRIPT
-- AS
-- $$
--   var rs = snowflake.execute({sqlText: 'SELECT COUNT(*) AS N FROM LAB.ORDERS'});
--   rs.next();
--   return 'ORDERS row count = ' + rs.getColumnValue('N');
-- $$;

-- ---------------------------------------------------------------------------
-- VARIANT + FLATTEN on LAB.EVENTS_RAW
-- Path syntax: payload:event  or  payload['user']['id']
-- ---------------------------------------------------------------------------
SELECT
  EVENT_ID,
  PAYLOAD:event::STRING AS EVENT_TYPE,
  PAYLOAD:user.id::NUMBER AS USER_ID,
  PAYLOAD:user.plan::STRING AS PLAN
FROM LAB.EVENTS_RAW;

-- Lateral FLATTEN — explode nested objects/arrays into rows
SELECT
  e.EVENT_ID,
  f.KEY,
  f.VALUE
FROM LAB.EVENTS_RAW e,
LATERAL FLATTEN(INPUT => e.PAYLOAD) f;

SELECT 'Lab 15 SQL + VARIANT ready' AS STATUS;
