-- Alpine Retail / SnowPro Core — Lab 03
-- Micro-partitions, clustering keys, storage awareness
-- Run as ROLE_CORE_LAB_ADMIN after Lab 00.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

-- Orders-by-date table (clustering demo)
CREATE OR REPLACE TABLE LAB.ORDERS_BY_DATE (
  ORDER_ID   NUMBER,
  ORDER_DATE DATE,
  CUSTOMER_ID NUMBER,
  AMOUNT     NUMBER(10,2)
);

INSERT INTO LAB.ORDERS_BY_DATE VALUES
  (1, '2024-01-05', 1, 42.00),
  (2, '2024-01-18', 2, 19.50),
  (3, '2024-02-02', 1, 88.00),
  (4, '2024-02-14', 3, 15.00),
  (5, '2024-03-01', 2, 120.00),
  (6, '2024-03-22', 4, 33.25),
  (7, '2024-04-10', 1, 55.00),
  (8, '2024-04-28', 5, 9.99);

-- Filter on ORDER_DATE — pruning can skip micro-partitions outside the range
SELECT *
FROM LAB.ORDERS_BY_DATE
WHERE ORDER_DATE BETWEEN '2024-03-01' AND '2024-03-31';

-- Optional clustering key (tiny table = little benefit; pattern matters for exam)
ALTER TABLE LAB.ORDERS_BY_DATE CLUSTER BY (ORDER_DATE);

-- Clustering health (may be sparse on tiny demo — still know the function)
SELECT SYSTEM$CLUSTERING_INFORMATION('ALPINE_RETAIL.LAB.ORDERS_BY_DATE');

-- Storage footprint awareness
SHOW TABLES LIKE 'ORDERS_BY_DATE' IN SCHEMA LAB;

SELECT TABLE_NAME,
       ACTIVE_BYTES,
       TIME_TRAVEL_BYTES,
       FAILSAFE_BYTES
FROM TABLE(INFORMATION_SCHEMA.TABLE_STORAGE_METRICS)
WHERE TABLE_CATALOG = 'ALPINE_RETAIL'
  AND TABLE_SCHEMA = 'LAB'
  AND TABLE_NAME = 'ORDERS_BY_DATE';
