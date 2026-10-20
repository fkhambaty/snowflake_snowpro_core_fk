# DMart naming (never invent random names)

DMart is a grocery chain in India. One database holds the whole project.

| Object | Name | Why |
|--------|------|-----|
| Database | `DMART` | One building for the whole course |
| Dev copy | `DMART_DEV` | Zero-copy clone in Lab 17 |
| Daily warehouse | `WH_CORE_XS` | Cheap engine; auto-suspend |
| Bigger warehouse | `WH_CORE_M` | Scale-up demos only (Lab 14) |
| Lab admin | `ROLE_CORE_LAB_ADMIN` | Day-to-day DDL after bootstrap |
| Analyst FR | `FR_ANALYST` | Job role for Kai |
| Engineer FR | `FR_DATA_ENGINEER` | Job role for Riley |
| Read key-ring | `AR_LAB_READ` | Access role example |
| Practice schema | `LAB` | Most hands-on tables |
| Secure schema | `SECURE` | Masking / RAP / tags |
| Pipeline schema | `PIPELINE` | Streams / tasks / pipes |
| Share demo schema | `SHARE_DEMO` | Catalog shared with a supplier |
| Credit fuse | `RM_DMART_LAB` | Resource monitor (Lab 09) |
| Inbound stage | `STG_DMART_LOAD` | Store files (Lab 10) |
| Catalog share | `DMART_PRODUCT_SHARE` | Supplier share (Lab 18) |

Sample loyalty rows use Indian state codes in `STATE`: `MH` (Maharashtra), `KA` (Karnataka), `TS` (Telangana). Amounts are rupees (`AMOUNT_INR`).

## Cast

| Person | Role in story |
|--------|----------------|
| **Priya Chen** | You — junior data engineer building the platform |
| **Dev Okonkwo** | Senior engineer — explains *why* in plain words |
| **Kai Rivera** | Category analyst — asks the questions that sound obvious |
| **Riley Okada** | Pipelines and loading |
| **Morgan Hale** | Store operations — go-live and cost |
| **Sam Park** | Compliance — loyalty data stays locked |

## Role proofs (Snowsight gotcha)

Whenever SQL switches to `FR_ANALYST` or `FR_DATA_ENGINEER` for a privilege proof:

```sql
USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
```

See `docs/SNOWSIGHT_GOTCHAS.md`.
