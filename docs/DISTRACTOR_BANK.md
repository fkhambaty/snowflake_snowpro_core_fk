# Distractor bank — wrong-answer autopsy (COF-C03)

Use this when you miss a mock question: match the wrong choice → why it fails → which Alpine lab to re-drill aloud.

| # | Classic distractor (sounds smart) | Why it’s wrong | Re-drill lab |
|---|-----------------------------------|----------------|--------------|
| 1 | “The warehouse stores the table data.” | Warehouses are **compute**. Micro-partitions live in the **storage** layer. | Lab 01 |
| 2 | “Bigger warehouse = more storage capacity.” | Size changes CPU/memory for queries; storage is billed separately. | Lab 01, 14 |
| 3 | “Cloud Services runs inside your WH size.” | Cloud Services is the control plane (auth, metadata, optimizer) — not WH RAM. | Lab 01 |
| 4 | “Standard edition allows 90-day Time Travel.” | Up to **90 days** needs **Enterprise+**. Standard is typically **1 day**. | Lab 01, 16 |
| 5 | “Fail-safe is a CREATE TABLE type.” | Fail-safe is a **retention period after TT**, not a table type. | Lab 04, 16 |
| 6 | “Transient tables have Fail-safe.” | Transient/temp: **no Fail-safe** (and limited TT). | Lab 04, 16 |
| 7 | “Time Travel and Fail-safe are the same.” | TT = **you** recover with SQL. Fail-safe = **Support only**, after TT (~7d permanent). | Lab 16 |
| 8 | “Masking and RAP do the same thing.” | **Masking** = column values; **RAP** = which **rows** you see. | Lab 08 |
| 9 | “Snowpipe is just COPY you forgot to run.” | COPY = **batch** you run; Snowpipe = **continuous/auto** ingest (serverless credits). | Lab 10, 11 |
| 10 | “Snowpipe Streaming = file COPY on a schedule.” | Streaming is **row/SDK** continuous ingest — not file-batch COPY. | Lab 11 |
| 11 | “Scale up and scale out are identical.” | **Up** = larger size (harder queries); **out** = more clusters (concurrency). | Lab 14 |
| 12 | “Always scale up when a query is slow.” | Profile first: pruning, bytes scanned, spill, concurrency — size isn’t always the fix. | Lab 13, 14 |
| 13 | “Clone immediately doubles storage bytes.” | **Zero-copy** until data diverges; then only changed partitions add storage. | Lab 17 |
| 14 | “Share, clone, and replicate are synonyms.” | **Share** = live access; **clone** = in-account twin; **replicate** = DR across region/account. | Lab 17, 18 |
| 15 | “Result cache always returns instantly for any similar SQL.” | Result cache is **eligible** only under rules (same query/results context; underlying data unchanged). | Lab 13 |
| 16 | “Secondary roles don’t matter in Snowsight.” | Snowsight often keeps secondaries active — privilege proofs need `USE SECONDARY ROLES NONE`. | Lab 06, gotchas |
| 17 | “ON_ERROR = CONTINUE means ‘ignore all load quality’.” | CONTINUE skips bad **files/rows** per option — still validate; ABORT_STATEMENT stops the load. | Lab 10 |
| 18 | “WHERE filters window-function results the same as QUALIFY.” | Window results need **QUALIFY**; WHERE can’t see window output the same way. | Lab 15 |
| 19 | “VARIANT is just VARCHAR with JSON text.” | VARIANT is a **semi-structured type** with path access / optimization — not plain string. | Lab 15 |
| 20 | “Micro-partitions are fixed 50 MB blocks you size by hand.” | Snowflake **auto-manages** compressed micro-partitions (~historically ~16 MB uncompressed target). | Lab 03 |
| 21 | “Resource Monitors replace ACCOUNT_USAGE.” | Monitors = **credit quotas/actions**; ACCOUNT_USAGE = **historical** usage views (latency OK). | Lab 09 |
| 22 | “Secure share = email a CSV dump.” | Share = **live query access** to objects; consumer typically pays their compute. | Lab 18 |
| 23 | “Multi-cluster warehouse fixes pruning problems.” | MCW helps **concurrency**; pruning is a **storage/filter** issue — Profile first. | Lab 13, 14 |
| 24 | “Business Critical is required for Time Travel.” | TT exists on lower editions; BC is about **security / advanced HA** themes — don’t over-pick. | Lab 01 |
| 25 | “Cortex replaces warehouses for all SQL.” | Cortex = **AI functions/services** awareness on C03; warehouses still run SQL compute. | Lab 05 |

## How to use

1. After Lab 19 / **19b**, list every wrong letter.  
2. Find the distractor pattern above (or add your own row).  
3. Say the **truth** column out loud, then re-open that lab’s exam drill.  
4. Night before: skim this table once — don’t learn new topics.
