import Link from "next/link";
import type { CSSProperties } from "react";
import { ContactGrid } from "@/components/contact-grid";
import { Hero } from "@/components/hero";
import { cell, LedgerTable } from "@/components/ledger";
import { LedgerHeading } from "@/components/ledger-heading";
import { Lines } from "@/components/lines";
import { ScrollReveal } from "@/components/reveal";
import { WorkPoster } from "@/components/work-poster";
import { experience, links, posts, profile, projects } from "@/lib/content";
import { getImages, interleave } from "@/lib/images";

// Hero = photos of me, mostly from Attio, plus a few picks from other jobs.
const heroExtras = [
  "/images/work/paddle/focus.jpg",
  "/images/work/sopost/award.jpg",
];
const heroExclude = ["/images/me/volleyball.jpg"];

export default function Home() {
  const heroImages = interleave(
    getImages("work").filter(
      (p) => p.category === "work/attio" || heroExtras.includes(p.src),
    ),
    getImages("me").filter((p) => !heroExclude.includes(p.src)),
  );
  return (
    <>
      <ScrollReveal />
      <Hero images={heroImages} />

      <main className="flex flex-col gap-40 pt-32 pb-40 text-sm font-medium">
        <section id="work" className="scroll-mt-8">
          <WorkPoster
            jobs={experience.map((e) => ({
              ...e,
              photo: e.photos ? getImages(e.photos)[0] : undefined,
            }))}
          />
        </section>

        <section id="projects" className="flex scroll-mt-8 flex-col gap-24">
          <LedgerHeading mark="+" lines={["Side", "Proj-", "ects"]} />
          <LedgerTable>
            {projects.map((p, i) => (
              <div
                key={p.title}
                style={{ "--i": i } as CSSProperties}
                className="contents"
              >
                <span className={`${cell} rv-rise col-span-2 tabular-nums`}>
                  '{p.year.slice(2)}
                </span>
                <a
                  href={p.href}
                  className={`${cell} rv-rise col-span-4 transition-colors duration-150 hover:bg-accent md:col-span-3`}
                >
                  {p.title}
                </a>
                <span className={`${cell} rv-rise col-span-6 md:col-span-4`}>
                  {p.description}
                </span>
                <span
                  className={`${cell} rv-rise hidden text-muted md:col-span-1 md:block`}
                >
                  {p.type}
                </span>
              </div>
            ))}
          </LedgerTable>
        </section>

        <section
          id="about"
          data-reveal
          className="page-grid scroll-mt-8 gap-y-8"
        >
          <h2 className="rv-rise col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            About
          </h2>
          <div className="col-span-12 flex flex-col gap-16 md:col-span-7">
            <Lines
              paragraphs={[profile.statement]}
              className="max-w-[32ch] font-display text-3xl leading-tight font-medium tracking-tight text-pretty md:text-4xl"
            />
            <Link
              href="/about"
              style={{ "--i": 6 } as CSSProperties}
              className="rv-rise w-fit text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-150 hover:bg-accent"
            >
              Read more →
            </Link>
          </div>
        </section>

        <section
          id="writing"
          data-reveal
          className="page-grid scroll-mt-8 gap-y-8 [--rv-step:45ms]"
        >
          <h2 className="rv-rise col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            Writing
          </h2>
          <div className="col-span-12 grid grid-cols-subgrid md:col-span-7">
            {posts.map((p, i) => (
              <div
                key={p.title}
                style={{ "--i": i + 1 } as CSSProperties}
                className="contents"
              >
                <span
                  className={`${cell} rv-rise col-span-3 tabular-nums md:col-span-2`}
                >
                  {p.date.replaceAll("-", ".")}
                </span>
                <span className={`${cell} rv-rise col-span-9 md:col-span-5`}>
                  {p.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          data-reveal
          className="page-grid scroll-mt-8 gap-y-8"
        >
          <h2 className="rv-rise col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            Contact
          </h2>
          <div
            style={{ "--i": 1 } as CSSProperties}
            className="rv-rise col-span-12 md:col-span-7"
          >
            <ContactGrid links={links} />
          </div>
        </section>
      </main>
    </>
  );
}
