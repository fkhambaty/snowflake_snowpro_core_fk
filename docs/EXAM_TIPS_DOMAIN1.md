# Exam tips — Domain 1 Architecture (~31%)

One page of traps. Say answers out loud. Labs **01–05**.

## Three layers (never blur)

| Layer | Job | Alpine cue |
|-------|-----|------------|
| **Database Storage** | Holds compressed micro-partitions | `ALPINE_RETAIL` tables / bytes |
| **Query Processing** | Virtual warehouses = compute credits | `WH_CORE_XS` |
| **Cloud Services** | Auth, metadata, optimizer, coordination | Login, SHOW, planning |

**Trap:** “The warehouse stores data.” → **False.** Bigger WH ≠ more storage.

**Trap:** Cloud Services is “always free.” → Metered; daily credit vs compute applies — not the same as warehouse credits.

**Benefit of separation:** Scale/pay storage and compute independently; suspend compute without deleting data.

## Editions (pick the lowest that unlocks the feature)

| Need | Edition floor (exam ladder) |
|------|------------------------------|
| Baseline / 1-day TT default | Standard |
| Time Travel **up to 90 days**, Multi-cluster WH | **Enterprise+** |
| Tri-Secret Secure, PrivateLink (hardened) | **Business Critical+** |
| Dedicated isolated deployment | **VPS** |

**Trap:** “Standard can do 90-day Time Travel.” → **No.**

## Storage internals (Lab 03)

- Tables = many **micro-partitions** with min/max metadata → **pruning** skips useless partitions.
- **Clustering keys** help large tables stay prune-friendly; **cost credits** to maintain.
- **Don’t cluster** tiny tables or when pruning isn’t the bottleneck — Profile first, not “always bigger WH.”

## Table / view types (Labs 02 & 04)

| Type | Remember |
|------|----------|
| Permanent | Time Travel + **Fail-safe** |
| Transient | TT possible · **no Fail-safe** |
| Temporary | **Session** scope · no Fail-safe |
| External | Read-oriented over **stage files** |
| Iceberg | Open format · volume/catalog (C03 awareness) |
| Dynamic Table | Declare SELECT + **TARGET_LAG**; Snowflake refreshes |
| View | Saved query · **no** stored result set |
| Materialized view | **Stores** precomputed results · cost/refresh |

**Trap:** “Transient has Fail-safe.” → **No.**

## Objects & scope (Lab 02)

- **Account-level (examples):** warehouses, users, roles, shares, many integrations.
- **Schema-level (examples):** tables, views, stages, file formats, sequences, pipes, streams, tasks.
- **Named stage** = shareable schema object. **User stage (`@~`)** = personal.

## Interfaces & AI (Lab 05)

- Snowsight / SnowSQL / drivers / connectors = different **doors**, same engine.
- **Snowpark** when DataFrames/code pipelines help; not a mandatory rewrite of every SELECT.
- **Cortex** = in-account SQL AI functions (when enabled). ≠ paste data into a public external LLM.
- **Streamlit in Snowflake** runs **in the account**. Notebooks are a workspace — still need a warehouse.

## 30-second oral checklist

1. Name the three layers.  
2. Warehouse ≠ storage.  
3. 90-day TT → Enterprise+.  
4. Tri-Secret / PrivateLink → Business Critical+.  
5. Transient/temp → no Fail-safe.  
6. Pruning before blind scale-up.  
7. View ≠ MV. Named stage ≠ user stage.  
8. Cortex in-account; SiS runs in Snowflake.

Labs: [01](lab-01.html) · [02](lab-02.html) · [03](lab-03.html) · [04](lab-04.html) · [05](lab-05.html) · Blueprint: [EXAM_BLUEPRINT.md](EXAM_BLUEPRINT.md)
