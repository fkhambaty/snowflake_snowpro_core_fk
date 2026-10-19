/** Additional lab defs for gen_lab_html.mjs (07–10, 15, 17–19). */
export const MORE_LABS = [
  {
    n: 7,
    title: "Auth & network",
    eyebrow: "Account security 20%",
    h1: "MFA, SSO, key-pair, network policies, Trust Center",
    lede: "You may not configure every auth option in a trial — you <strong>must</strong> know what each is for on the exam.",
    problem: "Sam wants MFA everywhere. Riley needs a service user for CI. Kai’s home IP keeps getting locked out of experiments.",
    solution: "Clear map: passwords+MFA for humans, SSO/federated for companies, key-pair for services, network policies for IP allow/deny, Trust Center for posture visibility.",
    before: { title: "Auth mush", bullets: ["SSO = MFA?", "Key-pair for humans?", "Network policy = RBAC?"] },
    after: { title: "Right tool", bullets: ["MFA ≠ SSO", "Key-pair = services", "Network policy = IP gate", "Trust Center = posture"] },
    openComic: {
      title: "Sam vs convenience",
      askFace: "sam",
      askName: "Sam",
      askRole: "Compliance",
      ask: "Can we just share one ACCOUNTADMIN password in a vault chat?",
      ans: "Absolutely not. Humans: SSO + MFA. Break-glass tightly controlled. Services: key-pair or OAuth — never shared human passwords.",
      caption: "Auth answers who you are. RBAC answers what you can do. Network policy answers where from.",
    },
    see: [
      { label: "Human", title: "MFA", body: "Second factor on password/SSO login.", ex: "Phone / authenticator" },
      { label: "Company", title: "SSO / federated", body: "IdP (Okta/Azure AD…) asserts identity.", ex: "One login to many apps" },
      { label: "Service", title: "Key-pair", body: "Public key on user; private key in CI.", ex: "No human password" },
      { label: "Where", title: "Network policy + Trust Center", body: "Allow/deny IPs; Trust Center surfaces security posture.", ex: "C03 topic" },
    ],
    nextTitle: "governance",
    sqlFile: "sql/07_auth_network.sql",
    steps: [
      {
        title: "Inspect network policies (safe)",
        what: "List policies. Do NOT attach a deny-all to yourself.",
        sql: `USE ROLE ACCOUNTADMIN;
SHOW NETWORK POLICIES;
-- Example ONLY — do not set ALLOWED_IP_LIST empty:
-- CREATE NETWORK POLICY NP_ALPINE_OFFICE
--   ALLOWED_IP_LIST = ('203.0.113.10/32')
--   BLOCKED_IP_LIST = ('0.0.0.0/0');
-- ALTER USER MY_USER SET NETWORK_POLICY = NP_ALPINE_OFFICE;`,
        see: "SHOW returns existing policies (maybe none)",
        comic: {
          title: "Don’t lock yourself out",
          askFace: "priya",
          askName: "Priya",
          askRole: "You",
          ask: "Can I test a policy that blocks everything?",
          ans: "Not on the only user you have. Study the syntax; practice allow-lists carefully. Exam cares about purpose more than your IP.",
        },
      },
      {
        title: "Auth cheat-sheet query (study output)",
        what: "Document the mental model in a result set you can re-read.",
        sql: `SELECT * FROM VALUES
  ('MFA', 'Second factor for interactive users'),
  ('SSO', 'Federated IdP login'),
  ('KEY_PAIR', 'Service/automation users'),
  ('OAUTH', 'Delegated token access for apps'),
  ('NETWORK_POLICY', 'IP allow/deny gate'),
  ('TRUST_CENTER', 'Security posture / findings visibility')
  AS T(TOPIC, ONE_LINE);`,
        see: "Six rows you can recite",
      },
    ],
    drills: [
      ["MFA vs SSO?", "MFA adds a second factor. SSO delegates authentication to an identity provider. Often used together — not synonyms."],
      ["Best auth for a CI service user?", "Key-pair (or OAuth where designed). Not a shared human password with MFA prompts."],
      ["What does a network policy control?", "Which IP addresses/ranges can connect — not which tables a role can SELECT."],
      ["Trust Center in one line?", "Snowflake feature area for reviewing security posture / findings — know it exists on C03."],
      ["Does SSO replace RBAC?", "No. SSO proves identity. Roles still decide privileges."],
    ],
    wrap: "“Auth is identity: MFA and SSO for people, key-pair for services, network policies for where, Trust Center for posture. RBAC still decides data access. <em>Outcome:</em> Domain 2 auth questions map cleanly.”",
  },
  {
    n: 8,
    title: "Governance policies",
    eyebrow: "Data governance",
    h1: "Masking, row access, tags, lineage",
    lede: "Column security ≠ row security. Tags label objects for compliance/cost. Lineage shows where data flowed. Clean rooms get an awareness card.",
    problem: "Kai can see emails. Sam needs country-limited audits. Morgan wants objects tagged for PII.",
    solution: "Build <code>SECURE.CUSTOMERS_PII</code>, apply masking on EMAIL and a row access policy on COUNTRY; tag objects; prove with <code>FR_ANALYST</code> + <code>USE SECONDARY ROLES NONE</code>.",
    before: { title: "Everyone sees everything", bullets: ["Email in clear", "All countries visible", "No tags"] },
    after: { title: "Policy-enforced views of truth", bullets: ["Masked email for analysts", "Rows filtered by role", "Tags for governance"] },
    openComic: {
      title: "Masking ≠ RAP",
      askFace: "sam",
      askName: "Sam",
      askRole: "Compliance",
      ask: "If we mask email, does that also hide Canadian rows?",
      ans: "No. Masking changes <strong>column values</strong>. Row access policies filter <strong>which rows</strong> appear. Two different problems — Lab classic.",
      caption: "Column problem → masking. Row problem → RAP.",
    },
    see: [
      { label: "Column", title: "Dynamic masking", body: "Rewrite sensitive values based on role.", ex: "email → ****" },
      { label: "Row", title: "Row access policy", body: "Predicate decides if a row is visible.", ex: "COUNTRY = 'US'" },
      { label: "Label", title: "Tag", body: "Key/value metadata for classification &amp; reporting.", ex: "PII = 'EMAIL'" },
      { label: "Flow", title: "Lineage / clean rooms", body: "Lineage traces dependencies; clean rooms enable privacy-preserving collaboration.", ex: "C03 awareness" },
    ],
    nextTitle: "FinOps",
    sqlFile: "sql/08_governance.sql",
    steps: [
      {
        title: "Copy customers into SECURE",
        what: "Working copy for policies so LAB practice data stays intact.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;

CREATE OR REPLACE TABLE SECURE.CUSTOMERS_PII AS
SELECT * FROM LAB.CUSTOMERS;
SELECT * FROM SECURE.CUSTOMERS_PII;`,
        see: "Same rows now in SECURE",
        comic: {
          title: "Secondary roles",
          askFace: "priya",
          askName: "Priya",
          askRole: "You",
          ask: "I switched to FR_ANALYST but still see clear email?",
          ans: "Snowsight secondary roles. Always <code>USE SECONDARY ROLES NONE</code> for proofs. Policies key off CURRENT_ROLE().",
        },
      },
      {
        title: "Masking policy on EMAIL",
        what: "Analysts see masked email; lab admin sees clear.",
        sql: `CREATE OR REPLACE MASKING POLICY SECURE.MP_EMAIL AS (v STRING)
  RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('ROLE_CORE_LAB_ADMIN', 'ACCOUNTADMIN') THEN v
    ELSE REGEXP_REPLACE(v, '.+@', '****@')
  END;

ALTER TABLE SECURE.CUSTOMERS_PII
  MODIFY COLUMN EMAIL SET MASKING POLICY SECURE.MP_EMAIL;`,
        see: "Policy attached to EMAIL column",
      },
      {
        title: "Prove as FR_ANALYST",
        what: "Must clear secondary roles or the proof lies.",
        sql: `USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_CORE_XS;
SELECT FULL_NAME, EMAIL FROM SECURE.CUSTOMERS_PII;
-- Expect masked emails if SELECT granted; grant USAGE/SELECT as needed in sql/08_governance.sql`,
        see: "Emails masked (after grants in SQL file)",
      },
    ],
    drills: [
      ["Masking vs row access policy?", "Masking transforms column values; RAP filters rows. Don’t mix them on the exam."],
      ["Why CURRENT_ROLE() in policies?", "Policies evaluate the primary role. Secondary roles can still allow table access — clear them for honest tests."],
      ["What are tags for?", "Govern/classify objects (PII, cost center) and drive reporting — not a replacement for masking."],
      ["Data lineage purpose?", "Understand upstream/downstream dependencies for impact analysis and trust."],
      ["Clean room one-liner?", "Collaborate on sensitive data with controlled overlap/privacy — sharing without dumping raw PII freely."],
    ],
    wrap: "“I separated column masking from row access policies, tagged sensitive objects, and proved analyst views with secondary roles off. <em>Outcome:</em> governance questions map to the right tool.”",
  },
  {
    n: 9,
    title: "FinOps",
    eyebrow: "Cost management",
    h1: "Credits, resource monitors, ACCOUNT_USAGE",
    lede: "Warehouses burn credits while running. Resource monitors catch runaway spend. ACCOUNT_USAGE tells the story — with lag.",
    problem: "Morgan got a surprise bill. Kai left a Large warehouse running overnight. Nobody set a monitor.",
    solution: "Create a resource monitor, attach it to <code>WH_CORE_XS</code>, learn credit sizing intuition, query metering history carefully.",
    before: { title: "Unlimited burn", bullets: ["No monitor", "Size guesses", "No idea where credits went"] },
    after: { title: "Guarded spend", bullets: ["Monitor thresholds", "Auto-suspend still on", "ACCOUNT_USAGE for forensics"] },
    openComic: {
      title: "Morgan’s invoice",
      askFace: "morgan",
      askName: "Morgan",
      askRole: "Manager",
      ask: "Why did credits explode on Saturday?",
      ans: "Something held a warehouse awake or ran huge scans. Monitors notify/suspend at % thresholds; Profile + ACCOUNT_USAGE explain what.",
      caption: "Suspend saves idle. Monitors save disasters. Profile saves bad SQL.",
    },
    see: [
      { label: "Fuel", title: "Credits", body: "Burn while WH runs (and some serverless features separately).", ex: "XS cheaper than M per hour" },
      { label: "Guardrail", title: "Resource monitor", body: "Quota + notify/suspend actions at percentages.", ex: "80% notify · 100% suspend" },
      { label: "History", title: "ACCOUNT_USAGE", body: "Rich account history views — often lagged.", ex: "WAREHOUSE_METERING_HISTORY" },
      { label: "Idle", title: "Auto-suspend", body: "Still your first FinOps control.", ex: "60s on WH_CORE_XS" },
    ],
    nextTitle: "COPY",
    sqlFile: "sql/09_finops.sql",
    steps: [
      {
        title: "Create and attach a monitor",
        what: "Small credit quota for the lab warehouse — adjust numbers for your trial.",
        sql: `USE ROLE ACCOUNTADMIN;

CREATE OR REPLACE RESOURCE MONITOR RM_ALPINE_LAB
  WITH CREDIT_QUOTA = 20
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS
    ON 80 PERCENT DO NOTIFY
    ON 100 PERCENT DO SUSPEND;

ALTER WAREHOUSE WH_CORE_XS SET RESOURCE_MONITOR = RM_ALPINE_LAB;
SHOW RESOURCE MONITORS;`,
        see: "Monitor exists and WH references it",
        comic: {
          title: "Notify vs suspend",
          askFace: "riley",
          askName: "Riley",
          askRole: "Engineer",
          ask: "What happens at 100% SUSPEND?",
          ans: "Warehouse won't run new queries until reset/raised — protects the bill. Know NOTIFY vs SUSPEND vs SUSPEND_IMMEDIATE options.",
        },
      },
      {
        title: "Metering awareness",
        what: "ACCOUNT_USAGE may lag; still know the view name for the exam.",
        sql: `-- May be empty / lagged up to hours:
SELECT START_TIME, WAREHOUSE_NAME, CREDITS_USED
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE START_TIME > DATEADD(day, -7, CURRENT_TIMESTAMP())
ORDER BY START_TIME DESC
LIMIT 20;`,
        see: "Query runs (rows optional)",
      },
    ],
    drills: [
      ["Does auto-suspend replace a resource monitor?", "No. Suspend stops idle burn; monitors enforce quotas across activity."],
      ["XS vs M credit intuition?", "Larger sizes consume credits faster for the same clock time — rough doubling per size step is the teaching model (verify current docs)."],
      ["ACCOUNT_USAGE lag?", "Often delayed (tens of minutes to ~2 hours depending on view). Don’t panic if today’s query isn’t there yet."],
      ["Cloud services billing?", "Cloud Services has its own considerations; warehouse metering is the main compute story you must know."],
      ["What if monitor suspends mid-demo?", "Raise quota or clear monitor — and treat it as success of the guardrail."],
    ],
    wrap: "“I attached RM_ALPINE_LAB to WH_CORE_XS, kept auto-suspend, and know where ACCOUNT_USAGE metering lives. <em>Outcome:</em> FinOps questions aren’t vibes — they’re controls.”",
  },
  {
    n: 10,
    title: "Stages & COPY",
    eyebrow: "Loading 18%",
    h1: "Stages, file formats, COPY INTO, unload",
    lede: "Loading is: files on a <strong>stage</strong>, parsed by a <strong>file format</strong>, landed with <strong>COPY INTO</strong>. Unload is COPY the other way.",
    problem: "Overnight CSV lands. Riley used to clicky UI loads. Morgan wants repeatable SQL.",
    solution: "Named stage + CSV format + COPY into a landing table; unload a sample; learn ON_ERROR / VALIDATION_MODE vocabulary.",
    before: { title: "Manual chaos", bullets: ["No stage", "No format object", "Load errors mystery"] },
    after: { title: "Repeatable COPY", bullets: ["STG + FF + COPY", "Error options named", "Unload path known"] },
    openComic: {
      title: "Riley’s overnight file",
      askFace: "riley",
      askName: "Riley",
      askRole: "Engineer",
      ask: "Can I SELECT from a CSV sitting in S3 without loading?",
      ans: "External tables / query-in-place patterns exist — but classic Core path is stage → COPY → table. Know both ideas; drill COPY mechanics cold.",
      caption: "COPY INTO table FROM stage · COPY INTO stage FROM table",
    },
    see: [
      { label: "Folder", title: "Stage", body: "Internal or external file location.", ex: "<code>PIPELINE.STG_LOAD</code>" },
      { label: "Recipe", title: "File format", body: "CSV/JSON/PARQUET options.", ex: "SKIP_HEADER, delimiters" },
      { label: "Load", title: "COPY INTO table", body: "Bulk load from stage.", ex: "ON_ERROR = CONTINUE" },
      { label: "Export", title: "Unload", body: "COPY INTO stage FROM query/table.", ex: "Share extracts" },
    ],
    nextTitle: "Snowpipe",
    sqlFile: "sql/10_copy_stages.sql",
    steps: [
      {
        title: "Landing table + stage + format",
        what: "Objects COPY needs.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA PIPELINE;

CREATE OR REPLACE TABLE CUSTOMERS_LOAD (
  CUSTOMER_ID NUMBER, FULL_NAME STRING, EMAIL STRING, COUNTRY STRING
);

CREATE OR REPLACE FILE FORMAT FF_CSV_LOAD
  TYPE = CSV FIELD_DELIMITER = ',' SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"';

CREATE OR REPLACE STAGE STG_LOAD FILE_FORMAT = FF_CSV_LOAD;`,
        see: "Table, format, stage created",
        comic: {
          title: "No PUT? Still learn COPY",
          askFace: "priya",
          askName: "Priya",
          askRole: "You",
          ask: "Windows PUT from Snowsight is awkward — now what?",
          ans: "Use COPY from a SELECT (generate files) or load via INSERT for logic practice — still memorize PUT/GET + COPY options for the exam.",
        },
      },
      {
        title: "COPY from a query (no local file needed)",
        what: "Practice COPY mechanics by seeding from existing customers.",
        sql: `COPY INTO PIPELINE.STG_LOAD
FROM (
  SELECT CUSTOMER_ID::STRING, FULL_NAME, EMAIL, COUNTRY
  FROM LAB.CUSTOMERS
)
FILE_FORMAT = (TYPE = CSV COMPRESSION = NONE)
OVERWRITE = TRUE;

COPY INTO PIPELINE.CUSTOMERS_LOAD
FROM @PIPELINE.STG_LOAD
FILE_FORMAT = (FORMAT_NAME = 'PIPELINE.FF_CSV_LOAD')
ON_ERROR = 'ABORT_STATEMENT';

SELECT * FROM PIPELINE.CUSTOMERS_LOAD;`,
        see: "Rows land in CUSTOMERS_LOAD",
      },
    ],
    drills: [
      ["ON_ERROR options you must recognize?", "ABORT_STATEMENT, CONTINUE, SKIP_FILE — know they control bad-row behavior."],
      ["VALIDATION_MODE purpose?", "Test COPY without loading — returns errors that would occur."],
      ["Internal vs external stage?", "Internal stores in Snowflake; external points at cloud storage you manage."],
      ["Does COPY use a warehouse?", "Yes — classic COPY runs on a virtual warehouse you select."],
      ["Directory tables?", "Metadata tables over staged files — useful for file inventory patterns on modern exams."],
    ],
    wrap: "“Loading = stage + file format + COPY INTO. I practiced unload/load without depending on a laptop PUT. <em>Outcome:</em> Domain 3 COPY questions feel mechanical, not magical.”",
  },
  {
    n: 15,
    title: "SQL + VARIANT",
    eyebrow: "Performance / transform 21%",
    h1: "QUALIFY, MERGE, UDFs, FLATTEN",
    lede: "Domain 4 isn’t only warehouses — it’s SQL power features and semi-structured data. <code>VARIANT</code> + <code>FLATTEN</code> are Core classics.",
    problem: "Events arrive as JSON. Kai writes nested subqueries for “top 1 per customer.” Riley needs MERGE upserts.",
    solution: "QUALIFY for window filters, MERGE for upserts, tiny UDF, FLATTEN on <code>LAB.EVENTS_RAW</code>.",
    before: { title: "JSON fear", bullets: ["Copy JSON to 20 columns first?", "Window filter = subquery mess"] },
    after: { title: "Native tools", bullets: ["VARIANT paths", "FLATTEN lateral", "QUALIFY / MERGE"] },
    openComic: {
      title: "Kai vs nested JSON",
      askFace: "kai",
      askName: "Kai",
      askRole: "Analyst",
      ask: "Do I have to flatten JSON in Python before Snowflake?",
      ans: "No. Store as VARIANT, query with path syntax, explode arrays with FLATTEN. That’s a Core flex.",
      caption: "payload:user.id · FLATTEN(input => …)",
    },
    see: [
      { label: "Window", title: "QUALIFY", body: "Filter on window functions without wrapping another SELECT.", ex: "ROW_NUMBER() = 1" },
      { label: "Upsert", title: "MERGE", body: "WHEN MATCHED / NOT MATCHED.", ex: "CDC apply" },
      { label: "JSON", title: "VARIANT + FLATTEN", body: "Semi-structured native type + lateral flatten.", ex: "EVENTS_RAW" },
      { label: "Logic", title: "UDF / proc", body: "Reusable functions vs procedural code.", ex: "SQL/JS/Python options" },
    ],
    nextTitle: "Time Travel",
    sqlFile: "sql/15_sql_variant.sql",
    steps: [
      {
        title: "QUALIFY top order per customer",
        what: "Keep latest order row without nested subquery hell.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

SELECT *
FROM ORDERS
QUALIFY ROW_NUMBER() OVER (PARTITION BY CUSTOMER_ID ORDER BY ORDER_TS DESC) = 1;`,
        see: "One row per customer",
        comic: {
          title: "QUALIFY vs WHERE",
          askFace: "dev",
          askName: "Dev",
          askRole: "Coach",
          ask: "Why not put ROW_NUMBER in WHERE?",
          ans: "Window results aren’t available in WHERE. QUALIFY is the clause designed for that filter.",
        },
      },
      {
        title: "FLATTEN event JSON",
        what: "Pull nested fields out of VARIANT.",
        sql: `SELECT
  EVENT_ID,
  PAYLOAD:event::STRING AS EVENT_NAME,
  PAYLOAD:user.id::NUMBER AS USER_ID,
  PAYLOAD:user.plan::STRING AS PLAN
FROM EVENTS_RAW;

-- Arrays would use LATERAL FLATTEN(input => PAYLOAD:items)`,
        see: "Event name + user id columns",
      },
    ],
    drills: [
      ["QUALIFY purpose?", "Filter rows using window-function results."],
      ["VARIANT colon vs get_path?", "Path syntax PAYLOAD:a.b is idiomatic; cast with ::TYPE."],
      ["FLATTEN returns what?", "A lateral table of elements — join it to explode arrays."],
      ["UDF vs stored procedure?", "UDF returns a value in SQL; procedures orchestrate steps / procedural logic."],
      ["MERGE when not to?", "Blind MERGE without keys/tests can upsert garbage — still know syntax for the exam."],
    ],
    wrap: "“I used QUALIFY for window filters, VARIANT paths for JSON, and know FLATTEN/MERGE/UDF vocabulary. <em>Outcome:</em> Domain 4 SQL questions aren’t scary.”",
  },
  {
    n: 17,
    title: "Clone & replicate",
    eyebrow: "Collaboration 10%",
    h1: "Zero-copy clone + replication / DR",
    lede: "Clones are instant and cheap until you change data. Replication copies across accounts/regions for DR — different tool.",
    problem: "Riley wants a QA copy of prod. Morgan asks about region failure. Kai thinks clone = export CSV.",
    solution: "Clone a table/schema; explain zero-copy storage; cover replication/failover vocabulary for the exam.",
    before: { title: "Copy = duplicate bytes now", bullets: ["Fear of clone cost", "DR = clone?"] },
    after: { title: "Clone vs replicate", bullets: ["Clone = same account snapshot", "Replicate = cross-region/account DR"] },
    openComic: {
      title: "Zero-copy?",
      askFace: "kai",
      askName: "Kai",
      askRole: "Analyst",
      ask: "If clone is instant, did we duplicate a terabyte?",
      ans: "No. Clone points at the same micro-partitions until one side changes (copy-on-write). Storage grows with divergence.",
      caption: "Clone ≠ share ≠ replicate.",
    },
    see: [
      { label: "Snapshot", title: "CLONE", body: "Fast zero-copy copy in-account.", ex: "<code>CREATE TABLE … CLONE</code>" },
      { label: "DR", title: "Replication", body: "Keep objects in another region/account.", ex: "Failover groups (edition matters)" },
      { label: "Cost", title: "Divergence", body: "Changed partitions create new storage.", ex: "QA edits → extra bytes" },
      { label: "Rights", title: "Privileges", body: "Need rights to create clone of source.", ex: "Not everyone can clone prod" },
    ],
    nextTitle: "sharing",
    sqlFile: "sql/17_clone_replicate.sql",
    steps: [
      {
        title: "Clone customers for QA",
        what: "Instant twin table.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE CUSTOMERS_QA CLONE CUSTOMERS;
SELECT COUNT(*) FROM CUSTOMERS_QA;`,
        see: "Same row count immediately",
        comic: {
          title: "Clone vs Time Travel",
          askFace: "riley",
          askName: "Riley",
          askRole: "Engineer",
          ask: "Clone at timestamp?",
          ans: "Yes — clone can use AT/BEFORE for a historical snapshot. Powerful with Time Travel.",
        },
      },
      {
        title: "Replication vocabulary (commented)",
        what: "Know commands/concepts even if trial can’t demo cross-region.",
        sql: `-- ALTER DATABASE ALPINE_RETAIL ENABLE REPLICATION TO ACCOUNTS <org.account>;
-- On secondary: CREATE DATABASE ... AS REPLICA OF ...
-- Failover/failback are Business Critical conversations on many exam stems.
SELECT 'clone = in-account zero-copy' AS a,
       'replication = cross-account/region DR' AS b;`,
        see: "You can separate clone vs replication in one sentence",
      },
    ],
    drills: [
      ["When do clones cost storage?", "When data diverges — copy-on-write creates new micro-partitions."],
      ["Clone vs secure share?", "Clone copies an object you own in-account; share grants live access to another account without copying."],
      ["Is replication available on all editions equally?", "Advanced failover features often require higher editions — know Business Critical shows up in DR stories."],
      ["Can you clone a temporary table meaningfully for QA?", "Temp is session-scoped — clone permanent/transient sources for durable QA twins."],
      ["Database clone includes what?", "Schemas/objects per clone rules — powerful for full-env twins; still zero-copy initially."],
    ],
    wrap: "“Clones are zero-copy until divergence. Replication is the DR/cross-region tool — not a synonym for clone. <em>Outcome:</em> Collaboration domain won’t blur these.”",
  },
  {
    n: 18,
    title: "Sharing & Marketplace",
    eyebrow: "Collaboration",
    h1: "Secure share, reader accounts, Marketplace, Clean Rooms",
    lede: "Sharing gives live access — not a weekly CSV. Marketplace/listings and clean rooms expand the collaboration story on C03.",
    problem: "A partner wants Alpine order summaries. Riley’s first idea: email a dump. Sam panics.",
    solution: "Create a share of a safe view in <code>SHARE_DEMO</code>; learn reader accounts, listings, Native Apps, clean rooms as exam vocabulary.",
    before: { title: "Email the CSV", bullets: ["Stale data", "PII risk", "No revoke story"] },
    after: { title: "Live governed share", bullets: ["SHARE object", "Grant SELECT on view", "Revocable access"] },
    openComic: {
      title: "Partner feed",
      askFace: "morgan",
      askName: "Morgan",
      askRole: "Manager",
      ask: "Just send them the database password?",
      ans: "Never. Create a SHARE of a curated view. They query live with their own warehouse. You revoke by unsharing.",
      caption: "Provider pays storage; consumer pays their compute (classic teaching model).",
    },
    see: [
      { label: "Live", title: "Secure share", body: "Grant objects to other accounts.", ex: "<code>CREATE SHARE</code>" },
      { label: "No account", title: "Reader account", body: "Provider-managed consumer account pattern.", ex: "Partners without Snowflake" },
      { label: "Shop", title: "Marketplace / listings", body: "Discover/monetize data products.", ex: "Listings" },
      { label: "Privacy", title: "Clean rooms / Native Apps", body: "Controlled collaboration + apps distributed via Snowflake.", ex: "C03" },
    ],
    nextTitle: "mock exam",
    sqlFile: "sql/18_sharing.sql",
    steps: [
      {
        title: "Curated view + share",
        what: "Never share raw PII tables casually.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE DATABASE ALPINE_RETAIL;

CREATE OR REPLACE VIEW SHARE_DEMO.V_ORDER_SUMMARY AS
SELECT ORDER_ID, CUSTOMER_ID, ORDER_TS, AMOUNT_USD, STATUS
FROM LAB.ORDERS;

CREATE SHARE IF NOT EXISTS ALPINE_ORDERS_SHARE;
GRANT USAGE ON DATABASE ALPINE_RETAIL TO SHARE ALPINE_ORDERS_SHARE;
GRANT USAGE ON SCHEMA SHARE_DEMO TO SHARE ALPINE_ORDERS_SHARE;
GRANT SELECT ON VIEW SHARE_DEMO.V_ORDER_SUMMARY TO SHARE ALPINE_ORDERS_SHARE;
SHOW SHARES;`,
        see: "Share listed; grants visible via SHOW GRANTS",
        comic: {
          title: "Who pays compute?",
          askFace: "kai",
          askName: "Kai",
          askRole: "Analyst",
          ask: "If the partner queries our share, do we pay their warehouse?",
          ans: "Classic model: they use their warehouse credits; we share data access. Know the exam’s standard framing.",
        },
      },
    ],
    drills: [
      ["Is a share a snapshot copy?", "No — live access to selected objects (as of share semantics)."],
      ["Reader account purpose?", "Let consumers without their own full account query shared data under provider-managed accounts."],
      ["Marketplace vs direct share?", "Direct share is point-to-point; Marketplace/listings are discovery/commercial distribution."],
      ["Native Apps?", "Package app logic + data distribution in Snowflake’s app framework — awareness for C03."],
      ["Clean room purpose?", "Collaborate without freely exposing raw sensitive datasets."],
    ],
    wrap: "“I shared a curated view via ALPINE_ORDERS_SHARE — live, revocable, no CSV email. I can explain reader accounts, Marketplace, Native Apps, and clean rooms. <em>Outcome:</em> Domain 5 sharing questions covered.”",
  },
  {
    n: 19,
    title: "Mock exam",
    eyebrow: "Capstone",
    h1: "Timed mock — book Pearson only after this",
    lede: "40 questions across all five COF-C03 domains. Timer: <strong>45 minutes</strong>. Target ≥ <strong>32/40 (80%)</strong> before you pay for the real exam.",
    problem: "Morgan: “Are you ready?” Priya: “I finished the labs.” Dev: “Finishing ≠ passing. Prove it timed.”",
    solution: "Self-proctored mock with answers hidden in drills. Weak domains map back to labs.",
    before: { title: "Lab complete ≠ exam ready", bullets: ["No timed practice", "Weak domains unknown"] },
    after: { title: "Scored readiness", bullets: ["40 Q mock", "Domain weak-spot map", "Exam-day playbook"] },
    openComic: {
      title: "Book the exam?",
      askFace: "morgan",
      askName: "Morgan",
      askRole: "Manager",
      ask: "I scheduled you for Friday.",
      ans: "Only if she clears 80% here. Real exam is 100 Q / 115 min / 750 scaled. This mock finds holes cheaply.",
      caption: "Do this mock twice if needed. Say answers out loud.",
    },
    see: [
      { label: "Real", title: "COF-C03", body: "100 questions · 115 minutes · 750/1000 pass.", ex: "~$175 USD" },
      { label: "Here", title: "Mock", body: "40 questions · 45 minutes · 80% gate.", ex: "Score yourself" },
      { label: "Fix", title: "Weak labs", body: "Miss Architecture → Labs 01–05, etc.", ex: "EXAM_BLUEPRINT.md" },
      { label: "Day", title: "Playbook", body: "Sleep, ID, Pearson rules, trap list.", ex: "EXAM_DAY_PLAYBOOK.md" },
    ],
    extraHtml: `
    <section class="teach" id="mock-questions">
      <h2>Mock questions (answer after you commit)</h2>
      <p>Write A/B/C/D on paper first. Then open the answer.</p>
      <ol class="mock-list">
        <li><strong>Architecture:</strong> Virtual warehouses provide…?
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>B — Compute.</strong> Storage is separate. Distractors: storage capacity, Fail-safe, SSO.</p></details></li>
        <li><strong>Architecture:</strong> Which edition first unlocks up to 90-day Time Travel?
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Enterprise.</strong> Not Business Critical-only.</p></details></li>
        <li><strong>Architecture:</strong> Micro-partitions enable the optimizer to…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Prune</strong> irrelevant partitions using min/max metadata.</p></details></li>
        <li><strong>Architecture:</strong> Transient tables do NOT have…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Fail-safe.</strong></p></details></li>
        <li><strong>Architecture:</strong> Snowpark is best described as…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>APIs to run Python/Java/Scala using Snowflake compute.</strong></p></details></li>
        <li><strong>Architecture:</strong> Cortex in one line…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>AI capabilities/functions inside Snowflake</strong> (LLM SQL, search/analyst family).</p></details></li>
        <li><strong>Architecture:</strong> Separating storage &amp; compute allows…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Independent scaling and billing</strong>; many WHs read same data.</p></details></li>
        <li><strong>Architecture:</strong> Cloud Services layer handles…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Auth, metadata, optimization</strong> (the brain).</p></details></li>
        <li><strong>Account:</strong> Network policies control…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Client IP allow/deny</strong> — not table privileges.</p></details></li>
        <li><strong>Account:</strong> Best auth for CI service user…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Key-pair</strong> (or designed OAuth) — not shared human password.</p></details></li>
        <li><strong>Account:</strong> Masking vs RAP…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Masking = columns; RAP = rows.</strong></p></details></li>
        <li><strong>Account:</strong> Resource monitor at 100% SUSPEND…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Blocks warehouse usage until addressed</strong> per monitor config.</p></details></li>
        <li><strong>Account:</strong> ACCOUNT_USAGE often…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Lags</strong> — not always real-time.</p></details></li>
        <li><strong>Account:</strong> RBAC grant chain best practice…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Privileges → access roles → functional roles → users.</strong></p></details></li>
        <li><strong>Account:</strong> MFA vs SSO…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Different controls; often combined.</strong></p></details></li>
        <li><strong>Account:</strong> Trust Center…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Security posture visibility</strong> feature area on C03.</p></details></li>
        <li><strong>Load:</strong> COPY INTO runs on…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>A virtual warehouse</strong> (classic COPY).</p></details></li>
        <li><strong>Load:</strong> Snowpipe compute is typically…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Serverless / Snowpipe credits</strong> — not “resize WH to speed pipe.”</p></details></li>
        <li><strong>Load:</strong> Snowpipe Streaming vs classic pipe…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Streaming = row/SDK path; classic = files+COPY.</strong></p></details></li>
        <li><strong>Load:</strong> Streams provide…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Change tracking</strong> (CDC) on a table.</p></details></li>
        <li><strong>Load:</strong> Tasks are for…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Scheduling SQL / DAGs</strong> in Snowflake.</p></details></li>
        <li><strong>Load:</strong> External stage points at…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Cloud object storage you configure</strong> (S3/Blob/GCS).</p></details></li>
        <li><strong>Load:</strong> VALIDATION_MODE…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Tests COPY without loading rows.</strong></p></details></li>
        <li><strong>Load:</strong> Dynamic Tables are…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Declarative pipeline tables with target lag.</strong></p></details></li>
        <li><strong>Perf:</strong> Result cache returns…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Prior identical query results when eligible</strong> — no WH needed if hit.</p></details></li>
        <li><strong>Perf:</strong> Scale out helps…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Concurrency</strong> (more clusters). Scale up helps harder single queries.</p></details></li>
        <li><strong>Perf:</strong> Query Profile first when…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Diagnosing slowness</strong> before blindly resizing.</p></details></li>
        <li><strong>Perf:</strong> QUALIFY filters…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Window function results.</strong></p></details></li>
        <li><strong>Perf:</strong> VARIANT is for…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Semi-structured data</strong> (JSON etc.).</p></details></li>
        <li><strong>Perf:</strong> FLATTEN…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Explodes nested arrays/objects into rows.</strong></p></details></li>
        <li><strong>Perf:</strong> Multi-cluster WH primarily addresses…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Queuing / concurrency.</strong></p></details></li>
        <li><strong>Perf:</strong> Bigger WH always faster?
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>False</strong> — pruning/spill/join issues may dominate.</p></details></li>
        <li><strong>Collab:</strong> Time Travel vs Fail-safe…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>TT user-recoverable; Fail-safe Support-only after TT.</strong></p></details></li>
        <li><strong>Collab:</strong> UNDROP works within…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Time Travel retention</strong> for dropped objects.</p></details></li>
        <li><strong>Collab:</strong> Zero-copy clone…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Shares micro-partitions until divergence.</strong></p></details></li>
        <li><strong>Collab:</strong> Secure share is…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Live access</strong> — not a CSV export.</p></details></li>
        <li><strong>Collab:</strong> Replication is for…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Cross-region/account DR / availability.</strong></p></details></li>
        <li><strong>Collab:</strong> Reader accounts help…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Consumers without full Snowflake accounts.</strong></p></details></li>
        <li><strong>Collab:</strong> Clean rooms…
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>Privacy-preserving collaboration</strong> patterns.</p></details></li>
        <li><strong>Mixed:</strong> Warehouse stores table data — true/false?
          <details class="drill"><summary>Reveal</summary><p class="drill-say"><strong>False.</strong> Instant fail if you say true.</p></details></li>
      </ol>
      <div class="callout tip">
        <strong>Score map</strong>
        Miss 1–8 → Labs 01–05 · Miss 9–16 → Labs 06–09 · Miss 17–24 → Labs 10–12 ·
        Miss 25–32 → Labs 13–15 · Miss 33–40 → Labs 16–18. Recheck <a href="EXAM_BLUEPRINT.md">blueprint</a>.
      </div>
    </section>`,
    nextTitle: "home",
    sqlFile: "(none — mock)",
    steps: [
      {
        title: "Exam-day checklist (no Snowflake needed)",
        what: "Read EXAM_DAY_PLAYBOOK.md and confirm blueprint checkboxes.",
        sql: `SELECT 'I scored ___ / 40' AS mock_score,
       'Weak domains: ________' AS weak,
       'Retake mock after redo labs' AS next_action;`,
        see: "You wrote a real score on paper",
        comic: {
          title: "Honesty gate",
          askFace: "dev",
          askName: "Dev",
          askRole: "Coach",
          ask: "Peeking at answers while timing?",
          ans: "Then the mock is worthless. Closed notes. Grade hard. Redo weak labs the same day.",
        },
      },
    ],
    drills: [
      ["Real exam timing tip?", "Don’t sink 5 minutes on one stem — flag and return. 115 min / 100 Q ≈ about a minute each."],
      ["Scaled 750 means?", "Not raw 75%. It’s scaled. Practice for mastery, not borderline memorization."],
      ["If two answers look right?", "Pick the more precise Snowflake term (pruning vs index; share vs clone)."],
      ["Night-before focus?", "Three layers, editions matrix, TT vs Fail-safe, COPY vs pipe vs streaming, masking vs RAP, scale up vs out."],
      ["When to book Pearson?", "After ≥80% on this mock twice, blueprint checkboxes done, drills said aloud."],
    ],
    wrap: "“I ran the timed mock, scored honestly, and mapped misses back to labs. When I’m ≥32/40 twice, I book COF-C03. <em>Outcome:</em> readiness is measured, not hoped.”",
  },
];
