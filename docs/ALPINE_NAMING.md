# Alpine Retail naming (never invent random names)

| Object | Name | Why |
|--------|------|-----|
| Database | `ALPINE_RETAIL` | One building for the whole course |
| Daily warehouse | `WH_CORE_XS` | Cheap engine; auto-suspend |
| Bigger warehouse | `WH_CORE_M` | Scale-up demos only (Lab 14) |
| Lab admin | `ROLE_CORE_LAB_ADMIN` | Day-to-day DDL after bootstrap |
| Analyst FR | `FR_ANALYST` | Job badge for Kai |
| Engineer FR | `FR_DATA_ENGINEER` | Job badge for Riley |
| Read key-ring | `AR_LAB_READ` | Access role example |
| Practice schema | `LAB` | Most hands-on tables |
| Secure schema | `SECURE` | Masking / RAP / tags |
| Pipeline schema | `PIPELINE` | Streams / tasks / pipes |
| Share demo schema | `SHARE_DEMO` | Outbound share objects |

## Cast

| Person | Role in story |
|--------|----------------|
| **Priya Chen** | You — junior DE studying for SnowPro Core |
| **Dev Okonkwo** | Coach — explains *why* in plain words |
| **Kai Rivera** | Analyst beginner — asks the “dumb” questions |
| **Riley Okada** | Peer engineer — pipelines & loading |
| **Morgan Hale** | Manager — exam deadline / cost pressure |
| **Sam Park** | Compliance — security & governance |

## Role proofs (Snowsight gotcha)

Whenever SQL switches to `FR_ANALYST` or `FR_DATA_ENGINEER` for a privilege proof:

```sql
USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
```

See `docs/SNOWSIGHT_GOTCHAS.md`.
