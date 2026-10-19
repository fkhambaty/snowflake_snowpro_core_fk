-- Alpine Retail / SnowPro Core — Lab 11
-- Snowpipe vs manual COPY · pipe object · Streaming awareness (COF-C03)
-- Run as ROLE_CORE_LAB_ADMIN after Labs 00 + 10 (stage + file format helpful).

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA PIPELINE;

-- Landing table for continuous loads (pipe COPY target)
CREATE OR REPLACE TABLE PIPELINE.STG_ORDERS_LANDING (
  ORDER_ID     NUMBER,
  CUSTOMER_ID  NUMBER,
  ORDER_TS     TIMESTAMP_NTZ,
  AMOUNT_USD   NUMBER(10,2),
  STATUS       STRING,
  LOADED_AT    TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Reuse LAB stage/file format if Lab 02/10 created them; else create minimal ones
CREATE SCHEMA IF NOT EXISTS LAB;
CREATE OR REPLACE FILE FORMAT LAB.FF_CSV_STD
  TYPE = CSV
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"';

CREATE STAGE IF NOT EXISTS LAB.STG_INBOUND
  FILE_FORMAT = LAB.FF_CSV_STD;

-- ---------------------------------------------------------------------------
-- CREATE PIPE — classic Snowpipe wraps a COPY statement
-- AUTO_INGEST = TRUE needs a cloud storage notification channel (SQS/SNS/Event Grid/PubSub).
-- Trial accounts often cannot wire the notification; the CREATE still teaches the object.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE PIPE PIPELINE.PIPE_ORDERS_AUTO
  AUTO_INGEST = FALSE
  COMMENT = 'Demo pipe — set AUTO_INGEST=TRUE + notification when cloud events are wired'
  AS
  COPY INTO PIPELINE.STG_ORDERS_LANDING (ORDER_ID, CUSTOMER_ID, ORDER_TS, AMOUNT_USD, STATUS)
  FROM (
    SELECT
      $1::NUMBER,
      $2::NUMBER,
      $3::TIMESTAMP_NTZ,
      $4::NUMBER(10,2),
      $5::STRING
    FROM @LAB.STG_INBOUND
  )
  FILE_FORMAT = (FORMAT_NAME = 'LAB.FF_CSV_STD');

SHOW PIPES LIKE 'PIPE_ORDERS%' IN SCHEMA PIPELINE;

-- Describe the pipe (definition + notification channel when AUTO_INGEST is on)
DESC PIPE PIPELINE.PIPE_ORDERS_AUTO;

-- Manual refresh (works when AUTO_INGEST = FALSE or to catch missed files)
-- ALTER PIPE PIPELINE.PIPE_ORDERS_AUTO REFRESH;

-- ---------------------------------------------------------------------------
-- Notification integration story (commented — needs cloud + CREATE INTEGRATION)
-- Exam: AUTO_INGEST pipe listens for storage events; you do NOT run COPY yourself.
-- ---------------------------------------------------------------------------
-- CREATE NOTIFICATION INTEGRATION IF NOT EXISTS NI_S3_ORDERS
--   TYPE = QUEUE
--   ENABLED = TRUE
--   NOTIFICATION_PROVIDER = AWS_SQS
--   AWS_SQS_ARN = 'arn:aws:sqs:...';
--
-- CREATE OR REPLACE PIPE PIPELINE.PIPE_ORDERS_AUTO
--   AUTO_INGEST = TRUE
--   -- AWS_SNS_TOPIC_ARN / integration linkage per cloud docs
--   AS
--   COPY INTO PIPELINE.STG_ORDERS_LANDING ... FROM @ext_stage/...;

-- ---------------------------------------------------------------------------
-- Contrast: batch COPY you schedule yourself (Lab 10 style)
-- ---------------------------------------------------------------------------
-- COPY INTO PIPELINE.STG_ORDERS_LANDING
--   FROM @LAB.STG_INBOUND
--   FILE_FORMAT = (FORMAT_NAME = 'LAB.FF_CSV_STD');

-- Pipe status / history helpers (safe SHOW/SELECT patterns)
SELECT SYSTEM$PIPE_STATUS('PIPELINE.PIPE_ORDERS_AUTO');

-- Snowpipe Streaming (COF-C03 awareness): rows via high-throughput SDK/API,
-- not file → stage → COPY. No CREATE PIPE object for the streaming path.
-- Use when clickstream/IoT needs sub-second ingest; classic pipe for files on blob storage.

SELECT 'Lab 11 pipe object ready' AS STATUS;
