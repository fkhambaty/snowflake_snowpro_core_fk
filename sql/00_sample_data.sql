-- Sample grocery rows for DMart labs (run as ROLE_CORE_LAB_ADMIN)
-- If USE ROLE fails: run sql/00_privilege_repair.sql as ACCOUNTADMIN first.
USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE DMART;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER,
  FULL_NAME   STRING,
  EMAIL       STRING,
  PHONE       STRING,
  STATE     STRING,
  ID_LAST4   STRING
);

INSERT INTO CUSTOMERS VALUES
  (1, 'Asha Patel',    'asha.patel@example.com',    '+91-98200-01001', 'MH', '4821'),
  (2, 'Ravi Shah',     'ravi.shah@example.com',     '+91-98200-01002', 'MH', '9033'),
  (3, 'Meera Iyer',    'meera.iyer@example.com',    '+91-98450-01003', 'KA', '1174'),
  (4, 'Farhan Qureshi','farhan.q@example.com',      '+91-98200-01004', 'MH', '6608'),
  (5, 'Ananya Reddy',  'ananya.reddy@example.com',  '+91-98490-01005', 'TS', '2290');

CREATE OR REPLACE TABLE ORDERS (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  ORDER_TS     TIMESTAMP_NTZ,
  AMOUNT_INR   NUMBER(10,2),
  STATUS       STRING
);

INSERT INTO ORDERS VALUES
  (101, 1, '2026-01-05 10:00:00', 499.00,  'SHIPPED'),
  (102, 1, '2026-01-12 11:30:00', 125.00,  'SHIPPED'),
  (103, 2, '2026-01-08 09:15:00', 1890.00, 'RETURNED'),
  (104, 3, '2026-02-01 14:00:00', 752.50,  'SHIPPED'),
  (105, 4, '2026-02-03 16:45:00', 331.00,  'PENDING');

CREATE OR REPLACE TABLE EVENTS_RAW (
  EVENT_ID   NUMBER,
  PAYLOAD    VARIANT
);

INSERT INTO EVENTS_RAW
SELECT 1, PARSE_JSON('{"event":"scan","aisle":"staples","user":{"id":1,"plan":"loyalty"}}')
UNION ALL
SELECT 2, PARSE_JSON('{"event":"purchase","sku":"DM-SOAP","qty":2,"user":{"id":2,"plan":"loyalty"}}');

SELECT 'CUSTOMERS' AS T, COUNT(*) AS N FROM CUSTOMERS
UNION ALL SELECT 'ORDERS', COUNT(*) FROM ORDERS
UNION ALL SELECT 'EVENTS_RAW', COUNT(*) FROM EVENTS_RAW;
