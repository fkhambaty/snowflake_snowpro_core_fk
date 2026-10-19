# Teaching standard (every lab)

Students can copy-paste and finish without learning. **That is a fail.** Prefer **seeing** over theory tables.

This course exists so Priya **passes SnowPro Core (COF-C03)** — not so she finishes worksheets. Basics without exam follow-ups is a fail.

## Required shape (comic-book first)

1. **Picture-first banner** (`.picture-first`) — tell the student: art → comic → SQL
2. Business problem / Solution (short)
3. **EXAM TIP** stickers (`.exam-tip`) — after solution, mid-lab, and before drills
4. **BEFORE / AFTER** (`.ba-grid` + `.ba-panel` JPG/SVG) — first visual after Solution
5. Optional extra concept art (`.viz-panel` / `.flow-pipeline`)
6. **See it** cards (`.see-grid` / `.see-card`) — concrete examples, not dictionaries
7. **Comic strips** (`.comic-strip`) — opener + coach strip (`.comic-step`) before steps. Kai asks; Dev answers *why*.
8. **Small code chunks** (≤12 lines) — *what / why / what you should see*
9. **Exam presses further** (`#interview-drill`) — ≥4 hard Q&As
10. Priya wrap-up (`.soundbite`)

Pass-boost extras: `lab-19b.html` (100Q), `flashcards.html`, `DISTRACTOR_BANK.md`.

## Exam presses further (required)

After the student can run the lab, the exam (and an interviewer) will dig. Every lab must include **4–5 hard follow-ups** with spoken answers (`<details class="drill">`).

Cover at least:

- Tradeoffs / when **not** to use the feature
- Failure modes & silent bugs
- What the exam distractors usually look like
- Cost / edition / trial vs prod honesty
- “Which layer / which object?” architecture traps

## Forbidden

- Giant unexplained SQL dumps
- Long theoretical dictionaries as the main teaching device
- Jargon with no concrete before→after example
- Labs that stop at “happy path SQL” with no drill-down
- Skipping COF-C03 topics (Cortex, Iceberg, Dynamic Tables, Trust Center, Clean Rooms, Snowpipe Streaming)

## Reference labs

- Lab 01 — three layers + editions (architecture heart)
- Lab 10 — COPY / stages with tiny explained chunks
- Lab 13 — Query Profile triage
- Lab 19 — timed mock
