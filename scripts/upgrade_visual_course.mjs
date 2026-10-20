/**
 * Visual + exam-tip upgrade for DMart SnowPro Core labs.
 * - Wire BEFORE/AFTER JPGs when present
 * - Inject sticky exam tips after solution / mid-lab / before drills
 * - Add visual “picture first” banner
 * Run: node scripts/upgrade_visual_course.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docs = path.join(__dirname, "..", "docs");
const assets = path.join(docs, "assets");

const EXAM_TIPS = {
  "00": [
    { where: "after-solution", tip: "Exam trap", body: "Creating a role does <strong>not</strong> assign it to you. Always <code>GRANT ROLE … TO USER</code> (Lab 00 Step 1b) before <code>USE ROLE</code>." },
    { where: "before-drill", tip: "Say this", body: "Database = building · Schema = room · Warehouse = engine (compute only)." },
  ],
  "01": [
    { where: "after-solution", tip: "Highest weight", body: "Architecture is ~<strong>31%</strong> of COF-C03. If you only deep-study one domain, make it Labs 01–05." },
    { where: "mid", tip: "Instant fail", body: "“Warehouse stores table data” is always <strong>false</strong>. Storage holds micro-partitions; WH burns credits." },
    { where: "before-drill", tip: "Edition trap", body: "90-day Time Travel → <strong>Enterprise+</strong>. Don’t pick Business Critical only for longer Time Travel." },
  ],
  "02": [
    { where: "after-solution", tip: "Object zoo", body: "On the exam: stage = file folder, table = rows, view = saved SELECT, pipe ≠ stream ≠ task." },
    { where: "before-drill", tip: "MV vs view", body: "Normal views don’t store results. Materialized views do (cost/refresh tradeoff)." },
  ],
  "03": [
    { where: "after-solution", tip: "Say pruning", body: "Snowflake skips micro-partitions using min/max metadata. Say <strong>pruning</strong>, not “index seek.”" },
    { where: "before-drill", tip: "When NOT to cluster", body: "Tiny tables or ever-changing filters — clustering isn’t free." },
  ],
  "04": [
    { where: "after-solution", tip: "Fail-safe rule", body: "Permanent = Fail-safe. Transient/temp = <strong>no</strong> Fail-safe. Memorize cold." },
    { where: "before-drill", tip: "C03 words", body: "Iceberg = open table format. Dynamic Table = declarative pipeline with target lag." },
  ],
  "05": [
    { where: "after-solution", tip: "C03 Architecture", body: "Cortex / Snowpark / Streamlit are definitions questions — one sentence each is enough." },
    { where: "before-drill", tip: "Snowpark ≠ Spark", body: "Snowpark runs code <em>in</em> Snowflake compute. Spark connector moves data to/from Spark." },
  ],
  "06": [
    { where: "after-solution", tip: "Grant chain", body: "Privileges → Access roles (AR_) → Functional roles (FR_) → Users. Don’t grant tables straight to people." },
    { where: "mid", tip: "Snowsight lie", body: "Proofs need <code>USE SECONDARY ROLES NONE</code> or FR_ANALYST still has lab-admin powers." },
    { where: "before-drill", tip: "Ownership", body: "Owner can grant. Creating an object ≠ everyone can use it." },
  ],
  "07": [
    { where: "after-solution", tip: "Auth map", body: "MFA ≠ SSO. Key-pair = services. Network policy = IP gate (not table privileges)." },
    { where: "before-drill", tip: "Trust Center", body: "C03: Trust Center = security posture visibility — know it exists." },
  ],
  "08": [
    { where: "after-solution", tip: "Don’t mix", body: "<strong>Masking</strong> = disguise a column. <strong>RAP</strong> = hide whole rows. Same table, two stickers." },
    { where: "before-drill", tip: "CURRENT_ROLE()", body: "Policies key off primary role. Secondary roles can still open the table — clear them for proofs." },
  ],
  "09": [
    { where: "after-solution", tip: "Two guards", body: "Auto-suspend stops idle burn. Resource monitors stop runaway quotas. You need both stories." },
    { where: "before-drill", tip: "ACCOUNT_USAGE lag", body: "Metering views can lag tens of minutes–hours. Don’t panic if today’s query isn’t there yet." },
  ],
  "10": [
    { where: "after-solution", tip: "Load recipe", body: "Stage + file format + <code>COPY INTO</code>. Classic COPY uses a <strong>warehouse</strong>." },
    { where: "before-drill", tip: "ON_ERROR", body: "Know ABORT_STATEMENT / CONTINUE / SKIP_FILE and VALIDATION_MODE (test without loading)." },
  ],
  "11": [
    { where: "after-solution", tip: "Billing trap", body: "Snowpipe = serverless credits. Don’t say “resize the warehouse to speed Snowpipe.”" },
    { where: "before-drill", tip: "Streaming ≠ AUTO_INGEST", body: "Snowpipe Streaming = row/SDK path. Classic pipe = files + COPY + optional AUTO_INGEST." },
  ],
  "12": [
    { where: "after-solution", tip: "Three animals", body: "Stream = change feed. Task = schedule. Dynamic Table = declarative SELECT + lag." },
    { where: "before-drill", tip: "Pick one", body: "Exam loves “which tool?” — match the problem shape, don’t mash them together." },
  ],
  "13": [
    { where: "after-solution", tip: "Profile first", body: "Open Query Profile before resizing. Bigger WH won’t fix a full scan that pruning could skip." },
    { where: "mid", tip: "Three caches", body: "Result cache · local WH disk cache · metadata cache. Result cache hit → no WH credits." },
    { where: "before-drill", tip: "QAS", body: "Query Acceleration Service = optional boost for eligible scans — awareness for C03." },
  ],
  "14": [
    { where: "after-solution", tip: "Up vs out", body: "<strong>Scale up</strong> = bigger size (harder queries). <strong>Scale out</strong> = more clusters (concurrency)." },
    { where: "before-drill", tip: "MCW", body: "Multi-cluster warehouses are an Enterprise+ concurrency tool — not the default for single heavy SQL." },
  ],
  "15": [
    { where: "after-solution", tip: "QUALIFY", body: "Filter window results with QUALIFY — not WHERE." },
    { where: "before-drill", tip: "VARIANT", body: "JSON lives in VARIANT; path with <code>:</code>; explode arrays with FLATTEN." },
  ],
  "16": [
    { where: "after-solution", tip: "TT ≠ Fail-safe", body: "Time Travel = you recover (AT/BEFORE/UNDROP). Fail-safe = Snowflake Support only, after TT." },
    { where: "before-drill", tip: "Windows", body: "Standard ~1-day TT. Enterprise up to 90. Fail-safe = 7 days on permanent." },
  ],
  "17": [
    { where: "after-solution", tip: "Zero-copy", body: "Clone shares micro-partitions until someone changes data (then storage grows)." },
    { where: "before-drill", tip: "Clone ≠ share ≠ replicate", body: "Clone = in-account twin. Share = live access to others. Replicate = DR across region/account." },
  ],
  "18": [
    { where: "after-solution", tip: "Live not CSV", body: "Secure share = live query access. Provider shares data; consumer typically pays their compute." },
    { where: "before-drill", tip: "C03 collab", body: "Reader accounts · Marketplace listings · Native Apps · Clean Rooms — one-line each." },
  ],
  "19": [
    { where: "after-solution", tip: "Booking gate", body: "Don’t pay Pearson until ≥<strong>32/40</strong> here twice, then do Lab 19b (100Q) if available." },
    { where: "before-drill", tip: "Timing", body: "Real exam ~1 minute/question. Flag and move — don’t bleed 5 minutes on one stem." },
  ],
};

const BA_CAPTIONS = {
  "00": ["No DMart home — files and tables everywhere.", "One building DMART + WH_CORE_XS + lab-admin badge."],
  "01": ["Myth: warehouse stores tables.", "Truth: Storage · Compute · Cloud Services."],
  "02": ["Name soup — stage ≈ table?", "Named toolbox — stage = files, table = rows."],
  "03": ["Full scans forever.", "Pruning skips useless micro-partitions."],
  "04": ["Everything permanent.", "Right table type — transient has no Fail-safe."],
  "05": ["Buzzword fog.", "Snowsight · drivers · Cortex · Snowpark."],
  "06": ["Vault open — analysts see SSN/email.", "Badges + key-rings — vault locked, safe window."],
  "07": ["Shared passwords / open IPs.", "MFA · SSO · key-pair · network policy."],
  "08": ["Same SELECT leaks email + all countries.", "Masking + RAP — different views per role."],
  "09": ["Surprise credit bill.", "Auto-suspend + resource monitor."],
  "10": ["Humans babysit overnight COPY.", "Stage + file format + COPY INTO."],
  "11": ["Manual COPY loop.", "Snowpipe (+ Streaming ≠ AUTO_INGEST)."],
  "12": ["Manual handoffs.", "Stream · Task · Dynamic Table."],
  "13": ["Full scan burns credits.", "Profile → prune → cache before resize."],
  "14": ["One size forever / queues.", "Scale up vs scale out."],
  "15": ["JSON fear / nested mess.", "VARIANT · QUALIFY · FLATTEN."],
  "16": ["Bad DELETE panic.", "Time Travel / UNDROP (Fail-safe is Support-only)."],
  "17": ["CSV export for QA.", "Zero-copy clone · replicate for DR."],
  "18": ["Email the dump.", "Secure share · Marketplace · clean rooms."],
  "19": ["Labs done ≠ exam ready.", "Timed mock · weak-spot map · then book."],
};

function examTipHtml(tip, body) {
  return `
    <aside class="exam-tip" aria-label="Exam tip">
      <div class="exam-tip-badge">EXAM TIP</div>
      <div class="exam-tip-body"><strong>${tip}.</strong> ${body}</div>
    </aside>`;
}

function baSrc(id, kind) {
  const jpg = `lab${id}-${kind}.jpg`;
  const svg = `lab${id}-${kind}.svg`;
  if (fs.existsSync(path.join(assets, jpg))) return `assets/${jpg}`;
  if (fs.existsSync(path.join(assets, svg))) return `assets/${svg}`;
  return null;
}

function baHtml(id, captions) {
  const before = baSrc(id, "before");
  const after = baSrc(id, "after");
  if (!before || !after) return null;
  return `
    <div class="ba-grid">
      <figure class="ba-panel before">
        <img src="${before}" alt="BEFORE: ${captions[0]}" width="1600" height="900" loading="eager" />
        <figcaption><strong>Before</strong> ${captions[0]}</figcaption>
      </figure>
      <figure class="ba-panel after">
        <img src="${after}" alt="AFTER: ${captions[1]}" width="1600" height="900" loading="eager" />
        <figcaption><strong>After</strong> ${captions[1]}</figcaption>
      </figure>
    </div>`;
}

function pictureFirstBanner(id) {
  return `
    <div class="picture-first" aria-label="How to study this lab">
      <span class="pf-icon" aria-hidden="true">1</span>
      <p><strong>Picture first.</strong> Look at BEFORE/AFTER → read the comic → then run tiny SQL.
      If a paragraph feels heavy, skip to the next comic strip — Dev explains it out loud for you.</p>
    </div>`;
}

function processLab(id) {
  const file = path.join(docs, `lab-${id}.html`);
  if (!fs.existsSync(file)) return { id, skipped: true };
  let html = fs.readFileSync(file, "utf8");
  let changed = false;

  // Mark upgraded once
  if (!html.includes('data-visual-upgrade="1"')) {
    html = html.replace("<body>", '<body data-visual-upgrade="1">');
    changed = true;
  }

  // Picture-first banner after lede
  if (!html.includes('class="picture-first"')) {
    html = html.replace(
      /(<p class="lede">[\s\S]*?<\/p>)/,
      `$1\n${pictureFirstBanner(id)}`
    );
    changed = true;
  }

  // Replace ba-diagram grid with real images when available
  const caps = BA_CAPTIONS[id];
  const ba = caps ? baHtml(id, caps) : null;
  if (ba && html.includes("ba-diagram")) {
    html = html.replace(
      /<div class="ba-grid">[\s\S]*?<\/div>\s*(?=<section class="comic-strip|<section class="teach|<aside class="exam-tip)/,
      ba + "\n"
    );
    changed = true;
  } else if (ba && !html.includes(`lab${id}-before.jpg`)) {
    // Insert after callout ok if no ba-grid
    if (html.includes('class="callout ok"') && !html.includes("ba-grid")) {
      html = html.replace(
        /(<\/div>\s*)(<section class="comic-strip)/,
        `$1${ba}\n$2`
      );
      changed = true;
    }
  }

  // Lab 01 layers viz
  if (id === "01" && fs.existsSync(path.join(assets, "lab01-layers.jpg")) && !html.includes("lab01-layers.jpg")) {
    const viz = `
    <figure class="viz-panel">
      <img src="assets/lab01-layers.jpg" alt="Three Snowflake layers: Storage, Compute, Cloud Services" width="1600" height="900" loading="lazy" />
      <figcaption><strong>Picture · The sandwich</strong> Storage pantry · Compute kitchen · Cloud Services front desk.</figcaption>
    </figure>`;
    html = html.replace(
      /(<section class="teach">\s*<h2>See it)/,
      `${viz}\n\n    $1`
    );
    changed = true;
  }

  // Exam tips
  const tips = EXAM_TIPS[id] || [];
  for (const t of tips) {
    const marker = `data-exam-tip="${id}-${t.where}"`;
    if (html.includes(marker)) continue;
    const block = examTipHtml(t.tip, t.body).replace(
      'class="exam-tip"',
      `class="exam-tip" ${marker}`
    );
    if (t.where === "after-solution") {
      // after first callout ok closing + optional ba
      const re = /(<div class="callout ok">[\s\S]*?<\/div>)/;
      if (re.test(html)) {
        html = html.replace(re, `$1\n${block}`);
        changed = true;
      }
    } else if (t.where === "mid") {
      // before first article.step
      if (html.includes('<article class="step">')) {
        html = html.replace(
          '<article class="step">',
          `${block}\n\n    <article class="step">`
        );
        changed = true;
      }
    } else if (t.where === "before-drill") {
      if (html.includes('id="interview-drill"')) {
        html = html.replace(
          /(<section[^>]*id="interview-drill"[^>]*>)/,
          `${block}\n\n    $1`
        );
        changed = true;
      }
    }
  }

  // Link flash + 19b on lab 19
  if (id === "19" && !html.includes("lab-19b.html")) {
    const next = `
    <div class="callout tip">
      <strong>Max your pass odds</strong>
      After ≥32/40 here twice → <a href="lab-19b.html">Lab 19b full 100-question mock</a> ·
      <a href="flashcards.html">Trap flashcards</a> ·
      <a href="DISTRACTOR_BANK.md">Wrong-answer autopsy</a>.
    </div>`;
    html = html.replace(
      /(<div class="pager">)/,
      `${next}\n\n    $1`
    );
    changed = true;
  }

  if (changed) fs.writeFileSync(file, html, "utf8");
  return { id, changed };
}

const results = [];
for (let i = 0; i <= 19; i++) {
  results.push(processLab(String(i).padStart(2, "0")));
}
console.log(results.filter((r) => r.changed).map((r) => r.id).join(", ") || "none changed");
console.log("done", results.length);
