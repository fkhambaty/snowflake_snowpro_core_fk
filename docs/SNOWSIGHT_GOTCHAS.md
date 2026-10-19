# Snowsight gotchas (read once — saves hours)

## 1. Secondary roles stay on

Snowsight keeps **secondary roles** (often `ROLE_CORE_LAB_ADMIN` or `ACCOUNTADMIN`) active. The UI can show `FR_ANALYST` while privileged objects still open.

**Whenever** you prove a deny for `FR_ANALYST` / `FR_DATA_ENGINEER`:

```sql
USE ROLE FR_ANALYST;
USE SECONDARY ROLES NONE;
SELECT CURRENT_ROLE(), CURRENT_SECONDARY_ROLES();
```

## 2. Don’t “Run All” past a role switch

Run **setup** as `ROLE_CORE_LAB_ADMIN`. Run **proof** statements in a separate selection after the role switch.

## 3. Warehouse must be resumed

If queries hang or say warehouse is suspended, `USE WAREHOUSE WH_CORE_XS;` and run a tiny `SELECT 1;` — auto-resume should wake it.

## 4. Trial edition limits

Some Enterprise features (90-day Time Travel, multi-cluster WH, some governance) need Enterprise+. Know the **edition matrix for the exam** even if your trial can’t demo every click.

## 5. ACCOUNT_USAGE lag

`SNOWFLAKE.ACCOUNT_USAGE` views can lag up to ~45 minutes–2 hours. For instant checks use `INFORMATION_SCHEMA` or `QUERY_HISTORY` table functions where appropriate.
