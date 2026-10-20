# -*- coding: utf-8 -*-
"""One-shot generator for docs/lab-19b.html — run from repo root."""
from pathlib import Path

# Each item: (stem, [A,B,C,D], correct_letter, why)
# Domain sizes: 31 Arch, 20 Acct, 18 Load, 21 Perf, 10 Collab

D1 = [
    ("Which statement about virtual warehouses is true?",
     ["Warehouses store micro-partitions for tables",
      "Warehouses provide compute; table data lives in the storage layer",
      "Larger warehouses always reduce storage cost",
      "Cloud Services runs inside your warehouse size"],
     "B", "WH = compute. Storage holds micro-partitions. A confuses layers; C/D wrong."),
    ("Name the three Snowflake architecture layers.",
     ["Database, Schema, Table",
      "Storage, Query Processing (warehouses), Cloud Services",
      "Snowsight, SnowSQL, JDBC",
      "Standard, Enterprise, Business Critical"],
     "B", "Classic three-layer answer. A = object hierarchy; C = interfaces; D = editions."),
    ("Which edition can configure Time Travel up to 90 days?",
     ["Standard only", "Enterprise and above", "Reader accounts only", "Any edition with Fail-safe enabled"],
     "B", "Standard ~1 day; Enterprise+ for up to 90. Fail-safe ≠ TT length."),
    ("Micro-partitions are best described as:",
     ["Fixed 50 MB row groups you manually size",
      "Contiguous compressed storage units Snowflake manages automatically",
      "Warehouse cache blocks only",
      "One partition per table always"],
     "B", "Auto-managed compressed units. Not WH cache; not one-per-table."),
    ("Which interface is the web UI for Snowflake?",
     ["SnowSQL", "Snowsight", "Kafka Connector only", "Fail-safe console"],
     "B", "Snowsight = web UI; SnowSQL = CLI."),
    ("Which is NOT a table type category the exam expects you to distinguish?",
     ["Permanent", "Transient", "Temporary", "Fail-safe table"],
     "D", "Fail-safe is retention after TT — not a CREATE TABLE type."),
    ("Cloud Services layer includes:",
     ["Only virtual warehouse CPU",
      "Authentication, metadata, query optimization/management",
      "Only S3/Blob customer buckets you create",
      "Only Snowpipe billing"],
     "B", "Cloud Services = control plane (auth, metadata, optimizer)."),
    ("Business Critical is most associated with which need?",
     ["Free reader accounts only",
      "Higher security / some advanced failover & compliance features",
      "Disabling Cloud Services",
      "Removing Time Travel"],
     "B", "BC for stricter security and many HA/failover capabilities."),
    ("A secure view is used primarily to:",
     ["Force warehouse size to X-Small",
      "Hide underlying details / prevent some optimization peeking at base objects",
      "Replace Fail-safe",
      "Enable Marketplace billing only"],
     "B", "Secure views protect definition/underlying exposure vs normal views."),
    ("Which cloud partners host Snowflake? (exam spirit)",
     ["Only on-prem VMware", "Major public clouds (AWS, Azure, GCP)", "Only AWS Gov alone forever", "Customer laptop Docker only"],
     "B", "Multi-cloud SaaS on AWS/Azure/GCP."),
    ("Cortex / Snowpark / Streamlit in Snowflake sit closest to which blueprint theme?",
     ["Fail-safe administration", "AI / apps / developer platforms (architecture awareness)", "COPY INTO file formats only", "Reader account billing only"],
     "B", "Domain 1 AI/apps awareness on C03."),
    ("Clustering keys help primarily with:",
     ["Making warehouses auto-suspend faster",
      "Improving pruning / scan efficiency when filters match cluster dimensions",
      "Granting ACCOUNTADMIN rights",
      "Creating reader accounts"],
     "B", "Clustering aids pruning when filters align — not RBAC or suspend."),
    ("Separation of storage and compute means DMart can:",
     ["Only scale storage by resizing WH_CORE_XS",
      "Scale warehouses independently of how much data sits in DMART",
      "Delete Cloud Services to save money",
      "Store tables only inside the warehouse local disk forever"],
     "B", "Elastic compute ≠ storage growth. WH size does not create more storage."),
    ("Which statement about editions is most accurate?",
     ["All editions are identical except marketing names",
      "Higher editions unlock features (e.g., longer TT, MCW, advanced security) at higher cost",
      "Standard includes Tri-Secret Secure by default always",
      "VPS is required for every trial account"],
     "B", "Edition ladder maps features to cost — don't invent features on Standard."),
    ("SnowSQL is best described as:",
     ["The web worksheet UI", "A command-line client for Snowflake", "A Marketplace listing type", "A Fail-safe restore tool"],
     "B", "SnowSQL = CLI; Snowsight = web."),
    ("Dynamic Tables primarily help you:",
     ["Replace all roles with ACCOUNTADMIN",
      "Declare target tables that refresh from a query (pipeline-style)",
      "Disable micro-partitions",
      "Create Fail-safe on transient tables"],
     "B", "Dynamic Tables = declarative refresh pipelines (Domain 1/3 awareness)."),
    ("Iceberg tables in Snowflake (exam spirit) relate to:",
     ["Only Fail-safe tickets", "Open table format / external catalog themes for data lake tables", "Warehouse auto-suspend only", "Reader account passwords"],
     "B", "Iceberg = open format / lakehouse-style table awareness on C03."),
    ("Which object hierarchy order is correct?",
     ["Column → Table → Schema → Database → Account",
      "Account → Database → Schema → objects (tables, views…)",
      "Warehouse → Stage → Edition → Share",
      "Fail-safe → Time Travel → Clone"],
     "B", "Account contains databases; databases contain schemas; schemas contain objects."),
    ("Materialized views are mainly for:",
     ["Deleting base tables", "Precomputing query results for performance (with maintenance cost)", "Replacing network policies", "Creating editions"],
     "B", "MVs trade storage/maintenance for faster reads — not security objects."),
    ("What burns credits when you SELECT from a large table (typical case)?",
     ["Only storage bytes forever with zero compute",
      "Virtual warehouse compute (plus any applicable services)",
      "Only Fail-safe tickets",
      "Only Marketplace listing fees"],
     "B", "Queries run on a WH — credits for compute. Storage billed separately."),
    ("External tables are best associated with:",
     ["Data remaining in external cloud storage queried via metadata",
      "Forcing all data into Fail-safe",
      "Disabling stages",
      "Replacing RBAC"],
     "B", "External tables point at files outside Snowflake storage."),
    ("Which is true about Snowflake regions?",
     ["One global region only forever",
      "You choose cloud + region; availability and features can vary by region",
      "Regions only exist for reader accounts",
      "Regions store warehouses but never data"],
     "B", "Cloud provider + region choice matters for latency, compliance, features."),
    ("Directory tables help you:",
     ["List/query files on a stage as table rows", "Mask PII columns", "Scale warehouses out", "Create Fail-safe"],
     "A", "Directory tables = file listing metadata on stages."),
    ("Which best describes elastic compute?",
     ["You must buy fixed hardware for 3 years",
      "Start/stop/resize warehouses on demand without moving data",
      "Storage shrinks when WH suspends",
      "Cloud Services disappears when WH suspends"],
     "B", "Suspend WH → stop compute credits; data remains in storage."),
    ("A standard view (non-secure) typically:",
     ["Stores a full physical copy of all base rows always",
      "Stores a query definition; data comes from underlying objects at runtime",
      "Is identical to a permanent table",
      "Requires Business Critical"],
     "B", "Views are definitions (unless materialized). Secure views add protection."),
    ("Which interface family includes JDBC/ODBC drivers?",
     ["Only Snowsight worksheets", "Client drivers/connectors for apps and BI tools", "Only Fail-safe console", "Only ACCOUNT_USAGE"],
     "B", "Drivers connect applications — Domain 1 interfaces."),
    ("Snowflake Notebooks / Streamlit in Snowflake primarily show C03 awareness of:",
     ["Building apps/analytics inside the platform", "Deleting Cloud Services", "Mandatory Fail-safe on temp tables", "COPY ON_ERROR only"],
     "A", "In-platform apps/notebooks are architecture/AI theme items."),
    ("What does auto-suspend on a warehouse do?",
     ["Deletes the database", "Stops the WH after idle time to save credits", "Enables 90-day TT on Standard", "Creates a share"],
     "B", "Idle WH → suspend → no compute credits until resume."),
    ("Which statement about multi-cluster warehouses is most accurate?",
     ["They always reduce storage cost",
      "They add clusters to handle concurrency (scale out)",
      "They replace Time Travel",
      "They only exist on Standard trial"],
     "B", "MCW = concurrency; often Enterprise+ feature theme."),
    ("Compressed micro-partition storage means:",
     ["You manually gzip every INSERT",
      "Snowflake stores data in compressed columnar micro-partitions",
      "Warehouses hold uncompressed copies of all tables always",
      "Fail-safe compresses roles"],
     "B", "Storage layer compresses data in micro-partitions automatically."),
    ("Which is the best one-liner for Cortex on the exam?",
     ["Cortex deletes warehouses", "Cortex = Snowflake AI functions/services you call from SQL / platform (awareness)", "Cortex replaces Secure Data Sharing", "Cortex is Fail-safe for VARIANT"],
     "B", "Know Cortex as AI capability awareness — not a storage layer."),
]

D2 = [
    ("RBAC in Snowflake is primarily about:",
     ["Assigning privileges to roles, then roles to users", "Storing passwords in tables", "Cloning warehouses", "Fail-safe tickets"],
     "A", "Privileges → roles → users."),
    ("Dynamic data masking typically:",
     ["Deletes columns permanently", "Transforms column values at query time based on role/policy", "Doubles warehouse size", "Enables replication"],
     "B", "Masking policies alter what roles see without rewriting stored data."),
    ("Row access policies control:",
     ["Which rows a role can see", "Warehouse auto-resume only", "Fail-safe duration", "Stage file format"],
     "A", "RAP = rows; masking = column values."),
    ("Resource Monitors are used to:",
     ["Mask emails", "Track/limit credit usage and notify or suspend", "Create shares", "Replace Time Travel"],
     "B", "Cost governance via credit quotas/actions."),
    ("ACCOUNT_USAGE views are useful for:",
     ["Live millisecond operational locks only", "Historical monitoring of queries, logins, usage (with latency)", "Replacing INFORMATION_SCHEMA entirely for all DDL", "Fail-safe restores"],
     "B", "Account-level history; expect latency vs INFORMATION_SCHEMA."),
    ("Network policies primarily restrict:",
     ["Which IP/CIDR ranges can authenticate", "Micro-partition size", "Marketplace prices", "Clone privileges only"],
     "A", "Network policies allow/block client IPs."),
    ("Object tagging helps mainly with:",
     ["Governance classification / tracking sensitive data", "Speeding COPY INTO always", "Disabling Cloud Services", "Creating Fail-safe"],
     "A", "Tags for governance/classification workflows."),
    ("MFA / SSO / key-pair auth are examples of:",
     ["Storage layer features", "Authentication / access security controls", "Clustering keys", "Transient table options"],
     "B", "Domain 2 authentication themes."),
    ("What should you run when proving a functional role cannot see vault data in Snowsight?",
     ["USE ROLE FR_ANALYST; only", "USE ROLE FR_ANALYST; USE SECONDARY ROLES NONE;", "DROP ROLE ACCOUNTADMIN;", "ALTER WAREHOUSE SUSPEND;"],
     "B", "Secondary roles often stay active — NONE for honest privilege proofs."),
    ("Ownership of an object typically means:",
     ["You alone can query every database", "The owning role controls the object and can grant privileges on it", "Fail-safe is disabled", "The warehouse must be Multi-cluster"],
     "B", "Owner role governs grants/DDL on that object."),
    ("Trust Center (exam awareness) relates to:",
     ["Security posture / monitoring themes for the account", "Clustering key syntax only", "COPY ON_ERROR defaults", "Marketplace refunds"],
     "A", "Trust Center = security assessment/monitoring awareness."),
    ("Which statement about roles is true?",
     ["Users should usually own all privileges directly, never roles", "Roles are the containers for privileges; users activate roles", "ACCOUNTADMIN is required for SELECT on every table", "Roles store micro-partitions"],
     "B", "Activate a role; privileges hang on roles."),
    ("Column-level security via masking vs row filter:",
     ["Same SQL object type always", "Masking transforms columns; RAP filters rows", "Both only work on transient tables", "Both replace network policies"],
     "B", "Memorize: columns vs rows."),
    ("Classification / sensitive data features help you:",
     ["Automatically find and label sensitive columns (governance)", "Resize warehouses", "Create Fail-safe", "Disable shares"],
     "A", "Data classification supports governance tagging workflows."),
    ("Lineage (exam awareness) helps you understand:",
     ["How data flows between objects / dependencies", "Only warehouse suspend times", "Only Fail-safe tickets", "Only file format CSV headers"],
     "A", "Lineage = dependency/flow awareness."),
    ("OAuth for Snowflake clients is primarily about:",
     ["Delegated authentication for applications", "Compressing micro-partitions", "Creating Dynamic Tables", "Fail-safe restore"],
     "A", "OAuth = app auth pattern alongside SSO/key-pair/MFA."),
    ("Which is a FinOps best practice for DMart?",
     ["Leave WH_CORE_M running 24/7 with no monitor", "Attach resource monitors and use auto-suspend on warehouses", "Grant ACCOUNTADMIN to every analyst", "Disable ACCOUNT_USAGE"],
     "B", "Monitors + auto-suspend = credit control."),
    ("INFORMATION_SCHEMA vs ACCOUNT_USAGE — pick the true statement:",
     ["They are identical with zero latency differences", "INFORMATION_SCHEMA is more real-time for current DB; ACCOUNT_USAGE is account history with latency", "ACCOUNT_USAGE replaces all stages", "INFORMATION_SCHEMA deletes Fail-safe"],
     "B", "Know latency/history tradeoff."),
    ("Least privilege for DMart analysts usually means:",
     ["Everyone is ACCOUNTADMIN", "Functional roles with only needed object grants (not god-mode)", "No roles at all", "Only PUBLIC role forever"],
     "B", "Grant minimum needed via roles."),
    ("Sam asks: can masking hide SSN while RAP limits store_id rows together?",
     ["No — only one policy type per account", "Yes — column masking and row access can work together", "Only on Standard edition", "Only if the table is temporary"],
     "B", "Policies compose: columns + rows."),
]

D3 = [
    ("COPY INTO a table from a stage is best described as:",
     ["Continuous auto-ingest only", "Batch load you run (or schedule) from files", "Fail-safe restore", "Zero-copy clone"],
     "B", "COPY = batch. Snowpipe = continuous/auto."),
    ("Snowpipe is designed for:",
     ["Continuous/near-continuous loading as files arrive", "Replacing all warehouses", "Manual UNDROP only", "Marketplace billing only"],
     "A", "Pipe automation vs batch COPY."),
    ("A named stage can reference:",
     ["Only local laptop RAM", "Internal Snowflake stages or external cloud storage locations", "Fail-safe only", "Reader accounts only"],
     "B", "Internal/external stages for load/unload."),
    ("Streams track:",
     ["Warehouse suspend events only", "Change data (CDC-style) on a table for downstream processing", "Marketplace listings", "Fail-safe tickets"],
     "B", "Table streams = change tracking."),
    ("Tasks are used to:",
     ["Schedule SQL / pipeline steps in Snowflake", "Mask columns", "Create editions", "Replace micro-partitions manually"],
     "A", "Tasks schedule work (often with streams)."),
    ("File format objects define:",
     ["CSV/JSON/Parquet parse options for load/unload", "Role hierarchies", "Fail-safe windows", "Warehouse sizes"],
     "A", "FILE FORMAT = structure/options for files."),
    ("Storage integrations primarily:",
     ["Secure trust between Snowflake and cloud storage without embedding long-lived keys in every stage", "Delete ACCOUNT_USAGE", "Replace RBAC", "Create reader accounts"],
     "A", "Integrations for secure external storage access."),
    ("Snowpipe Streaming (exam spirit) is closest to:",
     ["Row-oriented continuous ingest via SDK/API themes", "Only weekly COPY of CSV", "Fail-safe restore", "Secure view definition"],
     "A", "Streaming ≠ file-batch COPY."),
    ("ON_ERROR = ABORT_STATEMENT on COPY typically means:",
     ["Ignore all errors forever", "Stop the load when errors hit the abort behavior", "Create a share", "Enable MCW"],
     "B", "ABORT stops; CONTINUE can skip bad data per settings — know the difference."),
    ("Unloading data with COPY INTO a stage:",
     ["Writes query results out to files on a stage", "Deletes Time Travel", "Creates Fail-safe", "Grants ACCOUNTADMIN"],
     "A", "Unload = export files via COPY INTO location."),
    ("Kafka Connector themes on C03 map to:",
     ["Landing streaming/event data into Snowflake", "Only UNDROP", "Only masking policies", "Only resource monitors"],
     "A", "Connectors/integrations for pipelines."),
    ("User stage vs named stage — true statement:",
     ["There is no user stage", "Users have personal stages; named stages are shared schema objects", "Named stages only exist in Fail-safe", "User stages replace warehouses"],
     "B", "Know stage types: user/table/named; internal vs external."),
    ("Dynamic Tables vs Streams+Tasks (exam spirit):",
     ["Identical syntax always", "Different pipeline styles — DT declarative refresh vs stream/task CDC patterns", "Both replace COPY", "Both require VPS"],
     "B", "Know both automation vocabularies."),
    ("External stages typically point to:",
     ["Cloud object storage buckets/containers", "Only local /tmp on the WH", "Fail-safe only", "Cortex models only"],
     "A", "External = cloud storage location."),
    ("VALIDATION_MODE on COPY helps you:",
     ["Test/parse without (or with limited) loading to catch errors", "Mask columns", "Scale out warehouses", "Create shares"],
     "A", "Validate files before committing load."),
    ("API integrations (exam awareness) support:",
     ["Secure calls to external APIs from Snowflake features", "Deleting micro-partitions", "Replacing editions", "Fail-safe tickets"],
     "A", "Integrations family includes API/storage/notification themes."),
    ("Which load pattern fits nightly DMart order files you control?",
     ["Always Snowpipe Streaming SDK for a single daily CSV", "Batch COPY INTO from a stage on a schedule (or task)", "Only Fail-safe restore", "Only zero-copy clone"],
     "B", "Batch files → COPY; continuous files → pipe."),
    ("FORCE => TRUE on COPY (exam spirit) can:",
     ["Reload files even if already loaded (careful with duplicates)", "Enable 90-day TT on Standard", "Grant SSO", "Create MCW"],
     "A", "FORCE reloads; know duplicate risk."),
]

D4 = [
    ("Result cache returns prior results when:",
     ["Any similar English question is asked", "Eligible identical query context and underlying data unchanged (rules apply)", "Always after 1 second", "Only on transient tables"],
     "B", "Result cache is conditional — not magic fuzzy match."),
    ("Micro-partition pruning helps by:",
     ["Skipping irrelevant micro-partitions based on metadata/filters", "Deleting Cloud Services", "Granting roles", "Creating shares"],
     "A", "Pruning = scan less → faster/cheaper."),
    ("Scale up vs scale out — correct pairing:",
     ["Up = more clusters for concurrency; Out = larger size for harder queries",
      "Up = larger warehouse size for heavier queries; Out = more clusters for concurrency",
      "Both always mean Fail-safe",
      "Both only change storage"],
     "B", "Memorize: size vs clusters."),
    ("Auto-suspend exists mainly to:",
     ["Delete databases nightly", "Stop idle compute credits", "Enable Marketplace", "Create RAP"],
     "B", "Idle WH should not burn credits."),
    ("Query Profile is used to:",
     ["Inspect operators, bytes scanned, spills, pruning clues", "Mask SSN", "Create editions", "Book Pearson"],
     "A", "Profile before guessing scale-up."),
    ("VARIANT columns store:",
     ["Only integers", "Semi-structured data (JSON-like) with path access", "Only encrypted roles", "Only warehouse configs"],
     "B", "VARIANT = semi-structured type."),
    ("QUALIFY is used to:",
     ["Filter results of window functions", "Create stages", "Set network policies", "Enable Fail-safe"],
     "A", "QUALIFY = WHERE for window outputs."),
    ("When a query spills to local/remote storage, a likely response is:",
     ["Ignore Profile forever", "Consider larger WH / reduce memory pressure / rewrite query", "Drop ACCOUNT_USAGE", "Disable pruning"],
     "B", "Spill ⇒ memory pressure — Profile + size/rewrite."),
    ("Query Acceleration Service (QAS) awareness:",
     ["Can help eligible queries with extra serverless compute", "Replaces all warehouses permanently", "Is Fail-safe", "Is a table type"],
     "A", "QAS = optional acceleration — know it exists."),
    ("Metadata cache / warehouse cache themes:",
     ["All caches are identical to Fail-safe", "Different caches (result, WH local, metadata) speed repeats under rules", "Caches store roles", "Caches require VPS"],
     "B", "Know multiple cache layers — not one blob."),
    ("MERGE is primarily for:",
     ["Upsert-style insert/update/delete from a source", "Creating shares", "Setting SSO", "Fail-safe tickets"],
     "A", "MERGE = conditional DML patterns."),
    ("FLATTEN helps you:",
     ["Unnest nested VARIANT/array structures into rows", "Scale warehouses", "Create monitors", "Enable MFA"],
     "A", "FLATTEN for semi-structured unnesting."),
    ("PIVOT in SQL is for:",
     ["Rotating row values into columns for reporting shapes", "Cloning accounts", "Network allow lists", "Snowpipe billing"],
     "A", "PIVOT = reshape results."),
    ("UDFs / stored procedures (exam spirit):",
     ["Extend logic in Snowflake (SQL/JS/Python themes via Snowpark)", "Replace storage layer", "Disable Cloud Services", "Create Fail-safe"],
     "A", "Programmability awareness."),
    ("Selectivity of filters matters because:",
     ["Highly selective filters improve pruning/scan efficiency", "Filters always disable result cache forever", "Filters create editions", "Filters grant roles"],
     "A", "Good filters → better pruning."),
    ("Concurrency slowdown with many users often points to:",
     ["Need scale-out / multi-cluster rather than only bigger single cluster", "Need to delete storage", "Need Fail-safe", "Need to remove stages"],
     "A", "Queueing ⇒ scale out / MCW."),
    ("Warehouse local disk cache helps:",
     ["Repeated scans of data already cached on that WH", "Permanent Fail-safe forever", "SSO login", "Marketplace search"],
     "A", "Warm WH can avoid re-reading remote storage — still not 'WH stores tables'."),
    ("Which first step when Kai says 'make it faster'?",
     ["Immediately XL the warehouse with no evidence", "Check Query Profile: pruning, bytes, spill, queues", "Drop the table", "Disable auto-suspend forever"],
     "B", "Diagnose before scaling."),
    ("Snowpark (exam spirit) lets you:",
     ["Write data pipelines/apps using DataFrame-style APIs in supported languages", "Only use SnowSQL forever", "Delete Cloud Services", "Bypass RBAC"],
     "A", "Snowpark = developer platform awareness."),
    ("Document AI / unstructured awareness on C03 means:",
     ["Snowflake can work with unstructured docs via platform features (awareness)", "Unstructured files replace all tables", "VARIANT is banned", "COPY is banned"],
     "A", "Unstructured/Document AI = awareness item."),
    ("Bigger WH is NOT always faster when:",
     ["Bottleneck is pruning/IO/spill/concurrency — not CPU alone", "The table has any rows", "You use Snowsight", "Auto-suspend is on"],
     "A", "Profile first — don't cargo-cult scale-up."),
]

D5 = [
    ("Time Travel vs Fail-safe — correct statement:",
     ["Identical features with different names", "TT = user recovery within retention; Fail-safe = Support-assisted after TT (permanent tables)", "Fail-safe is always user self-service SQL", "Transient tables have the longest Fail-safe"],
     "B", "TT = you; Fail-safe = Support; transient has no Fail-safe."),
    ("Zero-copy clone means:",
     ["Immediate full byte duplication of all data", "New object references existing micro-partitions until divergence", "A Marketplace purchase", "A network policy"],
     "B", "Clone shares partitions until someone changes data."),
    ("Secure Data Sharing provides:",
     ["Live query access to shared objects without typically copying data to the consumer", "Only CSV email dumps", "Automatic ACCOUNTADMIN for consumers", "Fail-safe for the consumer's local laptop"],
     "A", "Share = live access; consumer compute usually on their side."),
    ("Replication is primarily for:",
     ["Copying account/database state across regions/accounts for DR/availability themes", "Masking columns", "ON_ERROR options", "QUALIFY syntax"],
     "A", "Replicate = DR / cross-region themes."),
    ("UNDROP can recover:",
     ["Dropped tables/schemas/databases within Time Travel retention", "Any object after Fail-safe expires without Support", "Deleted cloud regions", "Pearson exam scores"],
     "A", "UNDROP within TT window."),
    ("Reader accounts are used when:",
     ["Consumers need shared data but don't have their own Snowflake account", "You want to disable Secure Sharing", "You need Fail-safe on temp tables", "You must avoid all compute"],
     "A", "Provider can sponsor reader accounts for consumers."),
    ("Marketplace listings relate to:",
     ["Discovering/sharing datasets and services in Snowflake's marketplace ecosystem", "Only warehouse sizes", "Only ON_ERROR", "Only clustering keys"],
     "A", "Marketplace = collab/commerce awareness."),
    ("Native Apps (exam awareness) allow:",
     ["Distributing apps that run in consumer accounts with controlled data access themes", "Deleting Cloud Services", "Replacing micro-partitions manually", "Skipping RBAC"],
     "A", "Native Apps = collab/app distribution awareness."),
    ("Clean Rooms (exam awareness) help parties:",
     ["Collaborate on sensitive data with controlled overlap/analysis patterns", "Publicly dump all PII", "Disable shares forever", "Remove Time Travel"],
     "A", "Clean Rooms = privacy-preserving collab theme."),
    ("AT | BEFORE clauses on queries relate to:",
     ["Time Travel as-of a timestamp or statement", "Network policy CIDRs", "Snowpipe Streaming SDK only", "Resource monitor quotas only"],
     "A", "AT/BEFORE = point-in-time TT reads."),
]

assert len(D1) == 31 and len(D2) == 20 and len(D3) == 18 and len(D4) == 21 and len(D5) == 10

def q_html(items, start):
    lines = [f'      <ol class="exam-q" start="{start}">']
    for stem, opts, letter, why in items:
        lines.append("        <li>")
        lines.append(f"          <p>{stem}</p>")
        lines.append("          <ul>")
        for i, o in enumerate(opts):
            lines.append(f"            <li>{chr(65+i)}. {o}</li>")
        lines.append("          </ul>")
        lines.append('          <details class="drill"><summary>Answer</summary>')
        lines.append(f'            <p class="drill-say"><strong>{letter}.</strong> {why}</p>')
        lines.append("          </details>")
        lines.append("        </li>")
    lines.append("      </ol>")
    return "\n".join(lines)

nav = "\n".join(
    f'        <a href="lab-{i:02d}.html">{i:02d}</a>' for i in range(0, 20)
) + '\n        <a class="active" href="lab-19b.html">19b</a>'

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lab 19b — Full 100-question mock (COF-C03)</title>
  <link rel="stylesheet" href="assets/course.css" />
</head>
<body data-visual-upgrade="1">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="index.html">DMart <span>Labs</span></a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="story.html">Story</a>
{nav}
      </nav>
    </div>
  </header>

  <div class="wrap">
    <p class="eyebrow">Lab 19b · Capstone boost · You are Priya · COF-C03</p>
    <h1>Full timed mock — 100 questions</h1>
    <p class="lede">
      Real exam shape: <strong>100 questions · 115 minutes</strong>. Closed notes. Score yourself /100.
      Gate: <strong>≥75</strong> before you book (official pass is scaled <strong>750</strong>/1000 — aim high).
      Warm-up: <a href="lab-19.html">Lab 19 (40Q)</a> · Night drills: <a href="flashcards.html">flashcards</a> ·
      Autopsy: <a href="DISTRACTOR_BANK.md">DISTRACTOR_BANK.md</a>.
    </p>

    <div class="picture-first" aria-label="How to study this lab">
      <span class="pf-icon" aria-hidden="true">1</span>
      <p><strong>Picture first.</strong> Read the comic → set a 115-minute timer → answer on paper A–D.
      Open each Answer <em>only after</em> the full set. Then map misses to labs via the weak-spot section.</p>
    </div>

    <div class="callout bad">
      <strong>Business problem</strong>
      Morgan wants Pearson booked this week. Priya cleared Lab 19 once while peeking at two answers —
      that is not exam proof. A lucky 40Q is not the same as a cold 100Q under time.
    </div>

    <div class="callout ok">
      <strong>Solution you will build</strong>
      One honest full mock matching COF-C03 weights (~31 Arch / ~20 Account / ~18 Load / ~21 Perf / ~10 Collab).
      Score ≥75, autopsy wrong distractors, re-drill weak labs aloud, then book.
    </div>

    <aside class="exam-tip" data-exam-tip="19b-after-solution" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>Booking gate.</strong> Lab 19 ≥32/40 twice <em>and</em> Lab 19b ≥75/100 cold before you pay Pearson. Scaled 750 ≠ raw 75 — leave margin.</div>
    </aside>

    <div class="ba-grid">
      <figure class="ba-panel before">
        <img src="assets/lab19-before.svg" alt="BEFORE: Labs done ≠ exam ready." width="1600" height="900" loading="eager" />
        <figcaption><strong>Before</strong> “I finished the labs” ≠ timed 100Q proof.</figcaption>
      </figure>
      <figure class="ba-panel after">
        <img src="assets/lab19-after.svg" alt="AFTER: Timed mock · weak-spot map · then book." width="1600" height="900" loading="eager" />
        <figcaption><strong>After</strong> 115 min · score /100 · weak-spot map · then book.</figcaption>
      </figure>
    </div>

    <section class="comic-strip" id="comic-19b-open" aria-label="Morgan pushes booking">
      <p class="comic-kicker">Episode 19b · Full mock</p>
      <h2 class="comic-title">Morgan pushes booking. Dev says finish 19b first.</h2>
      <div class="comic-row two">
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face morgan" role="img" aria-label="Morgan"></div>
            <div><span class="comic-name">Morgan</span><span class="comic-role">Manager</span></div>
          </div>
          <blockquote class="comic-bubble">Pearson has seats Friday. You did Lab 19. Let’s book.</blockquote>
        </figure>
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face dev" role="img" aria-label="Dev"></div>
            <div><span class="comic-name">Dev</span><span class="comic-role">Coach</span></div>
          </div>
          <blockquote class="comic-bubble">Not yet. Real exam is <strong>100 questions / 115 minutes</strong>. Finish Lab 19b cold — no peeking. Seventy-five or higher, then we book.</blockquote>
        </figure>
      </div>
      <p class="comic-caption">Vibes don’t pay retake fees. Timer + closed notes do.</p>
    </section>

    <section class="teach">
      <h2>Instructions</h2>
      <div class="see-grid two">
        <div class="see-card">
          <div class="see-label">Time</div>
          <strong>115 minutes</strong>
          <p>Phone timer. Closed notes / no other tabs. ~1 minute per question average.</p>
          <div class="see-example">Matches official COF-C03 length</div>
        </div>
        <div class="see-card">
          <div class="see-label">Scoring</div>
          <strong>≥75 / 100</strong>
          <p>Write A/B/C/D on paper. Expand Answer only after the full set.</p>
          <div class="see-example">Pass is scaled 750 — aim higher than bare minimum</div>
        </div>
      </div>
      <div class="see-grid two" style="margin-top:0.85rem">
        <div class="see-card">
          <div class="see-label">Weights</div>
          <strong>~ exam mix</strong>
          <p>Q1–31 Arch · Q32–51 Account · Q52–69 Load · Q70–90 Perf · Q91–100 Collab.</p>
          <div class="see-example">31 / 20 / 18 / 21 / 10</div>
        </div>
        <div class="see-card">
          <div class="see-label">After</div>
          <strong>Autopsy</strong>
          <p>Misses → <a href="DISTRACTOR_BANK.md">distractor bank</a> + weak-spot map. Flashcards night before.</p>
          <div class="see-example"><a href="flashcards.html">flashcards.html</a></div>
        </div>
      </div>
    </section>

    <aside class="exam-tip" data-exam-tip="19b-timing" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>Flag &amp; move.</strong> Don’t bleed 5 minutes on one stem. Mark, guess if needed, return if time remains.</div>
    </aside>

    <section class="teach" id="domain-1">
      <h2>Domain 1 — Architecture (Q1–Q31)</h2>
      <p>~31% of the real exam. Labs 01–05.</p>
{q_html(D1, 1)}
    </section>

    <aside class="exam-tip" data-exam-tip="19b-layers" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>Layer test.</strong> If an option says the warehouse “stores” tables — eliminate it. Storage · Compute · Cloud Services.</div>
    </aside>

    <section class="teach" id="domain-2">
      <h2>Domain 2 — Account management &amp; governance (Q32–Q51)</h2>
      <p>~20% of the real exam. Labs 06–09.</p>
{q_html(D2, 32)}
    </section>

    <section class="teach" id="domain-3">
      <h2>Domain 3 — Loading, unloading &amp; connectivity (Q52–Q69)</h2>
      <p>~18% of the real exam. Labs 10–12.</p>
{q_html(D3, 52)}
    </section>

    <aside class="exam-tip" data-exam-tip="19b-copy-pipe" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>Load triad.</strong> COPY = batch · Snowpipe = continuous files · Streaming = rows/SDK. Don’t mix them.</div>
    </aside>

    <section class="teach" id="domain-4">
      <h2>Domain 4 — Performance, querying &amp; transformation (Q70–Q90)</h2>
      <p>~21% of the real exam. Labs 13–15.</p>
{q_html(D4, 70)}
    </section>

    <section class="teach" id="domain-5">
      <h2>Domain 5 — Data collaboration (Q91–Q100)</h2>
      <p>~10% of the real exam. Labs 16–18.</p>
{q_html(D5, 91)}
    </section>

    <section class="teach" id="score-gate">
      <h2>Score yourself</h2>
      <div class="see-grid two">
        <div class="see-card">
          <div class="see-label">Pass bar</div>
          <strong>≥75 / 100</strong>
          <p>Below 75: do not book. Autopsy distractors, re-drill labs, retake cold another day.</p>
          <div class="see-example">Official pass is scaled 750;<br>use ≥75 raw here as a hard gate</div>
        </div>
        <div class="see-card">
          <div class="see-label">Also</div>
          <strong>Night before</strong>
          <p><a href="flashcards.html">60 trap flashcards</a> · <a href="EXAM_DAY_PLAYBOOK.md">Exam day playbook</a> · <a href="DISTRACTOR_BANK.md">Distractor bank</a></p>
          <div class="see-example">Say answers out loud</div>
        </div>
      </div>
    </section>

    <section class="teach" id="weak-spot-map">
      <h2>Weak-spot map — wrong domain → go here</h2>
      <div class="see-grid two">
        <div class="see-card">
          <div class="see-label">D1 misses</div>
          <strong>Architecture</strong>
          <p>Labs 01–05. Three layers, editions, micro-partitions, interfaces, AI awareness.</p>
          <div class="see-example">Q1–Q31 → Lab 01 first</div>
        </div>
        <div class="see-card">
          <div class="see-label">D2 misses</div>
          <strong>Security &amp; cost</strong>
          <p>Labs 06–09: RBAC, secondary roles, masking vs RAP, monitors, ACCOUNT_USAGE.</p>
          <div class="see-example">Q32–Q51 → Lab 06 + 08</div>
        </div>
      </div>
      <div class="see-grid two" style="margin-top:0.85rem">
        <div class="see-card">
          <div class="see-label">D3 misses</div>
          <strong>Load / pipelines</strong>
          <p>Labs 10–12: COPY vs pipe vs streaming, stages, streams/tasks, integrations.</p>
          <div class="see-example">Q52–Q69 → Lab 10 + 11</div>
        </div>
        <div class="see-card">
          <div class="see-label">D4 / D5</div>
          <strong>Perf + collaboration</strong>
          <p>Labs 13–15 performance/SQL; Labs 16–18 TT/clone/share/replicate.</p>
          <div class="see-example">Q70–Q90 · Q91–Q100</div>
        </div>
      </div>
    </section>

    <aside class="exam-tip" data-exam-tip="19b-before-drill" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>Two look right.</strong> Prefer the precise Snowflake term. Check layers, edition limits, and who recovers (you vs Support).</div>
    </aside>

    <section class="teach drill-wrap" id="interview-drill" aria-label="Exam day strategy">
      <h2>Exam-day strategy drills — say these out loud</h2>
      <details class="drill">
        <summary><strong>Q1.</strong> Timer starts — first 2 minutes?</summary>
        <p class="drill-say"><strong>Say:</strong> Breathe, accept NDA/rules, note ~1+ min/question budget for 100 items, don’t spiral on Q1. Flag mentally; process over panic.</p>
      </details>
      <details class="drill">
        <summary><strong>Q2.</strong> You are at Q40 with 40 minutes left — how do you pace?</summary>
        <p class="drill-say"><strong>Say:</strong> You’re slightly behind. Speed up easy stems, flag hard Domain 4/5 items, never spend 5 minutes on one. Protect the last 10 minutes for flagged returns.</p>
      </details>
      <details class="drill">
        <summary><strong>Q3.</strong> Two answers look right on a recovery question — how do you choose?</summary>
        <p class="drill-say"><strong>Say:</strong> TT = me + SQL inside retention. Fail-safe = Support only after TT. Transient ≠ Fail-safe. That triad breaks most Domain 5 traps.</p>
      </details>
      <details class="drill">
        <summary><strong>Q4.</strong> Performance stem says “slow” — mental checklist?</summary>
        <p class="drill-say"><strong>Say:</strong> Pruning/filters → bytes scanned → spill → size vs multi-cluster concurrency → caches. Don’t jump to “always scale up.”</p>
      </details>
      <details class="drill">
        <summary><strong>Q5.</strong> When do you actually book Pearson after 19b?</summary>
        <p class="drill-say"><strong>Say:</strong> After ≥75/100 cold (and Lab 19 ≥32 twice), weak domains re-said aloud, flashcards + playbook skimmed night before — not after peeking mid-mock.</p>
      </details>
    </section>

    <div class="soundbite">
      <strong>Priya’s wrap-up — booking checklist</strong><br />
      “I timed 100 questions closed-notes. Score ___ / 100.
      If ≥75: skim <a href="flashcards.html">flashcards</a> + <a href="EXAM_DAY_PLAYBOOK.md">EXAM_DAY_PLAYBOOK.md</a>, re-say Domain 5 traps, book Pearson VUE.
      If &lt;75: <a href="DISTRACTOR_BANK.md">distractor bank</a> → labs → cold retake.
      Also revisit <a href="lab-19.html">Lab 19</a> if the 40Q gate slipped.
      <em>Outcome:</em> book from evidence, not Morgan’s calendar pressure.”
    </div>

    <div class="callout tip">
      <strong>Pass-boost kit</strong>
      <a href="lab-19.html">Lab 19 (40Q)</a> ·
      <a href="flashcards.html">Trap flashcards</a> ·
      <a href="DISTRACTOR_BANK.md">Wrong-answer autopsy</a> ·
      <a href="EXAM_BLUEPRINT.md">Blueprint</a>
    </div>

    <div class="pager">
      <a class="btn ghost" href="lab-19.html">← Lab 19</a>
      <a class="btn primary" href="flashcards.html">Flashcards →</a>
    </div>
  </div>
  <footer class="footer">Lab 19b · 100Q timed mock · COF-C03 · DMart</footer>
  <script src="assets/course.js"></script>
</body>
</html>
'''

out = Path(__file__).resolve().parents[1] / "docs" / "lab-19b.html"
out.write_text(html, encoding="utf-8")
print(f"Wrote {out} ({out.stat().st_size} bytes)")
