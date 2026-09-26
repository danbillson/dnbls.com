import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Lines } from "@/components/lines";
import { PhotoBento, type Span } from "@/components/photo-bento";
import { PlaceSwitcher } from "@/components/place-switcher";
import { ScrollReveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Words } from "@/components/words";
import { about } from "@/lib/content";
import { getImages, type Photo } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
};

const kicker = "text-xs font-medium tracking-[0.08em] uppercase";

// [file, cols, rows] — tiles for the bento, packed left to right.
const beerLayout: [string, ...Span][] = [
  ["pilsner", 2, 2],
  ["augustiner", 1, 1],
  ["pliny", 1, 1],
  ["westveleteren", 2, 1],
  ["westie-pour", 1, 1],
  ["westie-close", 1, 1],
  ["pannepot", 2, 2],
  ["emperors", 1, 1],
  ["axis", 1, 1],
  ["i-cant-swim-beer", 1, 1],
  ["grainfather", 1, 2],
  ["homebrew", 1, 1],
  ["ingredients", 1, 2],
];

function pick(photos: Photo[], srcs: string[]) {
  return srcs.flatMap((src) => photos.filter((p) => p.src === src));
}

export default function About() {
  const all = getImages();
  const lead = all.find((p) => p.src === "/images/me/volleyball.jpg");
  const inset = all.find((p) => p.src === "/images/running/track.jpg");
  const beer = pick(
    getImages("beer"),
    beerLayout.map(([name]) => `/images/beer/${name}.jpg`),
  );
  const travelHero = all.find((p) => p.src === `/images/${about.travel.hero}`);

  return (
    <>
      <ScrollReveal />
      <div className="py-[var(--margin)]">
        <SiteHeader />
      </div>

      <main className="flex flex-col gap-40 pt-16 text-sm font-medium md:pt-24">
        {/* Pre-marked in: plays as the load intro. */}
        <section data-reveal data-in className="page-grid gap-y-10">
          <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-7">
            <h1 className="rv-words font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
              <Words text={about.headline} />
            </h1>
            {lead && (
              <div className="rv-img max-h-[70svh] bg-foreground/5 [--d:250ms]">
                <Image
                  src={lead.src}
                  alt="Dan playing volleyball"
                  width={lead.width}
                  height={lead.height}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="max-h-[70svh] w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="col-span-12 flex flex-col gap-10 md:col-span-4 md:col-start-9">
            {inset && (
              <div className="rv-img w-[clamp(8rem,11vw,10.5rem)] bg-foreground/5 [--d:450ms]">
                <Image
                  src={inset.src}
                  alt="Dan leading a run club session on the track"
                  width={inset.width}
                  height={inset.height}
                  sizes="(min-width: 768px) 11vw, 8rem"
                  className="h-auto w-full"
                />
              </div>
            )}
            <Lines
              paragraphs={about.body}
              className="flex max-w-[60ch] flex-col gap-4 leading-snug text-pretty [--d:500ms]"
            />
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <div data-reveal className="page-grid gap-y-8 md:gap-y-16">
            <h2 className="rv-words col-span-12 font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
              <Words text={about.beer.headline} />
            </h2>
            {about.beer.columns.map((col, i) => (
              <Lines
                key={col[0]}
                paragraphs={col}
                style={{ "--d": `${300 + i * 90}ms` } as CSSProperties}
                className="col-span-12 flex flex-col gap-4 leading-snug text-pretty md:col-span-4 lg:col-span-3"
              />
            ))}
            <Link
              href={about.beer.link.href}
              style={{ "--i": 6 } as CSSProperties}
              className={`rv-rise col-span-12 flex min-h-32 items-center justify-center border border-foreground p-6 text-center transition-colors duration-150 hover:bg-accent md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10 ${kicker}`}
            >
              {about.beer.link.label} →
            </Link>
          </div>
          <PhotoBento
            photos={beer}
            spans={beerLayout.map(([, cols, rows]) => [cols, rows])}
          />
        </section>

        <section className="flex flex-col gap-24 pb-40">
          <div
            data-reveal
            className="relative flex min-h-[85svh] flex-col justify-between gap-16 overflow-clip bg-foreground p-[var(--margin)] text-background"
          >
            {/* Overscanned so the scroll-linked drift never shows an edge. */}
            {travelHero && (
              <div className="rv-parallax absolute inset-x-0 -inset-y-[8%]">
                <Image
                  src={travelHero.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60"
            />
            <p className={`rv-rise relative ${kicker}`}>Travel › Places</p>
            <p
              style={{ "--i": 1 } as CSSProperties}
              className="rv-rise relative max-w-[36ch] indent-[12%] font-display text-[clamp(1.75rem,3.6vw,3.75rem)] leading-[1.1] font-medium tracking-[-0.02em] text-pretty"
            >
              {about.travel.intro}
            </p>
          </div>

          <PlaceSwitcher
            places={about.travel.places.map((p) => ({
              ...p,
              photos: getImages(p.photos),
            }))}
          />
        </section>
      </main>
    </>
  );
}
