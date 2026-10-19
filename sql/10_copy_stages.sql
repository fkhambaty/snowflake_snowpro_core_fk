-- Alpine Retail / SnowPro Core — Lab 10 · Stages, file formats, COPY
-- Windows-friendly: seed with INSERT, unload via COPY INTO @stage,
-- reload with COPY INTO table (no local PUT required).
-- Optional PUT path commented for SnowSQL users.

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA PIPELINE;

-- ---------------------------------------------------------------------------
-- 1) File formats
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FILE FORMAT FF_CSV_CUSTOMERS
  TYPE = CSV
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  NULL_IF = ('', 'NULL');

CREATE OR REPLACE FILE FORMAT FF_JSON_EVENTS
  TYPE = JSON
  STRIP_OUTER_ARRAY = TRUE;

-- ---------------------------------------------------------------------------
-- 2) Named internal stage (+ directory table metadata)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE STAGE STG_ALPINE_LOAD
  FILE_FORMAT = FF_CSV_CUSTOMERS
  DIRECTORY = (ENABLE = TRUE)
  COMMENT = 'Lab 10 internal stage for COPY demos';

SHOW STAGES LIKE 'STG_ALPINE%';
DESC STAGE STG_ALPINE_LOAD;

-- ---------------------------------------------------------------------------
-- 3) Target table + seed rows (INSERT — no PUT)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TABLE CUSTOMERS_LOAD (
  CUSTOMER_ID NUMBER,
  FULL_NAME   STRING,
  EMAIL       STRING,
  COUNTRY     STRING
);

INSERT INTO CUSTOMERS_LOAD VALUES
  (10, 'Fran Kim',   'fran.kim@example.com',   'US'),
  (11, 'Gita Singh', 'gita.singh@example.com', 'CA'),
  (12, 'Hugo Diaz',  'hugo.diaz@example.com',  'US');

SELECT * FROM CUSTOMERS_LOAD ORDER BY CUSTOMER_ID;

-- ---------------------------------------------------------------------------
-- 4) Unload: COPY INTO stage FROM (SELECT …)
-- ---------------------------------------------------------------------------
COPY INTO @STG_ALPINE_LOAD/customers_unload/
  FROM (
    SELECT CUSTOMER_ID, FULL_NAME, EMAIL, COUNTRY
      FROM CUSTOMERS_LOAD
  )
  FILE_FORMAT = (FORMAT_NAME = 'FF_CSV_CUSTOMERS')
  OVERWRITE = TRUE
  HEADER = TRUE;

LIST @STG_ALPINE_LOAD/customers_unload/;

ALTER STAGE STG_ALPINE_LOAD REFRESH;
SELECT RELATIVE_PATH, SIZE, LAST_MODIFIED
  FROM DIRECTORY(@STG_ALPINE_LOAD)
 LIMIT 20;

-- ---------------------------------------------------------------------------
-- 5) VALIDATION_MODE — check files without loading
-- ---------------------------------------------------------------------------
COPY INTO CUSTOMERS_LOAD
FROM @STG_ALPINE_LOAD/customers_unload/
FILE_FORMAT = (FORMAT_NAME = 'FF_CSV_CUSTOMERS')
VALIDATION_MODE = 'RETURN_ERRORS';
-- Expect: validation result only — table row count unchanged

-- ---------------------------------------------------------------------------
-- 6) Reload with TRANSFORM + ON_ERROR = CONTINUE
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TABLE CUSTOMERS_LOAD_2 (
  CUSTOMER_ID NUMBER,
  FULL_NAME   STRING,
  EMAIL       STRING,
  COUNTRY     STRING,
  LOADED_AT   TIMESTAMP_NTZ
);

COPY INTO CUSTOMERS_LOAD_2 (CUSTOMER_ID, FULL_NAME, EMAIL, COUNTRY, LOADED_AT)
FROM (
  SELECT
    $1::NUMBER,
    UPPER($2::STRING),
    $3::STRING,
    $4::STRING,
    CURRENT_TIMESTAMP()
  FROM @STG_ALPINE_LOAD/customers_unload/
)
FILE_FORMAT = (FORMAT_NAME = 'FF_CSV_CUSTOMERS')
ON_ERROR = 'CONTINUE';

SELECT * FROM CUSTOMERS_LOAD_2 ORDER BY CUSTOMER_ID;

-- ---------------------------------------------------------------------------
-- 7) ON_ERROR options awareness (comment)
-- ---------------------------------------------------------------------------
/*
-- ON_ERROR = 'ABORT_STATEMENT'  -- default: fail entire load on first bad row
-- ON_ERROR = 'CONTINUE'         -- skip bad rows, load good ones
-- ON_ERROR = 'SKIP_FILE'        -- skip whole file on error
-- PURGE = TRUE                  -- delete stage files after successful load
*/

-- ---------------------------------------------------------------------------
-- 8) Optional local PUT (SnowSQL) — hard in Snowsight on Windows
-- ---------------------------------------------------------------------------
/*
-- PUT file://customers.csv @STG_ALPINE_LOAD/raw/ AUTO_COMPRESS=TRUE;
-- LIST @STG_ALPINE_LOAD/raw/;
-- COPY INTO CUSTOMERS_LOAD FROM @STG_ALPINE_LOAD/raw/
--   FILE_FORMAT = (FORMAT_NAME = 'FF_CSV_CUSTOMERS')
--   ON_ERROR = 'ABORT_STATEMENT'
--   PURGE = TRUE;
*/

-- ---------------------------------------------------------------------------
-- 9) JSON file format + VARIANT landing (INSERT for tiny demo)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TABLE EVENTS_STAGE_LOAD (PAYLOAD VARIANT);

INSERT INTO EVENTS_STAGE_LOAD
SELECT PARSE_JSON(COLUMN1)
  FROM VALUES
    ('{"event":"click","user":1}'),
    ('{"event":"purchase","user":2}');

SELECT * FROM EVENTS_STAGE_LOAD;

-- Stage types (exam):
--   User stage   @~
--   Table stage  @%TABLE_NAME
--   Named stage  @STG_ALPINE_LOAD   ← this lab
--   External     @ext_stage (s3/azure/gcs + storage integration)
