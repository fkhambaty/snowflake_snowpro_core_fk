-- DMart — Lab 18: Secure Data Sharing (provider side)
-- Run as ROLE_CORE_LAB_ADMIN (needs CREATE SHARE — granted in 00_bootstrap).
-- Consumer must be a *different* Snowflake account (or reader account).

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;

-- Shared object lives in SHARE_DEMO (not raw PII tables)
USE SCHEMA SHARE_DEMO;

CREATE OR REPLACE VIEW V_PRODUCT_CATALOG AS
SELECT 1 AS PRODUCT_ID, 'Chakki Atta 10kg' AS PRODUCT_NAME, 420.00 AS LIST_PRICE
UNION ALL
SELECT 2, 'Toor Dal 1kg', 145.00
UNION ALL
SELECT 3, 'Sunflower Oil 1L', 160.00;

-- Create the share (empty container until you grant objects into it)
CREATE SHARE IF NOT EXISTS DMART_PRODUCT_SHARE
  COMMENT = 'DMart catalog share for Core lab';

-- Grant USAGE so consumers can see the building + room, then SELECT on the view
GRANT USAGE ON DATABASE DMART TO SHARE DMART_PRODUCT_SHARE;
GRANT USAGE ON SCHEMA DMART.SHARE_DEMO TO SHARE DMART_PRODUCT_SHARE;
GRANT SELECT ON VIEW DMART.SHARE_DEMO.V_PRODUCT_CATALOG TO SHARE DMART_PRODUCT_SHARE;

SHOW SHARES LIKE 'DMART_PRODUCT_SHARE';
SHOW GRANTS TO SHARE DMART_PRODUCT_SHARE;

-- To actually deliver data, add a consumer account (different account locator):
-- ALTER SHARE DMART_PRODUCT_SHARE ADD ACCOUNTS = <org_name>.<account_name>;
--
-- Or create a reader account (provider-managed, consumer has no full Snowflake account):
-- CREATE MANAGED ACCOUNT <reader_name> ADMIN_NAME = ... ADMIN_PASSWORD = ...
--   TYPE = READER, ...
-- then ADD that account to the share.
--
-- Marketplace listings / Native Apps / Clean Rooms: awareness in the HTML see-cards.
-- Hands-on here is provider-side direct share only.

SELECT * FROM SHARE_DEMO.V_PRODUCT_CATALOG;
