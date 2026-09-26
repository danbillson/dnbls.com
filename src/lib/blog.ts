import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type PostMeta = {
  title: string;
  date: string;
  description?: string;
};

export type Post = {
  slug: string;
  /** Minutes, from the raw source with code and JSX stripped. */
  minutes: number;
} & PostMeta;

const DIR = join(process.cwd(), "src", "content", "blog");

function readingTime(src: string) {
  const text = src
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^export const metadata[\s\S]*?};/m, "")
    .replace(/^import [\s\S]*?;$/gm, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Read `export const metadata = { … }` off the source. Importing the module
 * would work, but a templated `import()` puts every post's client components
 * (and their deps) in the bundle of every page that lists posts.
 */
function parseMeta(src: string): PostMeta | null {
  const block = src.match(/^export const metadata\s*=\s*\{([\s\S]*?)\};/m)?.[1];
  if (!block) return null;
  const str = (key: string) =>
    block
      .match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1]
      ?.replace(/\\(.)/g, "$1");
  const title = str("title");
  const date = str("date");
  if (!title || !date) return null;
  return { title, date, description: str("description") };
}

const SLUG = /^[a-z0-9-]+$/;

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!SLUG.test(slug)) return null;
  let src: string;
  try {
    src = readFileSync(join(DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
  const meta = parseMeta(src);
  if (!meta) return null;
  return { slug, minutes: readingTime(src), ...meta };
});

/** All posts, newest first. */
export const getPosts = cache(async (): Promise<Post[]> => {
  const slugs = readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const posts = await Promise.all(slugs.map(getPost));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
});

/** "2025-11-28" → "28.11.2025", matching the ledger rows on the homepage. */
export function ledgerDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

/** "2025-11-28" → "28 November 2025". */
export function longDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
