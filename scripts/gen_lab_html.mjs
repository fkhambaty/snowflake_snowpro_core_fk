/**
 * Generates a full teaching lab HTML page for Alpine Retail SnowPro Core.
 * Usage: node scripts/gen_lab_html.mjs
 * Edits LAB_DEFS below, then re-run for missing labs only (skips existing unless --force).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docs = path.join(__dirname, "..", "docs");
const force = process.argv.includes("--force");

function nav(active) {
  const links = [];
  for (let i = 0; i <= 19; i++) {
    const id = String(i).padStart(2, "0");
    const cls = i === active ? ' class="active"' : "";
    links.push(`        <a${cls} href="lab-${id}.html">${id}</a>`);
  }
  return links.join("\n");
}

function drills(items) {
  return items
    .map(
      ([q, a], i) => `      <details class="drill">
        <summary><strong>Q${i + 1}.</strong> ${q}</summary>
        <p class="drill-say"><strong>Say:</strong> ${a}</p>
      </details>`
    )
    .join("\n");
}

function steps(list) {
  return list
    .map((s, idx) => {
      const n = idx + 1;
      const comic = s.comic
        ? `
    <section class="comic-strip comic-step" aria-label="Step ${n} coach">
      <p class="comic-kicker">Before Step ${n}</p>
      <h2 class="comic-title">${s.comic.title}</h2>
      <div class="comic-row two">
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face ${s.comic.askFace}" role="img" aria-label="${s.comic.askName}"></div>
            <div><span class="comic-name">${s.comic.askName}</span><span class="comic-role">${s.comic.askRole}</span></div>
          </div>
          <blockquote class="comic-bubble">${s.comic.ask}</blockquote>
        </figure>
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face dev" role="img" aria-label="Dev"></div>
            <div><span class="comic-name">Dev</span><span class="comic-role">Coach</span></div>
          </div>
          <blockquote class="comic-bubble">${s.comic.ans}</blockquote>
        </figure>
      </div>
    </section>`
        : "";
      return `${comic}
    <article class="step">
      <h2><span class="step-num">${n}</span> ${s.title}</h2>
      <p class="teach"><strong>What this does:</strong> ${s.what}</p>
      <div class="code-block">
        <div class="code-head"><span>SQL · ${s.label || "chunk"}</span><button type="button" class="copy-btn">Copy</button></div>
<pre><code>${s.sql}</code></pre>
      </div>
      <div class="badge-ok">✓ ${s.see}</div>
    </article>`;
    })
    .join("\n");
}

function seeCards(cards) {
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) {
    const pair = cards.slice(i, i + 2);
    const inner = pair
      .map(
        (c) => `        <div class="see-card">
          <div class="see-label">${c.label}</div>
          <strong>${c.title}</strong>
          <p>${c.body}</p>
          <div class="see-example">${c.ex}</div>
        </div>`
      )
      .join("\n");
    rows.push(`      <div class="see-grid two"${i ? ' style="margin-top:0.85rem"' : ""}>\n${inner}\n      </div>`);
  }
  return rows.join("\n");
}

function render(lab) {
  const id = String(lab.n).padStart(2, "0");
  const prev = lab.n === 0 ? "story.html" : `lab-${String(lab.n - 1).padStart(2, "0")}.html`;
  const next =
    lab.n === 19 ? "index.html" : `lab-${String(lab.n + 1).padStart(2, "0")}.html`;
  const prevLabel = lab.n === 0 ? "← Story" : `← Lab ${String(lab.n - 1).padStart(2, "0")}`;
  const nextLabel =
    lab.n === 19 ? "Home →" : `Lab ${String(lab.n + 1).padStart(2, "0")} — ${lab.nextTitle} →`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lab ${id} — ${lab.title}</title>
  <link rel="stylesheet" href="assets/course.css" />
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="index.html">SnowPro <span>Core</span> Prep</a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="story.html">Story</a>
${nav(lab.n)}
      </nav>
    </div>
  </header>

  <div class="wrap">
    <p class="eyebrow">Lab ${id} · ${lab.eyebrow} · You are Priya</p>
    <h1>${lab.h1}</h1>
    <p class="lede">${lab.lede}</p>

    <div class="callout bad">
      <strong>Business problem</strong>
      ${lab.problem}
    </div>

    <div class="callout ok">
      <strong>Solution you will build</strong>
      ${lab.solution}
    </div>

    <div class="ba-grid">
      <div class="ba-diagram before">
        <div class="ba-kicker">Before</div>
        <strong>${lab.before.title}</strong>
        <ul>
${lab.before.bullets.map((b) => `          <li>${b}</li>`).join("\n")}
        </ul>
      </div>
      <div class="ba-diagram after">
        <div class="ba-kicker">After</div>
        <strong>${lab.after.title}</strong>
        <ul>
${lab.after.bullets.map((b) => `          <li>${b}</li>`).join("\n")}
        </ul>
      </div>
    </div>

    <section class="comic-strip" aria-label="Opener">
      <p class="comic-kicker">Episode ${id}</p>
      <h2 class="comic-title">${lab.openComic.title}</h2>
      <div class="comic-row two">
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face ${lab.openComic.askFace}" role="img" aria-label="${lab.openComic.askName}"></div>
            <div><span class="comic-name">${lab.openComic.askName}</span><span class="comic-role">${lab.openComic.askRole}</span></div>
          </div>
          <blockquote class="comic-bubble">${lab.openComic.ask}</blockquote>
        </figure>
        <figure class="comic-panel">
          <div class="comic-who">
            <div class="comic-face dev" role="img" aria-label="Dev"></div>
            <div><span class="comic-name">Dev</span><span class="comic-role">Coach — explains why</span></div>
          </div>
          <blockquote class="comic-bubble">${lab.openComic.ans}</blockquote>
        </figure>
      </div>
      <p class="comic-caption">${lab.openComic.caption}</p>
    </section>

    <section class="teach">
      <h2>See it — don’t memorize definitions</h2>
${seeCards(lab.see)}
    </section>
${lab.extraHtml || ""}
${steps(lab.steps)}

    <section class="teach drill-wrap" id="interview-drill" aria-label="Exam presses further">
      <h2>Exam presses further — say these out loud</h2>
      <p>Cover each answer <em>before</em> you open it. These are Core traps.</p>
${drills(lab.drills)}
    </section>

    <div class="soundbite">
      <strong>Priya’s wrap-up (say this out loud)</strong><br />
      ${lab.wrap}
    </div>

    <div class="pager">
      <a class="btn ghost" href="${prev}">${prevLabel}</a>
      <a class="btn primary" href="${next}">${nextLabel}</a>
    </div>
  </div>
  <footer class="footer">Source SQL: ${lab.sqlFile || `sql/${id}_*.sql`}</footer>
  <script src="assets/course.js"></script>
</body>
</html>
`;
}

/** Lab definitions for missing numbers — keep teach-first + exam traps */
const LAB_DEFS = [
  {
    n: 2,
    title: "Object catalog",
    eyebrow: "Architecture",
    h1: "Name every object the exam throws at you",
    lede: "Snowflake is a zoo of object types. Today you <em>create</em> the common ones so the names stick — table, view, sequence, file format, stage.",
    problem: "Kai hears “stage,” “pipe,” “stream,” “task,” “share” and mixes them into one blob. Morgan: “If she can’t name objects, she fails Domain 1.”",
    solution: "A living catalog in <code>LAB</code>: <code>PRODUCTS</code> table, cheap products view, sequence, CSV file format, internal stage — plus a mental map of pipes/streams/tasks/shares for later labs.",
    before: { title: "Name soup", bullets: ["Stage ≈ table?", "View stores rows?", "No idea what’s account-level"] },
    after: { title: "Named toolbox", bullets: ["Table stores; view computes", "Stage = file folder", "Pipe/stream/task/share = later labs"] },
    openComic: {
      title: "Kai: “Is a stage a table?”",
      askFace: "kai",
      askName: "Kai",
      askRole: "Analyst",
      ask: "Someone said put files on a stage. Is that like a staging table?",
      ans: "Different animal. A <strong>stage</strong> is a file folder (internal or cloud). A <strong>table</strong> holds rows. We COPY from stage → table.",
      caption: "Stage = files. Table = rows. Say it until it’s boring.",
    },
    see: [
      { label: "Rows", title: "Table", body: "Stores data in micro-partitions.", ex: "<code>LAB.PRODUCTS</code>" },
      { label: "Saved SELECT", title: "View", body: "Runs the query when you select — doesn’t store the result (unless materialized).", ex: "<code>V_PRODUCTS_CHEAP</code>" },
      { label: "Counter", title: "Sequence", body: "Hands out unique numbers.", ex: "<code>SEQ_ORDER_ID.NEXTVAL</code>" },
      { label: "Files", title: "Stage + file format", body: "Folder + recipe for parsing CSV/JSON.", ex: "<code>STG_INBOUND</code> + <code>FF_CSV_STD</code>" },
    ],
    nextTitle: "micro-partitions",
    sqlFile: "sql/02_objects.sql",
    steps: [
      {
        title: "Create a practice table + view",
        what: "Table stores products; view filters cheap ones without copying data.",
        label: "table + view",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE PRODUCTS (
  PRODUCT_ID NUMBER, SKU STRING, NAME STRING, UNIT_PRICE NUMBER(10,2)
);
INSERT INTO PRODUCTS VALUES
  (1, 'ALP-TEE', 'Alpine Tee', 29.00),
  (2, 'ALP-HAT', 'Trail Hat', 19.50);

CREATE OR REPLACE VIEW V_PRODUCTS_CHEAP AS
SELECT * FROM PRODUCTS WHERE UNIT_PRICE < 25;

SELECT * FROM V_PRODUCTS_CHEAP;`,
        see: "One cheap hat row from the view",
        comic: {
          title: "View vs table",
          askFace: "kai",
          askName: "Kai",
          askRole: "Analyst",
          ask: "If I insert into the view, where does it go?",
          ans: "Simple views often map to base tables — but start by treating views as read windows. Materialized views are different (stored + refreshed).",
        },
      },
      {
        title: "Sequence + file format + stage",
        what: "Three objects you’ll see on loading questions.",
        label: "sequence / format / stage",
        sql: `CREATE OR REPLACE SEQUENCE SEQ_ORDER_ID START = 1000 INCREMENT = 1;
SELECT SEQ_ORDER_ID.NEXTVAL;

CREATE OR REPLACE FILE FORMAT FF_CSV_STD
  TYPE = CSV FIELD_DELIMITER = ',' SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"';

CREATE OR REPLACE STAGE STG_INBOUND FILE_FORMAT = FF_CSV_STD;
SHOW STAGES IN SCHEMA LAB;`,
        see: "Stage STG_INBOUND listed in LAB",
      },
    ],
    drills: [
      ["Does a normal view store query results?", "No. It stores the SELECT definition. Materialized views store precomputed results and have refresh/cost tradeoffs."],
      ["User stage vs named stage vs external stage?", "User/table stages are implicit; named internal stages are schema objects you CREATE; external stages point at S3/Blob/GCS."],
      ["Is a warehouse an object you SHOW?", "Yes — account-level compute object. Databases/schemas/tables hang under the catalog hierarchy."],
      ["Pipe vs stream vs task — one line each?", "Pipe auto-loads files; stream tracks row changes; task schedules SQL. Don’t mix them."],
      ["Where do shares live conceptually?", "Secure Data Sharing objects that grant live access to other accounts — not a file dump. Lab 18."],
    ],
    wrap: "“I stopped treating Snowflake as one blob. Tables store rows; views save SELECTs; sequences mint IDs; file formats + stages prepare loading. Pipes, streams, tasks, and shares are different tools for later labs. <em>Outcome:</em> I can decode Domain 1 object questions.”",
  },
  {
    n: 3,
    title: "Micro-partitions",
    eyebrow: "Architecture / storage",
    h1: "Micro-partitions &amp; pruning (why filters get cheap)",
    lede: "Snowflake doesn’t use classic indexes like Oracle. It stores data in compressed <strong>micro-partitions</strong> and skips ones that can’t match your filter — that’s <strong>pruning</strong>.",
    problem: "Riley’s history table scan costs a fortune. Kai wants “an index.” Morgan wants the bill down without guessing.",
    solution: "Understand micro-partitions + when a clustering key helps pruning. Create <code>LAB.ORDER_HISTORY</code> clustered by order date and talk through <code>SYSTEM$CLUSTERING_INFORMATION</code>.",
    before: { title: "Full scans forever", bullets: ["Every query reads everything", "No mental model for pruning", "Clustering = magic index?"] },
    after: { title: "Prune then scan", bullets: ["Filter on cluster-ish columns", "Skip irrelevant micro-partitions", "Know when NOT to cluster"] },
    openComic: {
      title: "Kai wants an index",
      askFace: "kai",
      askName: "Kai",
      askRole: "Analyst",
      ask: "Can we create a B-tree index on ORDER_DATE like MySQL?",
      ans: "Not the Snowflake way. Data lands in micro-partitions with min/max metadata. Good filters + optional clustering = pruning. Say “pruning,” not “index seek.”",
      caption: "Pruning skips files of rows. Clustering keeps related values co-located.",
    },
    see: [
      { label: "Chunk", title: "Micro-partition", body: "Immutable compressed column files (~50–500MB uncompressed typical teaching range).", ex: "Min/max per column stored in metadata" },
      { label: "Skip", title: "Pruning", body: "Optimizer skips partitions whose min/max can’t match the WHERE.", ex: "WHERE order_date = '2026-01-01'" },
      { label: "Hint", title: "Clustering key", body: "Tells Snowflake how to co-locate data for common filters.", ex: "<code>CLUSTER BY (ORDER_DATE)</code>" },
      { label: "Cost", title: "When NOT to", body: "Tiny tables / ever-changing filters / already well-pruned natural order.", ex: "Clustering isn’t free" },
    ],
    nextTitle: "table types",
    sqlFile: "sql/03_micropartitions.sql",
    steps: [
      {
        title: "Build a dated fact table",
        what: "Rows across dates so pruning has something to do.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE ORDER_HISTORY (
  ORDER_ID NUMBER,
  ORDER_DATE DATE,
  AMOUNT NUMBER(10,2)
);
INSERT INTO ORDER_HISTORY
SELECT SEQ_ORDER_ID.NEXTVAL, DATEADD(day, -SEQ4(), CURRENT_DATE()), UNIFORM(10,500,RANDOM())
FROM TABLE(GENERATOR(ROWCOUNT => 200));

SELECT MIN(ORDER_DATE), MAX(ORDER_DATE), COUNT(*) FROM ORDER_HISTORY;`,
        see: "200 rows across many dates",
        comic: {
          title: "Why dates matter",
          askFace: "riley",
          askName: "Riley",
          askRole: "Engineer",
          ask: "Any filter prunes?",
          ans: "Filters on columns with useful min/max locality prune best. Random high-cardinality noise columns prune poorly.",
        },
      },
      {
        title: "Add clustering + inspect",
        what: "Cluster by ORDER_DATE; inspect clustering depth information.",
        sql: `ALTER TABLE ORDER_HISTORY CLUSTER BY (ORDER_DATE);

SELECT SYSTEM$CLUSTERING_INFORMATION('LAB.ORDER_HISTORY');
-- In Snowsight Query Profile: compare a selective date filter vs SELECT *`,
        see: "JSON clustering info returned (depth / overlap metrics)",
      },
    ],
    drills: [
      ["What is pruning?", "Skipping micro-partitions whose metadata proves they can’t contain matching rows for the filter."],
      ["When should you NOT add a clustering key?", "Small tables, filters that change weekly, or tables already naturally ordered well enough — clustering costs credits to maintain."],
      ["Is clustering the same as an index?", "No. It’s co-locating related values in micro-partitions to improve pruning, not a separate B-tree structure you maintain like classic RDBMS indexes."],
      ["Who stores micro-partition metadata?", "Cloud Services metadata — used by the optimizer before compute reads storage."],
      ["Does a bigger warehouse fix bad pruning?", "It can burn credits faster on the same huge scan. Fix selectivity/clustering/query shape first (Lab 13)."],
    ],
    wrap: "“Snowflake stores data in micro-partitions with min/max metadata. Good filters prune; clustering helps when the same columns are filtered often. <em>Outcome:</em> I won’t ask for a MySQL index on the exam.”",
  },
  {
    n: 4,
    title: "Table types",
    eyebrow: "Architecture",
    h1: "Permanent, transient, temp, external, Iceberg, Dynamic",
    lede: "The exam loves “which table type?” questions. Fail-safe, Time Travel, and open formats all hide here — including <strong>Iceberg</strong> and <strong>Dynamic Tables</strong> on COF-C03.",
    problem: "Riley created everything PERMANENT “just in case.” Storage and Fail-safe costs climb. Kai asks what Iceberg even is.",
    solution: "Create tiny demos of permanent / transient / temporary tables; learn external + Iceberg + Dynamic Tables as exam vocabulary with safe SQL or commented patterns.",
    before: { title: "Everything permanent", bullets: ["Fail-safe on scratch data", "Iceberg = ???", "Dynamic table = stream?"] },
    after: { title: "Pick the right kind", bullets: ["Transient: no Fail-safe", "Temp: session-scoped", "Iceberg/DT: know the pitch"] },
    openComic: {
      title: "Morgan hates Fail-safe on junk",
      askFace: "morgan",
      askName: "Morgan",
      askRole: "Manager",
      ask: "Why are we paying Fail-safe on a throwaway load table?",
      ans: "Because it’s PERMANENT. Scratch/ETL landing often uses TRANSIENT — Time Travel shorter options, <strong>no Fail-safe</strong>.",
      caption: "Permanent = TT + Fail-safe. Transient = no Fail-safe. Temp = session.",
    },
    see: [
      { label: "Default", title: "Permanent", body: "Full Time Travel (per edition) + 7-day Fail-safe.", ex: "Prod facts" },
      { label: "Cheap", title: "Transient", body: "No Fail-safe; lower storage cost profile.", ex: "ETL staging" },
      { label: "Session", title: "Temporary", body: "Exists for the session; dropped when session ends.", ex: "Scratch math" },
      { label: "C03", title: "Iceberg / Dynamic", body: "Iceberg = open table format interop. Dynamic = declarative pipeline table with target lag.", ex: "Know definitions cold" },
    ],
    nextTitle: "interfaces + AI",
    sqlFile: "sql/04_table_types.sql",
    steps: [
      {
        title: "Permanent vs transient vs temp",
        what: "Feel the three classic types in LAB.",
        sql: `USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
USE DATABASE ALPINE_RETAIL;
USE SCHEMA LAB;

CREATE OR REPLACE TABLE T_PERM (ID INT);
CREATE OR REPLACE TRANSIENT TABLE T_TRANSIENT (ID INT);
CREATE OR REPLACE TEMPORARY TABLE T_TEMP (ID INT);
INSERT INTO T_PERM VALUES (1);
INSERT INTO T_TRANSIENT VALUES (1);
INSERT INTO T_TEMP VALUES (1);
SHOW TABLES LIKE 'T_%' IN SCHEMA LAB;`,
        see: "Kind/transient flags differ; temp may show as temporary",
        comic: {
          title: "Temp vanishes",
          askFace: "kai",
          askName: "Kai",
          askRole: "Analyst",
          ask: "I closed Snowsight and my temp table is gone?",
          ans: "Yes — temporary tables are session-scoped. That’s a feature for scratch work, not a bug.",
        },
      },
      {
        title: "Dynamic Table taste (or study the pattern)",
        what: "Declarative target-lag table — may need Enterprise features; if create fails, learn the syntax for the exam.",
        sql: `CREATE OR REPLACE TABLE PIPELINE.ORDERS_BASE AS
SELECT * FROM LAB.ORDERS;

-- If your edition allows:
CREATE OR REPLACE DYNAMIC TABLE PIPELINE.DT_ORDERS_DAILY
  TARGET_LAG = 'DOWNSTREAM'
  WAREHOUSE = WH_CORE_XS
  AS
  SELECT ORDER_TS::DATE AS D, SUM(AMOUNT_USD) AS SALES
  FROM PIPELINE.ORDERS_BASE
  GROUP BY 1;

-- Iceberg (awareness — catalog options vary):
-- CREATE ICEBERG TABLE ... CATALOG = 'SNOWFLAKE' ...`,
        see: "Either DT exists, or you can explain TARGET_LAG + warehouse on the exam",
      },
    ],
    drills: [
      ["Which types have Fail-safe?", "Permanent tables have Fail-safe. Transient and temporary do not."],
      ["External table in one sentence?", "Metadata pointing at files in external storage — query files in place; not the same as loading into a native table."],
      ["Why Iceberg on COF-C03?", "Open table format interoperability — Snowflake as Iceberg catalog/engine appears in Architecture."],
      ["Dynamic Table vs Task+Stream?", "DT is declarative (you state the SELECT + lag). Streams/tasks are imperative CDC pipelines. Both are valid; exam wants both names."],
      ["Can Time Travel recover transient data after Fail-safe?", "Trick: transient has no Fail-safe. TT retention still applies within its TT window only."],
    ],
    wrap: "“I match table type to risk: permanent for prod, transient for staged junk (no Fail-safe), temp for session scratch. Iceberg and Dynamic Tables are C03 vocabulary I can define. <em>Outcome:</em> Fail-safe questions won’t trick me.”",
  },
  {
    n: 5,
    title: "Interfaces + AI",
    eyebrow: "Architecture 1.3 / 1.6",
    h1: "Snowsight, drivers, Snowpark, Cortex, Streamlit",
    lede: "COF-C03 expanded Architecture with interfaces and AI features. You don’t need to be an ML engineer — you need crisp definitions.",
    problem: "Morgan heard “Cortex” on a webinar. Kai thinks Snowpark replaces SQL. Riley asks which client tool is “official.”",
    solution: "A map: UI (Snowsight), CLI (SnowSQL/CLI), drivers/connectors, Snowpark runtimes, Cortex AI functions, Streamlit/Notebooks in Snowflake.",
    before: { title: "Buzzword fog", bullets: ["Snowpark = Spark?", "Cortex = ChatGPT button?", "Streamlit where?"] },
    after: { title: "Clear toolbox", bullets: ["Snowsight for humans", "Drivers for apps", "Cortex = AI in Snowflake", "Snowpark = code on Snowflake compute"] },
    openComic: {
      title: "Kai fears Python",
      askFace: "kai",
      askName: "Kai",
      askRole: "Analyst",
      ask: "Do I need Snowpark to pass Core?",
      ans: "You need to <em>know what it is</em>: write Python/Java/Scala that pushes compute into Snowflake. Most Core SQL still wins. Don’t skip the definition.",
      caption: "Interfaces ≠ Architecture layers — they’re how you talk to Snowflake.",
    },
    see: [
      { label: "UI", title: "Snowsight", body: "Web UI: worksheets, Profile, dashboards.", ex: "What you’re using now" },
      { label: "CLI", title: "SnowSQL / Snowflake CLI", body: "Terminal clients for scripts and DevOps.", ex: "Automation &amp; PUT/GET" },
      { label: "Apps", title: "Drivers &amp; connectors", body: "JDBC/ODBC/Python/etc. + partner connectors (Spark, Kafka…).", ex: "BI tools connect here" },
      { label: "AI", title: "Cortex / Streamlit / Notebooks", body: "LLM SQL functions, apps, and notebooks living in the platform.", ex: "C03 Architecture weight" },
    ],
    nextTitle: "RBAC",
    sqlFile: "sql/05_interfaces_ai.sql",
    steps: [
      {
        title: "Prove you’re in Snowsight context",
        what: "Same context functions — Cloud Services answering via whatever client.",
        sql: `SELECT CURRENT_USER(), CURRENT_CLIENT(), CURRENT_VERSION();
SHOW PARAMETERS LIKE 'PYTHON_CONNECTOR%' IN SESSION;`,
        see: "User + client string returned",
        comic: {
          title: "Client string",
          askFace: "riley",
          askName: "Riley",
          askRole: "Engineer",
          ask: "Does the optimizer care if I use JDBC vs Snowsight?",
          ans: "Same engine. Clients are doors. Warehouses still do compute; services still plan.",
        },
      },
      {
        title: "Cortex awareness (may fail on some trials)",
        what: "Try a tiny Cortex call; if unsupported, still memorize the capability for the exam.",
        sql: `-- May error if Cortex not enabled — that's OK for study:
-- SELECT SNOWFLAKE.CORTEX.SENTIMENT('Alpine gear is awesome');
-- SELECT SNOWFLAKE.CORTEX.COMPLETE('snowflake-arctic', 'Define micro-partition in one sentence');

SELECT 'Study: Cortex = AI functions inside Snowflake' AS note,
       'Snowpark = Python/Java/Scala on Snowflake' AS note2,
       'Streamlit in Snowflake = apps hosted in account' AS note3;`,
        see: "You can recite Cortex / Snowpark / Streamlit in one breath each",
      },
    ],
    drills: [
      ["Snowpark vs Spark connector?", "Snowpark runs your code using Snowflake compute/security. Spark connector moves data between Spark and Snowflake — different integration shape."],
      ["Where does Streamlit in Snowflake run?", "As a Snowflake object/app in your account — not a random laptop Flask server."],
      ["Name three ways to connect", "Snowsight, SnowSQL/CLI, and programmatic drivers/connectors (JDBC, Python, etc.)."],
      ["Cortex Analyst vs COMPLETE?", "COMPLETE-style functions are general LLM SQL helpers; Cortex Analyst is geared to structured/analytical natural-language over data products — know both exist on C03."],
      ["Does AI replace knowing warehouses?", "No. Cortex still sits on the platform; Architecture fundamentals still dominate Domain 1 weight."],
    ],
    wrap: "“Interfaces are doors: Snowsight, CLI, drivers. Snowpark runs code in Snowflake; Cortex brings AI functions; Streamlit/Notebooks host apps/analysis in-platform. <em>Outcome:</em> C03 AI buzzwords have plain definitions.”",
  },
];

// More labs appended in part 2 below via same array push in this file continuation
export { LAB_DEFS, render, docs, force };

// If run directly:
const morePath = path.join(__dirname, "gen_lab_defs_more.mjs");
let all = LAB_DEFS;
if (fs.existsSync(morePath)) {
  const mod = await import("./gen_lab_defs_more.mjs");
  all = LAB_DEFS.concat(mod.MORE_LABS);
}

for (const lab of all) {
  const id = String(lab.n).padStart(2, "0");
  const out = path.join(docs, `lab-${id}.html`);
  if (fs.existsSync(out) && !force) {
    console.log("skip existing", path.basename(out));
    continue;
  }
  fs.writeFileSync(out, render(lab), "utf8");
  console.log("wrote", path.basename(out));
}
