// Regenerate the checked-in PDF and editable text from Dan's unchanged letter.
// Usage: node scripts/build-senate-count-template.mjs (requires Chromium).
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const source = fileURLToPath(new URL("../src/data/senate-count-template.txt", import.meta.url));
const pdf = fileURLToPath(new URL("../public/forms/Senate_Manual_Count_Request_Template.pdf", import.meta.url));
const text = fileURLToPath(new URL("../public/forms/Senate_Manual_Count_Request_Template.txt", import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), "senate-count-pdf-"));
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const format = value => escape(value).replace(/\b\w+(?:-\w+)+\b/g, '<span class="nowrap">$&</span>');
const paragraphs = readFileSync(source, "utf8").trim().split("\n\n");
const body = paragraphs.map((value, index) => `<p${index === 12 ? ' class="second-page"' : ""}>${index === 0 || value.startsWith("Re:") ? `<strong>${format(value)}</strong>` : format(value)}</p>`).join("\n");
const html = join(temporary, "template.html");
writeFileSync(html, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>U.S. Senate Manual Count Request Template</title><style>
@page { size: Letter; margin: .65in .75in; }
body { margin: 0; color: #000; font: 11.5pt/1.4 "Liberation Serif", "Times New Roman", serif; }
p { margin: 0 0 11pt; orphans: 3; widows: 3; }
.second-page { break-before: page; }
.nowrap { white-space: nowrap; }
</style></head><body>${body}</body></html>`);
execFileSync(process.env.CHROMIUM_EXECUTABLE || "/usr/bin/chromium", ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-pdf-header-footer", "--export-tagged-pdf", `--user-data-dir=${join(temporary, "browser")}`, `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: "pipe", timeout: 60000 });
const normalize = value => value.replace(/\s+/g, " ").trim();
const extracted = execFileSync("pdftotext", [pdf, "-"], { encoding: "utf8" });
if (normalize(extracted) !== normalize(paragraphs.join("\n\n"))) throw new Error("PDF text differs from the supplied letter");
copyFileSync(source, text);
console.log("PDF text matches Dan’s letter. Chair notes are excluded from both downloads.");
