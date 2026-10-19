# Exam tips — Domains 2 & 3 (Account + Loading)

## Domain 2 traps

| Distractor | Truth |
|------------|--------|
| SSO = MFA | Different; often combined |
| Network policy = RBAC | IP gate ≠ table privileges |
| Masking hides rows | Masking = columns; RAP = rows |
| ACCOUNT_USAGE is live | Often lagged |
| Auto-suspend = resource monitor | Idle vs quota — both needed |

## Domain 3 traps

| Distractor | Truth |
|------------|--------|
| Resize WH to speed Snowpipe | Pipe is serverless credits |
| Streaming = AUTO_INGEST | Streaming is row/SDK path |
| COPY doesn’t need a warehouse | Classic COPY uses a WH |
| Stage = staging table | Stage = file location |
| Pipe loads all history instantly | Events + REFRESH/COPY for backlog |

## Say aloud

“Privileges go to access roles, access roles to functional roles, functional roles to users. Load with stage + format + COPY; automate with pipe/stream/task/dynamic tables — pick the right animal.”
