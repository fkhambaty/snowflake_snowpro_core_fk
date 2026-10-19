# SnowPro Core mock — full answer key (Lab 19)

**Bar:** ≥32 / 40 (80%) before booking Pearson VUE.  
**Source:** `docs/lab-19.html` (expand each Answer only after you finish).

## Quick letter key

| Q | Ans | Domain | Q | Ans | Domain |
|---|-----|--------|---|-----|--------|
| 1 | B | D1 | 21 | B | D3 |
| 2 | B | D1 | 22 | A | D3 |
| 3 | B | D1 | 23 | B | D3 |
| 4 | B | D1 | 24 | B | D3 |
| 5 | B | D1 | 25 | A | D3 |
| 6 | D | D1 | 26 | A | D3 |
| 7 | B | D1 | 27 | A | D3 |
| 8 | B | D1 | 28 | B | D4 |
| 9 | B | D1 | 29 | A | D4 |
| 10 | B | D1 | 30 | A | D4 |
| 11 | B | D1 | 31 | B | D4 |
| 12 | B | D1 | 32 | A | D4 |
| 13 | A | D2 | 33 | A | D4 |
| 14 | B | D2 | 34 | A | D4 |
| 15 | A | D2 | 35 | B | D4 |
| 16 | B | D2 | 36 | B | D5 |
| 17 | B | D2 | 37 | B | D5 |
| 18 | A | D2 | 38 | B | D5 |
| 19 | A | D2 | 39 | B | D5 |
| 20 | B | D2 | 40 | A | D5 |

## Domain 1 — Architecture (1–12)

1. **B** — WH is compute; storage holds micro-partitions.  
2. **B** — Storage / Query Processing / Cloud Services.  
3. **B** — Enterprise+ for up to 90-day Time Travel; Standard ~1 day.  
4. **B** — Auto-managed compressed micro-partitions.  
5. **B** — Snowsight = web UI; SnowSQL = CLI.  
6. **D** — Fail-safe is not a CREATE TABLE type.  
7. **B** — Auth, metadata, optimizer live in Cloud Services.  
8. **B** — Business Critical → security / advanced failover themes.  
9. **B** — Secure view protects underlying/definition exposure.  
10. **B** — AWS / Azure / GCP.  
11. **B** — AI/apps awareness (Cortex, Snowpark, Streamlit).  
12. **B** — Clustering aids pruning when filters align.

## Domain 2 — Account management & governance (13–20)

13. **A** — Privileges → roles → users.  
14. **B** — Masking transforms columns at query time.  
15. **A** — RAP = which rows; masking = column values.  
16. **B** — Resource Monitors track/limit credits.  
17. **B** — ACCOUNT_USAGE = historical (latency OK).  
18. **A** — Network policies = IP allow/block.  
19. **A** — Tags for governance/classification.  
20. **B** — MFA / SSO / key-pair = auth controls.

## Domain 3 — Loading & connectivity (21–27)

21. **B** — COPY = batch; Snowpipe = continuous.  
22. **A** — Snowpipe for continuous/near-continuous load.  
23. **B** — Internal or external stages.  
24. **B** — Streams = change tracking / CDC-style.  
25. **A** — Tasks schedule SQL/pipeline work.  
26. **A** — FILE FORMAT = CSV/JSON/Parquet options.  
27. **A** — Storage integration secures cloud storage access.

## Domain 4 — Performance & SQL (28–35)

28. **B** — Result cache only when eligible / data unchanged.  
29. **A** — Pruning skips irrelevant micro-partitions.  
30. **A** — Scale-up = size; scale-out = clusters/concurrency.  
31. **B** — Auto-suspend stops idle compute credits.  
32. **A** — Query Profile for bottlenecks/spills/pruning.  
33. **A** — VARIANT = semi-structured.  
34. **A** — QUALIFY filters window-function results.  
35. **B** — Bigger WH is not always faster — Profile first.

## Domain 5 — Collaboration (36–40)

36. **B** — TT = you; Fail-safe = Support after TT.  
37. **B** — Clone storage grows on divergence.  
38. **B** — Share = live access, not a copy.  
39. **B** — Consumer pays warehouse credits.  
40. **A** — Reader account = provider-managed consumer account.

## Weak-spot → labs

| Misses | Go to |
|--------|--------|
| Q1–12 | Labs 01–05 + `EXAM_BLUEPRINT.md` Domain 1 |
| Q13–20 | Labs 06–09 |
| Q21–27 | Labs 10–12 |
| Q28–35 | Labs 13–15 |
| Q36–40 | Labs 16–18 |

Night before: `EXAM_DAY_PLAYBOOK.md`.
