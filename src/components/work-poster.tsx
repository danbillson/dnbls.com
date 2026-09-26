"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { preload } from "react-dom";
import { companyLogos } from "@/components/company-logos";
import type { Photo } from "@/lib/images";
import { heroTileSizes, markMorph } from "@/lib/work-morph";

type Job = {
  slug: string;
  company: string;
  role: string;
  period: string;
  short: string;
  /** Lead photo for the company, if any. */
  photo?: Photo;
};

const pad = (n: number) => String(n + 1).padStart(2, "0");
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/** Lead photo, else the company mark on its tile colour, else the lost-footage card. */
function Picture({ job, priority }: { job: Job; priority?: boolean }) {
  const logo = companyLogos[job.slug];
  if (job.photo) {
    return (
      <Image
        src={job.photo.src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    );
  }
  if (logo) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: logo.background }}
      >
        <logo.Mark className="max-h-[14%] w-[14%]" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-accent p-[var(--margin)] text-foreground">
      <span className="text-xs font-medium">
        Lost footage — {job.company}, {job.period}
      </span>
      <span className="font-display text-[clamp(2rem,6vw,6rem)] leading-none font-semibold tracking-tight">
        Pics or it didn’t happen.
      </span>
    </div>
  );
}

/**
 * Homepage work section: one full-bleed picture with the companies as a line
 * of display type over it. Hovering a name crossfades to that company's
 * picture; clicking morphs the picture into the work page's first tile.
 * Names rise out of a line mask, staggered, once the whole row is on screen
 * (see `.poster-rise` in globals.css). The picture drifts a little slower
 * than the page as the panel scrolls through.
 */
export function WorkPoster({ jobs }: { jobs: Job[] }) {
  const ref = useRef<HTMLElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  const job = jobs[active];

  // The work page's first tile is narrower than the poster, so it picks a
  // different srcset candidate. Fetch it while the name is hovered so the
  // morph lands on a painted photo rather than a grey box that fills later.
  useEffect(() => {
    if (!job.photo) return;
    const { props } = getImageProps({
      src: job.photo.src,
      alt: "",
      fill: true,
      sizes: heroTileSizes,
    });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
    });
  }, [job.photo]);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 1, rootMargin: "0px 0px -24px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax: the picture layer has 8% overscan top and bottom and moves
  // ±6% of its own height across the panel's journey through the viewport.
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      data-in={inView || undefined}
      aria-labelledby="work-heading"
      className="poster-rise relative flex min-h-[85svh] flex-col justify-between gap-16 overflow-hidden bg-foreground p-[var(--margin)] text-background"
    >
      {/* Every picture stays mounted; opacity swaps so a fast hover interrupts cleanly.
          Only the active one carries the shared-element name. */}
      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : drift }}
        className="absolute inset-x-0 -inset-y-[8%]"
      >
        {jobs.map((j, i) => {
          const layer = (
            <div
              key={j.slug}
              className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:duration-200 ${i === active ? "opacity-100" : "opacity-0"}`}
            >
              <Picture job={j} priority={i === 0} />
            </div>
          );
          return i === active ? (
            <ViewTransition
              key={j.slug}
              name="work-hero"
              share="morph"
              default="none"
            >
              {layer}
            </ViewTransition>
          ) : (
            layer
          );
        })}
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60"
      />

      <header className="relative flex justify-between text-xs font-medium tracking-[0.08em] uppercase">
        <h2 id="work-heading">Work › Experience</h2>
        <p className="tabular-nums" aria-live="polite">
          {pad(active)} / {pad(jobs.length - 1)}
        </p>
      </header>

      <div className="relative">
        <ul
          ref={row}
          className="flex flex-wrap gap-x-[clamp(1.25rem,3vw,3rem)]"
        >
          {jobs.map((j, i) => (
            <li
              key={j.slug}
              style={stagger(i)}
              className="-mb-[0.3em] overflow-hidden pt-[0.1em] pb-[0.3em]"
            >
              <Link
                href={`/work/${j.slug}`}
                data-active={i === active}
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && setActive(i)
                }
                onFocus={() => setActive(i)}
                onNavigate={markMorph}
                className={`poster-link relative inline-flex items-baseline gap-2 font-display text-[clamp(1.75rem,3.4vw,3.25rem)] leading-none font-semibold tracking-[-0.03em] transition-colors duration-200 outline-none focus-visible:underline ${i === active ? "text-background" : "text-background/55"}`}
              >
                {j.company}
                <span className="font-sans text-xs font-medium tracking-normal tabular-nums">
                  {j.short}
                </span>
                <span aria-hidden className="poster-arrow text-[0.6em]">
                  ↗
                </span>
                <span aria-hidden className="poster-rule" />
              </Link>
            </li>
          ))}
        </ul>
        <p
          style={stagger(jobs.length)}
          className="poster-caption mt-6 text-xs font-medium text-background/70"
        >
          {job.role} · {job.period}
        </p>
      </div>
    </section>
  );
}
