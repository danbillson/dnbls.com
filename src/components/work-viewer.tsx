"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState,
  ViewTransition,
} from "react";
import { companyLogos } from "@/components/company-logos";
import { LogoIcon } from "@/components/logo-icon";
import { NavLinks } from "@/components/site-header";
import type { Photo } from "@/lib/images";
import { consumeMorph } from "@/lib/work-morph";

type Job = {
  slug: string;
  company: string;
  href: string;
  roles: string[];
  team?: string[];
  location?: string;
  period: string;
  about: string;
  highlights: string[];
  stack?: string[];
  photos: Photo[];
};

type Span = "full" | "half";
type Item = { kind: "photo"; photo: Photo } | { kind: "logo" };
type Tile = (Item & { span: Span }) | { kind: "filler" };

// Logos sit in the grid like a portrait, so they always take a half slot.
const isLandscape = (t: Item) =>
  t.kind === "photo" && t.photo.width > t.photo.height;

/** Alternate a full-width landscape row with a pair; an odd one out gets a caption tile. */
function bento(items: Item[]): Tile[] {
  const queue = [...items];
  const out: Tile[] = [];
  let full = true;
  while (queue.length) {
    const i = full ? queue.findIndex(isLandscape) : -1;
    if (i >= 0) {
      out.push({ ...queue.splice(i, 1)[0], span: "full" });
    } else {
      const [a, b] = queue.splice(0, 2);
      if (!b && isLandscape(a)) {
        out.push({ ...a, span: "full" });
      } else {
        out.push({ ...a, span: "half" });
        out.push(b ? { ...b, span: "half" } : { kind: "filler" });
      }
    }
    full = !full;
  }
  return out;
}

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/** Chronological list shown newest first; earlier entries recede. */
function Latest({ items }: { items: string[] }) {
  return items.toReversed().map((item, i) => (
    <span key={item} className={`block ${i > 0 ? "text-muted" : ""}`}>
      {item}
    </span>
  ));
}

/**
 * Split work view: sticky details + job index on the left, photos on the right.
 * Active job comes from the URL, so links, back/forward and deep links all work.
 * Moving down the index reveals upward, moving up reveals downward.
 */
export function WorkViewer({ jobs }: { jobs: Job[] }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2] ?? jobs[0].slug;
  const index = Math.max(
    0,
    jobs.findIndex((j) => j.slug === slug),
  );
  const job = jobs[index];

  // Direction of travel through the index, derived when the job changes.
  const [prev, setPrev] = useState(index);
  const [dir, setDir] = useState<1 | -1>(1);
  if (prev !== index) {
    setDir(index > prev ? 1 : -1);
    setPrev(index);
  }

  // Arriving from the homepage poster, its picture morphs into this job's
  // first tile, which then skips its own reveal. Later jobs reveal as usual.
  const [morphed] = useState(() => (consumeMorph() ? job.slug : null));
  const reveal = (i: number) =>
    i === 0 && job.slug === morphed ? "" : "work-reveal";

  // New job starts at the top of its photos.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per job
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  const details: [string, ReactNode][] = [
    ["Role", <Latest key="roles" items={job.roles} />],
    ["Period", job.period],
    ...(job.team
      ? [
          ["Team", <Latest key="team" items={job.team} />] as [
            string,
            ReactNode,
          ],
        ]
      : []),
    ...(job.location ? [["Location", job.location] as [string, string]] : []),
    [
      "About",
      <span key="about" className="block max-w-[46ch] text-pretty">
        {job.about}
      </span>,
    ],
    [
      "Highlights",
      <ul key="highlights" className="max-w-[46ch]">
        {job.highlights.map((h) => (
          <li key={h} className="text-pretty">
            {h}
          </li>
        ))}
      </ul>,
    ],
    ...(job.stack ? [["Stack", job.stack.join(", ")] as [string, string]] : []),
  ];

  // Company mark leads the set; with no photos it stands in for them.
  const logo = companyLogos[job.slug];
  const items: Item[] = [
    ...(logo ? [{ kind: "logo" } as const] : []),
    ...job.photos.map((photo) => ({ kind: "photo", photo }) as const),
  ];
  const tiles: Tile[] =
    job.photos.length === 0
      ? logo
        ? [{ kind: "logo", span: "full" }]
        : []
      : bento(items);

  return (
    <div className="page-grid min-h-dvh text-sm font-medium" data-dir={dir}>
      {/* The site header is split across the two columns so the logo lives in
          the sticky sidebar and the nav scrolls with the photos. Same grid
          positions as SiteHeader, so it lines up with every other page. */}
      <aside className="col-span-12 flex flex-col gap-16 py-[var(--margin)] md:sticky md:top-0 md:col-span-5 md:h-dvh md:gap-8 md:self-start">
        <header className="flex h-9 items-center justify-between text-[13px] md:text-sm">
          <Link href="/" className="flex items-center">
            <LogoIcon className="size-9" />
          </Link>
          <nav className="flex gap-3.5 md:hidden">
            <NavLinks />
          </nav>
        </header>

        {/* Remounts per job so the entrance replays. */}
        <div
          key={job.slug}
          className="flex flex-col gap-8 md:flex-1 md:overflow-y-auto"
        >
          <h1
            className="work-in font-display text-[clamp(2.75rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.04em]"
            style={stagger(0)}
          >
            <a href={job.href} className="hover:underline">
              {job.company}
            </a>
          </h1>
          <dl className="grid grid-cols-5 gap-x-[var(--gutter)] gap-y-3">
            {details.map(([label, value], i) => (
              <div
                key={label}
                className="work-in col-span-5 grid grid-cols-subgrid"
                style={stagger(i + 1)}
              >
                <dt className="text-muted">{label}</dt>
                <dd className="col-span-4">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Jobs">
          <p className="mb-2 text-muted">Experience</p>
          <ol className="grid grid-cols-5 gap-x-[var(--gutter)]">
            {jobs.map((j, i) => (
              <li key={j.slug} className="col-span-5 grid grid-cols-subgrid">
                <Link
                  href={`/work/${j.slug}`}
                  scroll={false}
                  aria-current={i === index ? "page" : undefined}
                  className="col-span-5 grid h-7 grid-cols-subgrid items-center border-rule border-b transition-colors duration-150 hover:bg-accent"
                >
                  {/* Active row reads in ink, the rest recede. */}
                  <span
                    className={`tabular-nums transition-colors duration-150 ${i === index ? "" : "text-muted"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-3 min-w-0 truncate">
                    {j.company}
                  </span>
                  <span className="truncate text-right text-muted tabular-nums">
                    {j.period.split(" – ")[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <section
        aria-label={`${job.company} photos`}
        className="col-span-12 grid grid-cols-subgrid content-start gap-y-[var(--gutter)] pb-[var(--margin)] md:col-span-7 md:py-[var(--margin)]"
      >
        <nav className="col-span-6 col-start-2 hidden h-9 items-center justify-between md:flex">
          <NavLinks />
        </nav>
        <div
          key={job.slug}
          className="col-span-full grid grid-cols-2 gap-[var(--gutter)]"
        >
          {tiles.length === 0 ? (
            <div
              className="work-reveal col-span-2 flex aspect-[3/2] flex-col justify-between bg-accent p-3 text-foreground"
              style={stagger(0)}
            >
              <span className="text-xs font-medium">
                Lost footage — {job.company}, {job.period}
              </span>
              <span className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-none font-semibold tracking-tight">
                Pics or it didn’t happen.
              </span>
            </div>
          ) : (
            tiles.map((t, i) => {
              const tile =
                t.kind === "filler" ? (
                  <div
                    key="filler"
                    aria-hidden
                    className="work-reveal flex aspect-[4/5] flex-col justify-end bg-foreground/5 p-3"
                    style={stagger(i)}
                  >
                    <span className="font-display text-2xl leading-none font-semibold tracking-tight">
                      {job.company}
                      <br />
                      <span className="text-muted">{job.period}</span>
                    </span>
                  </div>
                ) : t.kind === "logo" && logo ? (
                  <div
                    key="logo"
                    className={`${reveal(i)} flex items-center justify-center overflow-hidden ${t.span === "full" ? "col-span-2 aspect-[3/2]" : "aspect-[4/5]"}`}
                    style={{ ...stagger(i), background: logo.background }}
                  >
                    <logo.Mark className="max-h-[22%] w-[22%]" />
                  </div>
                ) : t.kind === "photo" ? (
                  <figure
                    key={t.photo.src}
                    className={`${reveal(i)} relative overflow-hidden bg-foreground/5 ${t.span === "full" ? "col-span-2" : ""}`}
                    style={{
                      ...stagger(i),
                      aspectRatio: t.span === "full" ? "3 / 2" : "4 / 5",
                    }}
                  >
                    <Image
                      src={t.photo.src}
                      alt={t.photo.alt}
                      fill
                      sizes={
                        t.span === "full"
                          ? "(min-width: 768px) 58vw, 100vw"
                          : "(min-width: 768px) 29vw, 50vw"
                      }
                      loading={i < 2 ? "eager" : undefined}
                      className="object-cover"
                    />
                  </figure>
                ) : null;
              // The first tile is the shared element the poster's picture becomes.
              return i === 0 ? (
                <ViewTransition
                  key="hero"
                  name="work-hero"
                  share="morph"
                  default="none"
                >
                  {tile}
                </ViewTransition>
              ) : (
                tile
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
