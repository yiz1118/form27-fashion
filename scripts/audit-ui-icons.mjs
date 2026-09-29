import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const excluded = new Set(["node_modules", ".next", ".git", "artifacts", "playwright-report", "test-results"]);
const symbols = /[\u2197\u2192\u27a1\u2190\u2b05\u2193\u2b07\u2191+\u2212\u2013\u00d7\u2715\u2716\u2630\u2637\u22ef\u2026\u2713\u2714\u2605\u2665\u2661\u2304\u2303\ufe0e\ufe0f]/gu;
const hits = [];
const files = [];
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { if (!excluded.has(entry.name)) await visit(file); }
    else if (/\.(?:[jt]sx?|html|css|scss|mjs)$/.test(file)) {
      files.push(file);
      const source = await readFile(file, "utf8");
      for (const [index, line] of source.split(/\r?\n/).entries()) {
        for (const match of line.matchAll(symbols)) hits.push({ file: file.replaceAll("\\", "/"), line: index + 1, symbol: match[0], codePoint: `U+${match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`, context: line.slice(Math.max(0, match.index - 45), match.index + 65) });
      }
    }
  }
}
await visit(".");
const report = { filesScanned: files.length, files, hits, variationSelectors: hits.filter(hit => /U\+FE0[EF]/.test(hit.codePoint)), arrowHits: hits.filter(hit => /[\u2197\u2192\u27a1\u2190\u2b05\u2193\u2b07\u2191]/u.test(hit.symbol)) };
const phase = process.argv[2] || "after";
await mkdir("artifacts/icon-review", { recursive: true });
await writeFile(`artifacts/icon-review/audit-${phase}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ filesScanned: report.filesScanned, arrowHits: report.arrowHits, variationSelectors: report.variationSelectors, otherHits: hits.length - report.arrowHits.length }, null, 2));
