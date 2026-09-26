"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import type { Photo } from "@/lib/images";

type Job = {
  slug: string;
  company: string;
  href: string;
  roles: string[];
  team?: string;
  location?: string;
  period: string;
  about: string;
  highlights: string[];
  stack?: string[];
  photos: Photo[];
};

type Layout = "grid" | "column";
type Tile =
  | { kind: "photo"; photo: Photo; span: "full" | "half" }
  | { kind: "filler" };

const isLandscape = (p: Photo) => p.width > p.height;

/** Alternate a full-width landscape row with a pair; an odd one out gets a caption tile. */
function bento(photos: Photo[]): Tile[] {
  const queue = [...photos];
  const out: Tile[] = [];
  let full = true;
  while (queue.length) {
    const i = full ? queue.findIndex(isLandscape) : -1;
    if (i >= 0) {
      out.push({ kind: "photo", photo: queue.splice(i, 1)[0], span: "full" });
    } else {
      const [a, b] = queue.splice(0, 2);
      if (!b && isLandscape(a)) {
        out.push({ kind: "photo", photo: a, span: "full" });
      } else {
        out.push({ kind: "photo", photo: a, span: "half" });
        out.push(
          b ? { kind: "photo", photo: b, span: "half" } : { kind: "filler" },
        );
      }
    }
    full = !full;
  }
  return out;
}

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Split work view: sticky details + job index on the left, photos on the right.
 * Active job comes from the URL, so links, back/forward and deep links all work.
 * Moving down the index reveals upward, moving up reveals downward.
 */
export function WorkViewer({ jobs, nav }: { jobs: Job[]; nav: string[] }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2] ?? jobs[0].slug;
  const index = Math.max(
    0,
    jobs.findIndex((j) => j.slug === slug),
  );
  const job = jobs[index];

  const [layout, setLayout] = useState<Layout>("grid");
  // Direction of travel through the index, derived when the job changes.
  const [prev, setPrev] = useState(index);
  const [dir, setDir] = useState<1 | -1>(1);
  if (prev !== index) {
    setDir(index > prev ? 1 : -1);
    setPrev(index);
  }

  // New job starts at the top of its photos.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per job
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  const details: [string, ReactNode][] = [
    [
      "Role",
      // Earlier titles recede; the last one is where I ended up.
      job.roles.map((r, i) => (
        <span
          key={r}
          className={`block ${i < job.roles.length - 1 ? "text-muted" : ""}`}
        >
          {r}
        </span>
      )),
    ],
    ["Period", job.period],
    ...(job.team ? [["Team", job.team] as [string, string]] : []),
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

  const tiles: Tile[] =
    layout === "grid"
      ? bento(job.photos)
      : job.photos.map((photo) => ({ kind: "photo", photo, span: "full" }));

  const navLinks = nav.map((item) => (
    <Link
      key={item}
      href={item === "Work" ? "/work" : `/#${item.toLowerCase()}`}
      className={item === "Work" ? "underline" : "hover:underline"}
    >
      {item}
    </Link>
  ));

  return (
    <div className="page-grid min-h-dvh text-sm font-medium" data-dir={dir}>
      <aside className="col-span-12 flex flex-col gap-16 py-[var(--margin)] md:sticky md:top-0 md:col-span-5 md:h-dvh md:gap-8 md:self-start">
        <header className="flex h-8 items-center justify-between text-[13px] md:text-sm">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-full border-[1.5px] border-foreground font-display text-xs font-bold"
          >
            DB
          </Link>
          <nav className="flex gap-3.5 md:hidden">{navLinks}</nav>
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
          <ol className="relative grid grid-cols-5 gap-x-[var(--gutter)]">
            {/* One marker that travels between rows, like a ledger cursor. */}
            <span
              aria-hidden
              className="work-marker pointer-events-none absolute top-0 left-0 flex h-7 items-center"
              style={{ transform: `translateY(${index * 100}%)` }}
            >
              <span className="size-2.5 bg-foreground" />
            </span>
            {jobs.map((j, i) => (
              <li key={j.slug} className="col-span-5 grid grid-cols-subgrid">
                <Link
                  href={`/work/${j.slug}`}
                  scroll={false}
                  aria-current={i === index ? "page" : undefined}
                  className="col-span-5 grid h-7 grid-cols-subgrid items-center border-rule border-b transition-colors duration-150 hover:bg-accent"
                >
                  <span
                    className={`tabular-nums transition-opacity duration-150 ${i === index ? "opacity-0" : "text-muted"}`}
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
        className="col-span-12 flex flex-col gap-[var(--gutter)] pb-[var(--margin)] md:col-span-7 md:py-[var(--margin)]"
      >
        <div className="flex h-8 items-center justify-between">
          <fieldset className="flex gap-3.5">
            <legend className="sr-only">Layout</legend>
            {(["grid", "column"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={layout === l}
                onClick={() => setLayout(l)}
                className={`capitalize transition-colors duration-150 ${layout === l ? "" : "text-muted hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </fieldset>
          <nav className="hidden gap-3.5 md:flex">{navLinks}</nav>
        </div>

        <div
          key={`${job.slug}-${layout}`}
          className="grid grid-cols-2 gap-[var(--gutter)]"
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
            tiles.map((t, i) =>
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
              ) : (
                <figure
                  key={t.photo.src}
                  className={`work-reveal relative overflow-hidden bg-foreground/5 ${t.span === "full" ? "col-span-2" : ""}`}
                  style={{
                    ...stagger(i),
                    aspectRatio:
                      layout === "column"
                        ? `${t.photo.width} / ${t.photo.height}`
                        : t.span === "full"
                          ? "3 / 2"
                          : "4 / 5",
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
              ),
            )
          )}
        </div>
      </section>
    </div>
  );
}
