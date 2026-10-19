-- Sample rows for Alpine Retail labs (run as ROLE_CORE_LAB_ADMIN)
USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER,
  FULL_NAME   STRING,
  EMAIL       STRING,
  PHONE       STRING,
  COUNTRY     STRING,
  SSN_LAST4   STRING
);

INSERT INTO CUSTOMERS VALUES
  (1, 'Ava Patel',   'ava.patel@example.com',   '+1-555-0101', 'US', '1234'),
  (2, 'Ben Okonkwo', 'ben.okonkwo@example.com', '+1-555-0102', 'US', '5678'),
  (3, 'Chen Wei',    'chen.wei@example.com',    '+1-555-0103', 'CA', '9012'),
  (4, 'Diana Rossi', 'diana.rossi@example.com', '+1-555-0104', 'US', '3456'),
  (5, 'Evan Ng',     'evan.ng@example.com',     '+1-555-0105', 'UK', '7890');

CREATE OR REPLACE TABLE ORDERS (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  ORDER_TS     TIMESTAMP_NTZ,
  AMOUNT_USD   NUMBER(10,2),
  STATUS       STRING
);

INSERT INTO ORDERS VALUES
  (101, 1, '2026-01-05 10:00:00', 49.99,  'SHIPPED'),
  (102, 1, '2026-01-12 11:30:00', 12.50,  'SHIPPED'),
  (103, 2, '2026-01-08 09:15:00', 199.00, 'RETURNED'),
  (104, 3, '2026-02-01 14:00:00', 75.25,  'SHIPPED'),
  (105, 4, '2026-02-03 16:45:00', 33.10,  'PENDING');

CREATE OR REPLACE TABLE EVENTS_RAW (
  EVENT_ID   NUMBER,
  PAYLOAD    VARIANT
);

INSERT INTO EVENTS_RAW
SELECT 1, PARSE_JSON('{"event":"click","page":"/home","user":{"id":1,"plan":"gold"}}')
UNION ALL
SELECT 2, PARSE_JSON('{"event":"purchase","sku":"SKU-9","qty":2,"user":{"id":2,"plan":"silver"}}');

SELECT 'CUSTOMERS' AS T, COUNT(*) AS N FROM CUSTOMERS
UNION ALL SELECT 'ORDERS', COUNT(*) FROM ORDERS
UNION ALL SELECT 'EVENTS_RAW', COUNT(*) FROM EVENTS_RAW;
