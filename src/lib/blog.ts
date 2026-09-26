import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

type MDXModule = { metadata?: PostMeta };

const DIR = join(process.cwd(), "src", "content", "blog");

function readingTime(slug: string) {
  const src = readFileSync(join(DIR, `${slug}.mdx`), "utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^export const metadata[\s\S]*?};/m, "");
  const words = src.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const mod = (await import(`@/content/blog/${slug}.mdx`)) as MDXModule;
    if (!mod.metadata) return null;
    return { slug, minutes: readingTime(slug), ...mod.metadata };
  } catch {
    return null;
  }
}

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const slugs = readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const posts = await Promise.all(slugs.map(getPost));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

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
