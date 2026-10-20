-- DMart — Lab 02
-- Object catalog: show/create minimal examples
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

-- Account-level vs database-level awareness (SHOW only)
SHOW WAREHOUSES LIKE 'WH_CORE%';
SHOW DATABASES LIKE 'DMART%';
SHOW SCHEMAS IN DATABASE DMART;

-- TABLE (permanent practice object)
CREATE OR REPLACE TABLE LAB.PRODUCTS (
  PRODUCT_ID NUMBER,
  SKU        STRING,
  NAME       STRING,
  UNIT_PRICE NUMBER(10,2)
);

INSERT INTO LAB.PRODUCTS VALUES
  (1, 'DM-ATTA', 'Chakki Atta 10kg', 420.00),
  (2, 'DM-SOAP', 'Dishwash Bar', 20.00);

-- VIEW (virtual — no stored result set)
CREATE OR REPLACE VIEW LAB.V_PRODUCTS_CHEAP AS
SELECT PRODUCT_ID, SKU, NAME, UNIT_PRICE
FROM LAB.PRODUCTS
WHERE UNIT_PRICE < 100;

SELECT * FROM LAB.V_PRODUCTS_CHEAP;

-- SEQUENCE (auto numbers)
CREATE OR REPLACE SEQUENCE LAB.SEQ_ORDER_ID START = 1000 INCREMENT = 1;

SELECT LAB.SEQ_ORDER_ID.NEXTVAL AS next_id;
SELECT LAB.SEQ_ORDER_ID.NEXTVAL AS next_id;

-- FILE FORMAT (CSV recipe you reuse on stages)
CREATE OR REPLACE FILE FORMAT LAB.FF_CSV_STD
  TYPE = CSV
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"';

-- INTERNAL named STAGE (folder inside Snowflake)
CREATE OR REPLACE STAGE LAB.STG_INBOUND
  FILE_FORMAT = LAB.FF_CSV_STD;

SHOW STAGES IN SCHEMA LAB;
SHOW FILE FORMATS IN SCHEMA LAB;
SHOW SEQUENCES IN SCHEMA LAB;
SHOW VIEWS LIKE 'V_%' IN SCHEMA LAB;
SHOW TABLES LIKE 'PRODUCTS' IN SCHEMA LAB;

-- Awareness-only (create later labs — leave commented)
-- CREATE MATERIALIZED VIEW ...   -- stores precomputed results; cost/refresh tradeoffs
-- CREATE PIPE ...                -- Snowpipe continuous load
-- CREATE STREAM ...              -- CDC change feed
-- CREATE TASK ...                -- scheduled SQL
-- CREATE SHARE ...               -- outbound Secure Data Sharing
-- CREATE FUNCTION / PROCEDURE    -- UDF / stored procedure
