import "server-only";
import { getPost, getPostSource, getPosts } from "@/lib/blog";

/**
 * Printed A6 booklets of list posts ("## 1. Name" sections). The words and
 * photos come from the post's MDX, so a fix to the post fixes the booklet.
 * Each booklet only decides which page shows what.
 *
 * Render /blog/<slug>/print, then `pnpm booklet <slug>` saves the PDF for
 * imposing in Bindings (saddle stitch, separate cover from the first and
 * last two pages).
 */

export type BookletPage =
  | { kind: "cover" }
  | { kind: "intro" }
  | { kind: "list" }
  /** A pub's text, with its photo above if `photo` is set. */
  | { kind: "pub"; rank: number; photo?: boolean }
  /** A pub's photo filling the page; pair it with the facing text page. */
  | { kind: "photo"; rank: number }
  | { kind: "notes" }
  | { kind: "back" };

type BookletConfig = {
  /** Cover title; the year sits beside it. */
  title: string;
  edition: string;
  /** Slug prefix shared by every year of the list, for the back cover. */
  series: string;
  /** Rank of the pub whose photo is on the cover. */
  coverPhoto: number;
  pages: BookletPage[];
};

export const BOOKLETS: Record<string, BookletConfig> = {
  "top-10-pubs-in-london-2026": {
    title: "Top 10 pubs in London",
    edition: "Third edition",
    series: "top-10-pubs-in-london",
    coverPhoto: 1,
    // Pages 1, 2, 15 and 16 print on the card cover. Photos sit on the same
    // spread as their text: spreads are 2|3, 4|5 … 14|15.
    pages: [
      { kind: "cover" },
      { kind: "intro" },
      { kind: "list" },
      { kind: "pub", rank: 1 },
      { kind: "pub", rank: 2 },
      { kind: "pub", rank: 3 },
      { kind: "pub", rank: 4, photo: true },
      { kind: "photo", rank: 5 },
      { kind: "pub", rank: 5 },
      { kind: "pub", rank: 6 },
      { kind: "pub", rank: 7 },
      { kind: "pub", rank: 8 },
      { kind: "pub", rank: 9, photo: true },
      { kind: "pub", rank: 10 },
      { kind: "notes" },
      { kind: "back" },
    ],
  },
};

export type Photo = { src: string; width: number; height: number; alt: string };

export type Pub = {
  rank: number;
  name: string;
  location: string;
  text: string[];
  photo?: Photo;
};

/** Plain text from a markdown paragraph: links and emphasis unwrapped. */
function plain(md: string) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|\*)(\S(?:.*?\S)?)\1/g, "$2")
    .replace(/\s+/g, " ")
    .trim();
}

/** `name="text"` or `name={123}` from a JSX tag. */
function attr(tag: string, name: string) {
  const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|\\{(\\d+)\\})`));
  return m?.[1] ?? m?.[2];
}

/** Prose paragraphs from MDX: JSX blocks, rules and imports dropped. */
function paragraphs(chunk: string) {
  return chunk
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b && !/^(<|---|import |export )/.test(b))
    .map(plain);
}

export function parseListPost(src: string) {
  const body = src.replace(/^export const metadata[\s\S]*?^};$/m, "");
  const [head, ...sections] = body.split(/^## /m);
  const pubs: Pub[] = sections.map((section) => {
    const [heading, ...rest] = section.split("\n");
    const m = heading.match(/^(\d+)\.\s+(.+)$/);
    if (!m) throw new Error(`Expected "## n. Name", got "## ${heading}"`);
    const chunk = rest.join("\n");
    const name = m[2].trim();
    const info = chunk.match(/<InfoLinks\b[\s\S]*?\/>/)?.[0];
    const image = chunk.match(/<Image\b[\s\S]*?\/>/)?.[0];
    return {
      rank: Number(m[1]),
      name,
      location: (info && attr(info, "location")) ?? "",
      text: paragraphs(chunk),
      photo: image
        ? {
            src: attr(image, "src") ?? "",
            width: Number(attr(image, "width")),
            height: Number(attr(image, "height")),
            alt: attr(image, "alt") ?? name,
          }
        : undefined,
    };
  });
  return { intro: paragraphs(head), pubs };
}

export async function getBooklet(slug: string) {
  const config = BOOKLETS[slug];
  const post = await getPost(slug);
  const src = getPostSource(slug);
  if (!config || !post || !src) return null;
  if (config.pages.length % 4 !== 0) {
    throw new Error(
      `${slug}: ${config.pages.length} pages; a saddle-stitched booklet needs a multiple of 4.`,
    );
  }

  const { intro, pubs } = parseListPost(src);
  const pub = (rank: number) => {
    const p = pubs.find((x) => x.rank === rank);
    if (!p) throw new Error(`${slug}: no "## ${rank}." section`);
    return p;
  };
  // Every page plan entry must resolve, and photo pages need a photo.
  for (const page of config.pages) {
    if (page.kind === "photo" || (page.kind === "pub" && page.photo)) {
      if (!pub(page.rank).photo)
        throw new Error(`${slug}: ${pub(page.rank).name} has no <Image>`);
    } else if (page.kind === "pub") pub(page.rank);
  }
  const cover = pub(config.coverPhoto).photo;
  if (!cover) throw new Error(`${slug}: cover pub has no <Image>`);

  // Where each pub's text lands, for the list page.
  const pageOf = new Map(
    config.pages.flatMap((p, i) =>
      p.kind === "pub" ? [[p.rank, i + 1] as const] : [],
    ),
  );

  const posts = await getPosts();
  const numberOnes = posts
    .filter((p) => p.slug.startsWith(config.series))
    .map((p) => ({
      year: p.date.slice(0, 4),
      name: getPostSource(p.slug)
        ?.match(/^## 1\.\s+(.+)$/m)?.[1]
        .trim(),
    }))
    .filter((r): r is { year: string; name: string } => Boolean(r.name))
    .sort((a, b) => a.year.localeCompare(b.year));

  return {
    ...config,
    post,
    year: post.date.slice(0, 4),
    intro,
    pubs,
    pub,
    cover,
    pageOf,
    numberOnes,
  };
}

export type BookletData = NonNullable<Awaited<ReturnType<typeof getBooklet>>>;
