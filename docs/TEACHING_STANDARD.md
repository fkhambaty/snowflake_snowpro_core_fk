# Teaching standard (every lab)

Students can copy-paste and finish without learning. **That is a fail.** Prefer **seeing** over theory tables.

This course exists so Priya **passes SnowPro Core (COF-C03)** — not so she finishes worksheets. Basics without exam follow-ups is a fail.

## Required shape

1. Business problem / Solution (short)
2. **BEFORE / AFTER** (`.ba-grid` + photo *or* `.ba-diagram` panels) — first thing after Solution
3. Optional extra concept art (`.viz-panel` / `.flow-pipeline`) after see-cards
4. **See it** cards (`.see-grid` / `.see-card`) — concrete examples, not Word/Layman/Metaphor dictionaries
5. **Comic strips** (`.comic-strip`) — opener after BEFORE/AFTER **and** a coach strip (`.comic-step`) before each numbered step. Voices: Kai asks like a beginner; Dev always answers *why*; Morgan presses cost/deadline; Sam presses compliance; Riley presses pipelines. Habit: **read the coach comic → then SQL**.
6. Contrast visuals / `.flow-pipeline` when ideas get mixed up
7. **Small code chunks** (≤12 lines) — *what / why / what you should see*
8. **Exam presses further** (`.drill-wrap` / `#interview-drill`) — **required**, before wrap-up — 4–5 hard exam-style Q&As with spoken answers
9. Priya wrap-up (`.soundbite`)

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
