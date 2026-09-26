import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhotoStrip } from "@/components/photo-strip";
import { PlaceSwitcher } from "@/components/place-switcher";
import { SiteHeader } from "@/components/site-header";
import { about } from "@/lib/content";
import { getImages, type Photo } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
};

const kicker = "text-xs font-medium tracking-[0.08em] uppercase";

const beerOrder = [
  "pilsner",
  "augustiner",
  "pliny",
  "westveleteren",
  "westie-pour",
  "westie-close",
  "pannepot",
  "emperors",
  "axis",
  "i-cant-swim-beer",
  "grainfather",
  "homebrew",
  "ingredients",
];

function pick(photos: Photo[], srcs: string[]) {
  return srcs.flatMap((src) => photos.filter((p) => p.src === src));
}

export default function About() {
  const all = getImages();
  const lead = all.find((p) => p.src === "/images/me/portrait.jpg");
  const inset = all.find((p) => p.src === "/images/running/track.jpg");
  const beer = pick(
    getImages("beer"),
    beerOrder.map((name) => `/images/beer/${name}.jpg`),
  );
  const travelHero = all.find((p) => p.src === `/images/${about.travel.hero}`);

  return (
    <>
      <div className="py-[var(--margin)]">
        <SiteHeader />
      </div>

      <main className="flex flex-col gap-40 pt-16 text-sm font-medium md:pt-24">
        <section className="page-grid gap-y-10">
          <p className={`col-span-12 flex items-center gap-2 ${kicker}`}>
            <span aria-hidden className="size-2.5 bg-foreground" />
            About
          </p>

          <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-7">
            <h1 className="font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
              {about.headline}
            </h1>
            {lead && (
              <Image
                src={lead.src}
                alt="Portrait of Dan"
                width={lead.width}
                height={lead.height}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="h-auto w-full bg-foreground/5"
              />
            )}
          </div>

          <div className="col-span-12 flex flex-col gap-10 md:col-span-4 md:col-start-9">
            {inset && (
              <Image
                src={inset.src}
                alt="Dan leading a run club session on the track"
                width={inset.width}
                height={inset.height}
                sizes="(min-width: 768px) 11vw, 8rem"
                className="h-auto w-[clamp(8rem,11vw,10.5rem)] bg-foreground/5"
              />
            )}
            <div className="flex max-w-[60ch] flex-col gap-4 leading-snug text-pretty">
              {about.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <div className="page-grid gap-y-8 md:gap-y-16">
            <h2 className="col-span-12 font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
              {about.beer.headline}
            </h2>
            {about.beer.columns.map((col) => (
              <div
                key={col[0]}
                className="col-span-12 flex flex-col gap-4 leading-snug text-pretty md:col-span-4 lg:col-span-3"
              >
                {col.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            ))}
            <Link
              href={about.beer.link.href}
              className={`col-span-12 flex min-h-32 items-center justify-center border border-foreground p-6 text-center transition-colors duration-150 hover:bg-accent md:col-span-4 md:col-start-9 ${kicker}`}
            >
              {about.beer.link.label} →
            </Link>
          </div>
          <PhotoStrip photos={beer} />
        </section>

        <section className="flex flex-col gap-24 pb-40">
          <div className="relative flex min-h-[85svh] flex-col justify-between gap-16 overflow-hidden bg-foreground p-[var(--margin)] text-background">
            {travelHero && (
              <Image
                src={travelHero.src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60"
            />
            <p className={`relative ${kicker}`}>Travel › Places</p>
            <p className="relative max-w-[36ch] indent-[12%] font-display text-[clamp(1.75rem,3.6vw,3.75rem)] leading-[1.1] font-medium tracking-[-0.02em] text-pretty">
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
