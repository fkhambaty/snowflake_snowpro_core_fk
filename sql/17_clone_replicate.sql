-- DMart — Lab 17: Zero-copy clone & replication (concepts)
-- Run as ROLE_CORE_LAB_ADMIN. Tiny chunks match docs/lab-17.html.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Source table (reuse customers if present; else tiny stub)
CREATE TABLE IF NOT EXISTS CUSTOMERS (
  CUSTOMER_ID NUMBER,
  FULL_NAME   STRING,
  EMAIL       STRING,
  PHONE       STRING,
  STATE     STRING,
  ID_LAST4   STRING
);

-- Zero-copy table clone: metadata pointer, no byte copy yet
CREATE OR REPLACE TABLE CUSTOMERS_CLONE CLONE CUSTOMERS;

SELECT COUNT(*) AS CLONE_ROWS FROM CUSTOMERS_CLONE;

-- Schema clone
CREATE OR REPLACE SCHEMA LAB_CLONE CLONE LAB;

-- Database clone (separate DB — useful for Dev/QA)
CREATE OR REPLACE DATABASE DMART_DEV CLONE DMART;

-- Divergence demo: change the clone → NEW micro-partitions → storage charges begin
UPDATE DMART.LAB.CUSTOMERS_CLONE
  SET FULL_NAME = 'Cloned Name Change'
  WHERE CUSTOMER_ID = 1;

-- Original unchanged (prove independence after write)
SELECT CUSTOMER_ID, FULL_NAME FROM DMART.LAB.CUSTOMERS WHERE CUSTOMER_ID = 1;
SELECT CUSTOMER_ID, FULL_NAME FROM DMART.LAB.CUSTOMERS_CLONE WHERE CUSTOMER_ID = 1;

-- ---------------------------------------------------------------------------
-- Replication / failover — CONCEPTUAL (needs second account + often Business Critical)
-- Do NOT run blindly on a trial. Left commented for exam awareness.
-- ---------------------------------------------------------------------------
-- -- On primary account (ACCOUNTADMIN):
-- ALTER DATABASE DMART ENABLE REPLICATION TO ACCOUNTS <org>.<account>;
--
-- -- Create secondary on the other account, then refresh:
-- CREATE DATABASE DMART AS REPLICA OF <org>.<primary_account>.DMART;
-- ALTER DATABASE DMART REFRESH;
--
-- Failover groups / client redirect: Business Critical (and above) for many HA features.
-- Secondary is read-only until failover promotes it.

-- Optional cleanup
-- DROP TABLE IF EXISTS DMART.LAB.CUSTOMERS_CLONE;
-- DROP SCHEMA IF EXISTS DMART.LAB_CLONE;
-- DROP DATABASE IF EXISTS DMART_DEV;
