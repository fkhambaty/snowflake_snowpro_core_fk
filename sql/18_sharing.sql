-- Alpine Retail / SnowPro Core — Lab 18: Secure Data Sharing (provider side)
-- Run as ROLE_CORE_LAB_ADMIN (needs CREATE SHARE — granted in 00_bootstrap).
-- Consumer must be a *different* Snowflake account (or reader account).

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;

-- Shared object lives in SHARE_DEMO (not raw PII tables)
USE SCHEMA SHARE_DEMO;

CREATE OR REPLACE VIEW V_PRODUCT_CATALOG AS
SELECT 1 AS PRODUCT_ID, 'Trail Jacket' AS PRODUCT_NAME, 129.00 AS LIST_PRICE
UNION ALL
SELECT 2, 'Alpine Cap', 24.00
UNION ALL
SELECT 3, 'Summit Pack', 89.00;

-- Create the share (empty container until you grant objects into it)
CREATE SHARE IF NOT EXISTS ALPINE_PRODUCT_SHARE
  COMMENT = 'Alpine Retail catalog share for Core lab';

-- Grant USAGE so consumers can see the building + room, then SELECT on the view
GRANT USAGE ON DATABASE ALPINE_RETAIL TO SHARE ALPINE_PRODUCT_SHARE;
GRANT USAGE ON SCHEMA ALPINE_RETAIL.SHARE_DEMO TO SHARE ALPINE_PRODUCT_SHARE;
GRANT SELECT ON VIEW ALPINE_RETAIL.SHARE_DEMO.V_PRODUCT_CATALOG TO SHARE ALPINE_PRODUCT_SHARE;

SHOW SHARES LIKE 'ALPINE_PRODUCT_SHARE';
SHOW GRANTS TO SHARE ALPINE_PRODUCT_SHARE;

-- To actually deliver data, add a consumer account (different account locator):
-- ALTER SHARE ALPINE_PRODUCT_SHARE ADD ACCOUNTS = <org_name>.<account_name>;
--
-- Or create a reader account (provider-managed, consumer has no full Snowflake account):
-- CREATE MANAGED ACCOUNT <reader_name> ADMIN_NAME = ... ADMIN_PASSWORD = ...
--   TYPE = READER, ...
-- then ADD that account to the share.
--
-- Marketplace listings / Native Apps / Clean Rooms: awareness in the HTML see-cards.
-- Hands-on here is provider-side direct share only.

SELECT * FROM SHARE_DEMO.V_PRODUCT_CATALOG;
