// Save a post's print booklet as a PDF for imposing in Bindings.
//
//   pnpm booklet <slug> [base-url]
//
// Needs the site running (`pnpm dev`, default http://localhost:3000) and
// Google Chrome. Set CHROME to use another Chromium binary.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const [slug, base = "http://localhost:3000"] = process.argv.slice(2);
if (!slug) {
  console.error("Usage: pnpm booklet <slug> [base-url]");
  process.exit(1);
}

const chrome =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = `${base.replace(/\/$/, "")}/blog/${slug}/print`;
const out = resolve("out/booklets", `${slug}.pdf`);

const res = await fetch(url).catch(() => null);
if (!res?.ok) {
  console.error(
    res
      ? `${url} returned ${res.status}. Does the post have an entry in BOOKLETS (src/lib/booklet.ts)?`
      : `Couldn't reach ${url}. Is the site running? Pass the base URL if it's not on port 3000.`,
  );
  process.exit(1);
}

mkdirSync("out/booklets", { recursive: true });
execFileSync(
  chrome,
  [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // Let fonts and full-size photos finish loading before printing.
    "--virtual-time-budget=15000",
    `--print-to-pdf=${out}`,
    url,
  ],
  { stdio: "ignore" },
);

// Count pages without a PDF library: one /Type /Page object per page.
const pages = (readFileSync(out, "latin1").match(/\/Type\s*\/Page(?!s)/g) ?? [])
  .length;
const size = (statSync(out).size / 1024 / 1024).toFixed(1);
console.log(`${out}\n${pages} pages, ${size} MB`);
if (pages % 4 !== 0) {
  console.warn(
    `${pages} isn't a multiple of 4. Something overflowed a page; check ${url}.`,
  );
  process.exit(1);
}
