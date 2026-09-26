import "server-only";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { cache } from "react";

// Drop photos into public/images/<category>/ — no imports or manifest needed.
// Filenames become alt text: `dolomites-lago-di-braies.jpg` → "Dolomites lago di braies".
// A leading order prefix (`03-ooh.jpg`) is dropped.

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: string;
};

const ROOT = path.join(process.cwd(), "public", "images");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function toAlt(file: string) {
  const name = path
    .parse(file)
    .name.replace(/^\d+[-_]+/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function walk(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir).sort();
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTENSIONS.has(path.extname(entry).toLowerCase()) ? [full] : [];
  });
}

/** Images in `public/images/<category>` (recursive). e.g. "travel", "work/attio". */
export const getImages = cache((category = ""): Photo[] => {
  return walk(path.join(ROOT, category)).map((file) => {
    const { width, height, orientation } = imageSize(readFileSync(file));
    // EXIF 5–8 = rotated 90°; the optimiser auto-rotates so swap to match.
    const rotated = orientation !== undefined && orientation >= 5;
    const rel = path.relative(ROOT, file);
    return {
      src: `/images/${rel.split(path.sep).join("/")}`,
      width: rotated ? height : width,
      height: rotated ? width : height,
      alt: toAlt(rel.split(path.sep).pop() ?? rel),
      category: path.dirname(rel).split(path.sep).join("/"),
    };
  });
});

/** Round-robin across categories so a mixed set doesn't clump. */
export function interleave(...groups: Photo[][]): Photo[] {
  const out: Photo[] = [];
  const max = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < max; i++) {
    for (const g of groups) if (g[i]) out.push(g[i]);
  }
  return out;
}
