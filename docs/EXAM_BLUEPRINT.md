# SnowPro Core COF-C03 — exam blueprint (this course’s checklist)

**Exam:** COF-C03 · 100 questions · 115 minutes · pass **750**/1000 (scaled) · ~$175 USD  
**This course maps every subdomain below to a lab.** Check boxes as you go.

> Official guide can change. Before exam day, re-download Snowflake’s current study guide PDF from learn.snowflake.com and diff against this page.

## Domain 1 — Architecture (~31%) → Labs 01–05

- [ ] 1.1 Key features (elastic storage/compute, cloud partners)
- [ ] 1.2 Three layers: storage, compute (WH), cloud services
- [ ] 1.3 Interfaces: Snowsight, SnowSQL, CLI, drivers, connectors
- [ ] 1.4 Editions: Standard, Enterprise, Business Critical, VPS
- [ ] 1.5 Storage: micro-partitions, clustering, table types (incl. Iceberg, Dynamic), view types
- [ ] 1.6 AI/apps: Notebooks, Streamlit in Snowflake, Snowpark, Cortex AI/Search/Analyst, Snowflake ML

## Domain 2 — Account management & data governance (~20%) → Labs 06–09

- [ ] 2.1 Security: RBAC, MFA, SSO, OAuth, key-pair, network policies, Trust Center
- [ ] 2.2 Governance: masking, row access, tags, classification, lineage, clean rooms (intro)
- [ ] 2.3 Monitoring & cost: Resource Monitors, ACCOUNT_USAGE, credit math

## Domain 3 — Loading, unloading & connectivity (~18%) → Labs 10–12

- [ ] 3.1 Load/unload: file formats, stages, directory tables, COPY INTO, errors
- [ ] 3.2 Automation: Snowpipe, Snowpipe Streaming, Streams, Tasks, Dynamic Tables
- [ ] 3.3 Connectors & integrations (Kafka, Spark, storage integrations, API integrations)

## Domain 4 — Performance, querying & transformation (~21%) → Labs 13–15

- [ ] 4.1 Query performance: caches, pruning, Query Profile, Query Acceleration Service
- [ ] 4.2 Warehouses: size, scale up/out, auto-suspend, multi-cluster
- [ ] 4.3 SQL features: QUALIFY, PIVOT, MERGE, UDFs, stored procs, Snowpark
- [ ] 4.4 Semi/unstructured: VARIANT, FLATTEN, directory tables, Document AI (awareness)

## Domain 5 — Data collaboration (~10%) → Labs 16–18

- [ ] 5.1 Time Travel & Fail-safe (AT/BEFORE, UNDROP, windows, 7-day Fail-safe)
- [ ] 5.2 Secure sharing (direct, reader accounts, Marketplace, Native Apps, Clean Rooms)
- [ ] 5.3 Zero-copy cloning & replication

## Capstone

- [ ] Lab 19 mock exam ≥ 80% before you book Pearson VUE
- [ ] Weak domains re-drilled aloud

## High-frequency traps (memorize)

| Trap | Truth |
|------|--------|
| “Warehouse stores data” | No — storage layer holds micro-partitions; WH is compute |
| “Bigger WH always faster” | Not if bottleneck is pruning/IO/spill — Profile first |
| Time Travel = Fail-safe | Different: TT is user-recoverable; Fail-safe is Snowflake Support only |
| Clone copies bytes immediately | Zero-copy until divergence |
| Secondary roles in Snowsight | Still active — `USE SECONDARY ROLES NONE` for proofs |
| Snowpipe vs COPY | Pipe = continuous/auto; COPY = batch you run |
| Transient has Fail-safe | No Fail-safe on transient/temp |
| Standard edition 90-day TT | Enterprise+ for up to 90 days |
