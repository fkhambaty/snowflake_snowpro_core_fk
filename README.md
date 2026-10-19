# Alpine Retail — SnowPro Core Certification Prep (COF-C03)

You are **Priya Chen**, junior data engineer at **Alpine Retail**. Each lab is a plain-English problem → hands-on Snowflake → **exam drill** so you can pass **SnowPro Core (COF-C03)** — not just finish worksheets.

> Goal: cover **100% of the official exam blueprint** (Architecture 31%, Account & Governance 20%, Loading/Connectivity 18%, Performance/Query/Transform 21%, Collaboration 10%) plus the high-frequency traps that fail candidates.

## Open the course (HTML)

**GitHub Pages:** https://fkhambaty.github.io/snowflake_snowpro_core_fk/  
**Repo:** [fkhambaty/snowflake_snowpro_core_fk](https://github.com/fkhambaty/snowflake_snowpro_core_fk)  
Local: open [`docs/index.html`](docs/index.html)  
**Start here:** [`docs/story.html`](docs/story.html) → Lab 00.

## Naming (Alpine story)

| Object | Name |
|--------|------|
| Database | `ALPINE_RETAIL` |
| Warehouse (daily) | `WH_CORE_XS` |
| Warehouse (heavy / demo) | `WH_CORE_M` |
| Lab admin role | `ROLE_CORE_LAB_ADMIN` |
| Practice schema | `LAB` |
| Secure demos | `SECURE` |
| Pipeline demos | `PIPELINE` |

Full map: [`docs/ALPINE_NAMING.md`](docs/ALPINE_NAMING.md)

## Lab map (exam domain → problem → solution)

| Lab | Domain | You learn |
|-----|--------|-----------|
| 00 | Setup | Trial workshop: DB, WH, role, sample rows |
| 01 | Arch 31% | Three layers + editions (the exam’s heart) |
| 02 | Arch | Object catalog: tables, views, stages, pipes, shares… |
| 03 | Arch | Micro-partitions, clustering, storage monitoring |
| 04 | Arch | Table types + Iceberg + Dynamic Tables |
| 05 | Arch | Interfaces + Cortex / Snowpark / Streamlit (C03) |
| 06 | Acct 20% | RBAC: roles, grants, ownership |
| 07 | Acct | Auth, MFA/SSO/key-pair, network policies, Trust Center |
| 08 | Acct | Masking, row access, tags, classification, lineage |
| 09 | Acct | Resource monitors, credits, ACCOUNT_USAGE |
| 10 | Load 18% | Stages, file formats, COPY INTO, unload |
| 11 | Load | Snowpipe + Snowpipe Streaming |
| 12 | Load | Streams, Tasks, Dynamic Tables pipelines |
| 13 | Perf 21% | Caching, pruning, Query Profile, QAS |
| 14 | Perf | Warehouse size, scale up/out, multi-cluster |
| 15 | Perf | SQL power + VARIANT / FLATTEN / unstructured |
| 16 | Collab 10% | Time Travel, Fail-safe, UNDROP |
| 17 | Collab | Zero-copy clone + replication / DR |
| 18 | Collab | Secure share, Marketplace, Native Apps, Clean Rooms |
| 19 | Capstone | Full mock exam + domain weak-spot drills |

~**20–24 hours** · schedule: [`docs/COURSE_SCHEDULE.md`](docs/COURSE_SCHEDULE.md) · blueprint: [`docs/EXAM_BLUEPRINT.md`](docs/EXAM_BLUEPRINT.md)

## How this course teaches (same bar as Architect prep)

Every lab: business problem → BEFORE/AFTER → comics (Kai asks, Dev explains why) → tiny SQL chunks → **Exam presses further** (≥4 hard Q&As) → Priya wrap-up.

See [`docs/TEACHING_STANDARD.md`](docs/TEACHING_STANDARD.md).

## Privileges / cleanup

- Bootstrap: [`sql/00_bootstrap.sql`](sql/00_bootstrap.sql) (grants `ROLE_CORE_LAB_ADMIN` to **your** user via `CURRENT_USER()`)
- Stuck on “role is not assigned”? → [`sql/00_privilege_repair.sql`](sql/00_privilege_repair.sql) as `ACCOUNTADMIN`
- Sample data: [`sql/00_sample_data.sql`](sql/00_sample_data.sql)
- Cleanup: [`sql/cleanup_lab.sql`](sql/cleanup_lab.sql)
- Gotchas: [`docs/SNOWSIGHT_GOTCHAS.md`](docs/SNOWSIGHT_GOTCHAS.md)
- Author check: `powershell -File scripts/check_lab_invariants.ps1`

## Honest pass promise

No course can *guarantee* a 1000/1000 score. This repo is built to cover **every scored subdomain** on the COF-C03 study guide, with hands-on labs + spoken exam drills + a timed mock. Do the labs, say the drills out loud, and redo Lab 19 until your weak domains are green.
