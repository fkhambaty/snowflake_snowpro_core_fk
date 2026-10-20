-- DMart — Lab 05
-- Interfaces, Snowpark overview, Cortex / Streamlit / Notebooks awareness
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Session context (Snowsight worksheet or SnowSQL — same SQL)
SELECT CURRENT_USER()      AS login_user,
       CURRENT_ROLE()      AS role,
       CURRENT_WAREHOUSE() AS warehouse,
       CURRENT_ACCOUNT()   AS account,
       CURRENT_REGION()    AS region,
       CURRENT_VERSION()   AS snowflake_version;

SHOW WAREHOUSES LIKE 'WH_CORE%';
SHOW DATABASES LIKE 'DMART%';

-- Interfaces (exam awareness — not all are SQL objects):
--   Snowsight     — web UI / worksheets / dashboards
--   SnowSQL       — CLI client
--   Drivers       — JDBC / ODBC / Python / Node / Go / .NET
--   Connectors    — Spark, Kafka, etc.
--   Snowpark      — DataFrame API in Python/Java/Scala running near data
--   Notebooks     — interactive cells in Snowflake
--   Streamlit in Snowflake — apps hosted in the account (SiS)

-- Cortex AI (optional — may fail on trial / no privileges)
-- Uncomment only if your account has Cortex enabled:
-- SELECT SNOWFLAKE.CORTEX.SENTIMENT('DMart had a great quarter') AS sentiment;
-- SELECT SNOWFLAKE.CORTEX.COMPLETE(
--   'snowflake-arctic',
--   'Say hello to Priya in one short sentence.'
-- ) AS reply;

-- Prove ordinary SQL still works without Cortex
SELECT 'interfaces ok' AS status,
       COUNT(*) AS product_rows
FROM LAB.PRODUCTS;
