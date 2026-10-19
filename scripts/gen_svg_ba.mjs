/** Generate simple SVG BEFORE/AFTER art for labs missing JPGs. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(__dirname, "..", "docs", "assets");

const scenes = {
  "02": {
    before: ["Name soup", "Stage ≈ table?", "Pipe = stream?"],
    after: ["Named toolbox", "Stage = files", "Table = rows"],
  },
  "03": {
    before: ["Full scans", "Every box read", "Credits on fire"],
    after: ["Pruning", "Skip useless boxes", "Cluster by date"],
  },
  "04": {
    before: ["All permanent", "Fail-safe on junk", "Iceberg = ???"],
    after: ["Right table type", "Transient = no FS", "Iceberg + DT known"],
  },
  "05": {
    before: ["Buzzword fog", "Snowpark = Spark?", "Cortex = ???"],
    after: ["Clear doors", "Snowsight / drivers", "Cortex = AI in SF"],
  },
  "07": {
    before: ["Shared password", "Anyone from anywhere", "No MFA"],
    after: ["MFA + SSO", "Key-pair for CI", "Network policy"],
  },
  "09": {
    before: ["Surprise bill", "Large WH left on", "No monitor"],
    after: ["Auto-suspend", "Resource monitor", "ACCOUNT_USAGE"],
  },
  "11": {
    before: ["Human COPY loop", "Files wait overnight", "Missed landings"],
    after: ["Snowpipe", "AUTO_INGEST story", "Streaming ≠ pipe"],
  },
  "12": {
    before: ["Manual handoffs", "When did rows change?", "No schedule"],
    after: ["Stream CDC", "Task schedule", "Dynamic Table"],
  },
  "14": {
    before: ["One size forever", "Queue of analysts", "Guess resize"],
    after: ["Scale up vs out", "MCW for concurrency", "Back to XS"],
  },
  "15": {
    before: ["JSON fear", "Nested subquery mess", "Flatten in Python?"],
    after: ["VARIANT paths", "QUALIFY windows", "FLATTEN in SQL"],
  },
  "17": {
    before: ["Export CSV for QA", "Terabyte copy fear", "DR = ???"],
    after: ["Zero-copy clone", "Pay on divergence", "Replicate = DR"],
  },
  "18": {
    before: ["Email the dump", "Stale partner file", "Can't revoke"],
    after: ["Secure share", "Live curated view", "Marketplace / clean rooms"],
  },
  "19": {
    before: ["Labs done = ready?", "No timed practice", "Hope-based booking"],
    after: ["Scored mock", "Weak-spot map", "Book after 80%"],
  },
};

function svg(kind, title, bullets) {
  const color = kind === "before" ? "#c23d4a" : "#1b7d56";
  const y0 = 120;
  const items = bullets
    .map(
      (b, i) =>
        `<text x="80" y="${y0 + i * 70}" font-size="36" fill="#1a2433" font-family="Segoe UI, Arial">• ${escapeXml(b)}</text>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f3f6f9"/>
      <stop offset="100%" stop-color="#e9eef4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <rect x="40" y="40" width="1520" height="820" rx="28" fill="#fff" stroke="#d0dae6" stroke-width="4"/>
  <rect x="40" y="40" width="24" height="820" fill="${color}"/>
  <text x="90" y="110" font-size="28" font-weight="700" fill="#5a6b7d" font-family="Segoe UI, Arial" letter-spacing="4">${kind.toUpperCase()}</text>
  <text x="90" y="175" font-size="48" font-weight="700" fill="#1a2433" font-family="Segoe UI, Arial">${escapeXml(title)}</text>
  ${items}
  <text x="90" y="820" font-size="24" fill="#176f9e" font-family="Segoe UI, Arial">Alpine Retail · SnowPro Core comic board</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

for (const [id, sc] of Object.entries(scenes)) {
  for (const kind of ["before", "after"]) {
    const jpg = path.join(assets, `lab${id}-${kind}.jpg`);
    const out = path.join(assets, `lab${id}-${kind}.svg`);
    if (fs.existsSync(jpg)) {
      console.log("skip (jpg exists)", path.basename(jpg));
      continue;
    }
    const title = sc[kind][0];
    const bullets = sc[kind];
    fs.writeFileSync(out, svg(kind, title, bullets), "utf8");
    console.log("wrote", path.basename(out));
  }
}
