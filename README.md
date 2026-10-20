# DMart Labs — a grocery chain on Snowflake

You are **Priya Chen**, junior data engineer at **DMart**, a grocery chain in India. The course is one project: stand up a Snowflake platform for store sales, stock, and loyalty. Each lab solves one business problem. Pictures first, then the cast, then a little SQL.

Yellow **EXAM TIP** boxes, the spoken drills, and Labs 19 and 19b are for you. They cover SnowPro Core (COF-C03). The story itself stays the store project.

## Open the course (HTML)

**GitHub Pages:** https://fkhambaty.github.io/snowflake_snowpro_core_fk/  
**Repo:** [fkhambaty/snowflake_snowpro_core_fk](https://github.com/fkhambaty/snowflake_snowpro_core_fk)  
Local: open [`docs/index.html`](docs/index.html)  
**Start here:** [`docs/story.html`](docs/story.html) → Lab 00.

## Naming (DMart story)

| Object | Name |
|--------|------|
| Database | `DMART` |
| Warehouse (daily) | `WH_CORE_XS` |
| Warehouse (heavy / demo) | `WH_CORE_M` |
| Lab admin role | `ROLE_CORE_LAB_ADMIN` |
| Practice schema | `LAB` |
| Secure demos | `SECURE` |
| Pipeline demos | `PIPELINE` |

Full map: [`docs/DMART_NAMING.md`](docs/DMART_NAMING.md)

## Lab map (store problem → what you learn)

| Lab | Domain | You learn |
|-----|--------|-----------|
| 00 | Setup | Trial workshop: DB, WH, role, sample rows |
| 01 | Where data lives | Three layers + editions — why the bill splits |
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
| 19 | Capstone | 40Q gate mock |
| 19b | Capstone | **100Q / 115 min** full mock |
| — | Pass boost | [`flashcards.html`](docs/flashcards.html) · [`DISTRACTOR_BANK.md`](docs/DISTRACTOR_BANK.md) |

~**24–30 hours** with mocks · schedule: [`docs/COURSE_SCHEDULE.md`](docs/COURSE_SCHEDULE.md) · blueprint: [`docs/EXAM_BLUEPRINT.md`](docs/EXAM_BLUEPRINT.md)

### How to study (if reading is hard)

1. Look at **BEFORE/AFTER** pictures  
2. Read the **comic** (Kai asks, Dev explains why)  
3. Run the **tiny SQL** chunk  
4. Pause on every yellow **EXAM TIP**  
5. Say the drills out loud → then Lab 19 → Lab 19b → flashcards

## How this course teaches (same bar as Architect prep)

Every lab: store problem → BEFORE/AFTER → comics (Kai asks, Dev explains why) → tiny SQL chunks → yellow exam tips and spoken drills for you → Priya wrap-up.

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
