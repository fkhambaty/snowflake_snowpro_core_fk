# Exam tips — Domain 4 (Performance, querying & transformation)

**COF-C03 weight ~21% · Labs 13–15**  
Say these out loud. Distractors usually swap *which lever* fixes *which pain*.

## 4.1 Query performance (Lab 13)

| Tip | Truth |
|-----|--------|
| Three caches | **Result** (cloud services, reuse exact result — often 0 WH credits), **local disk** (WH SSD — dies on suspend), **metadata** (partition stats for pruning/planning) |
| Profile first | Snowsight → Query History → Profile. Look at TableScan partitions scanned, join cardinality, spill |
| Bigger WH myth | Helps CPU/memory-bound work; **not** a cure for scanning everything or tiny already-cached results |
| Pruning | Skip micro-partitions using min/max metadata + selective filters / clustering |
| Spill | Intermediate data left memory → local/remote storage. Remote spill = latency pain → scale up or rewrite |
| QAS | Query Acceleration Service offloads large scan/filter work to serverless acceleration — not for bad join explosions |
| RESULT_SCAN | Re-query a prior result by query id without re-running the original SQL |
| Clustering info | `SYSTEM$CLUSTERING_INFORMATION` — use when a table is clustered; depth/overlap stories on exams |

**Spoken one-liner:** “I open Profile before I resize. I name which cache or operator is the bottleneck.”

## 4.2 Warehouses (Lab 14)

| Tip | Truth |
|-----|--------|
| Scale **UP** | Larger `WAREHOUSE_SIZE` — more power per cluster (complexity, spill, heavy single queries) |
| Scale **OUT** | Multi-cluster warehouse (Enterprise+) — more clusters for **concurrency** / queues |
| Resize online | In-flight queries finish on old servers; new queries use new size |
| AUTO_SUSPEND / RESUME | Stop idle credit burn; resume on next statement. Too aggressive → resume latency chatter |
| MCW min/max | Floor/ceiling of clusters; credits ≈ size × active clusters × time |
| Statement timeout | Guardrail against runaway SQL (`STATEMENT_TIMEOUT_IN_SECONDS`) |
| DMart habit | Daily work on `WH_CORE_XS`; demo `WH_CORE_M` then shrink + suspend |

**Spoken one-liner:** “Queues → out. Heavy single query → up. Never leave Medium idling.”

## 4.3 SQL features (Lab 15)

| Tip | Truth |
|-----|--------|
| QUALIFY | Filter **after** window functions (like HAVING for windows). Cleaner than subquery wrappers |
| PIVOT | Reshape values → columns; recognize the pattern even if syntax is rusty |
| MERGE | Upsert / CDC apply: `WHEN MATCHED` / `WHEN NOT MATCHED` |
| UDF | Scalar value in SQL expressions |
| UDTF | Returns a table — use in `FROM` |
| Stored proc | Procedural logic via `CALL` — **not** a SELECT-list function |
| Snowpark awareness | DataFrame API in Python/Java/Scala on Snowflake compute — Domain 4 mentions it; labs stay SQL-first |

**Spoken one-liner:** “QUALIFY for windows, MERGE for upserts, CALL for procs — don’t mix UDF and procedure.”

## 4.4 Semi-structured (Lab 15)

| Tip | Truth |
|-----|--------|
| VARIANT | Typed-flexible column for JSON/Avro/etc. |
| Path syntax | `col:field`, nested `col:a.b`, or `col['a']['b']` — cast with `::TYPE` |
| FLATTEN | Lateral explode of arrays/objects into rows (`KEY` / `VALUE` / `INDEX`) |
| Directory tables / Document AI | Awareness topics — listing stage files; AI document extraction (exam may name-drop) |

**Spoken one-liner:** “Store JSON in VARIANT, pull with `:path`, explode with FLATTEN.”

## High-frequency distractors

1. “Warehouse local cache stores permanent table data” → **No** — storage layer holds tables; local cache is WH SSD.
2. “Multi-cluster makes one query’s CPU bigger” → **No** — that’s scale up; MCW is concurrency.
3. “QUALIFY is the same as WHERE” → **No** — WHERE can’t see window results.
4. “Stored procedures belong in the SELECT list” → **No** — use `CALL`; UDFs go in expressions.
5. “Snowpipe Streaming is AUTO_INGEST=true” → **No** — that’s classic pipe + notifications (Domain 3); don’t import that confusion into Domain 4 warehouse questions either.

## Quick self-check (before Lab 19 mock)

- [ ] Name three caches + one sentence each  
- [ ] Scale up vs out with an DMart example  
- [ ] Draw QUALIFY vs subquery mentally  
- [ ] UDF vs UDTF vs proc in one breath  
- [ ] Read `payload:user.id` and explain FLATTEN  

Labs: [13](lab-13.html) · [14](lab-14.html) · [15](lab-15.html) · Blueprint: [EXAM_BLUEPRINT.md](EXAM_BLUEPRINT.md)
