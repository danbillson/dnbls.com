import { ImageCycler } from "@/components/image-cycler";
import { cell, LedgerHeading, LedgerTable } from "@/components/ledger";
import { WorkTable } from "@/components/work-table";
import {
  experience,
  links,
  nav,
  posts,
  profile,
  projects,
} from "@/lib/content";
import { getImages, interleave } from "@/lib/images";

// Work photos of me beyond Attio that belong in the hero.
const heroExtras = [
  "/images/work/paddle/focus.jpg",
  "/images/work/paddle/walking.jpg",
  "/images/work/sopost/award.jpg",
];

const pastimes = [
  {
    label: "Travel",
    category: "travel",
    detail: "Valencia, Belgium, New York, Dolomites",
  },
  {
    label: "Beer",
    category: "beer",
    detail: "Craft, cask, and the odd top ten list",
  },
  { label: "Running", category: "running", detail: "London, mostly" },
  {
    label: "Me",
    category: "me",
    detail: "Ex-Team England cheer, now volleyball",
  },
];

export default function Home() {
  const heroImages = interleave(
    getImages("work").filter(
      (p) => p.category === "work/attio" || heroExtras.includes(p.src),
    ),
    getImages("me"),
  );

  return (
    <>
      <section className="flex min-h-dvh flex-col py-[var(--margin)]">
        <header className="page-grid items-center text-[13px] font-medium md:text-sm">
          <a
            href="/"
            className="col-span-2 flex size-8 items-center justify-center rounded-full border-[1.5px] border-foreground font-display text-xs font-bold"
          >
            DB
          </a>
          <nav className="col-span-10 flex justify-end gap-3.5 md:col-span-6 md:col-start-7 md:justify-between">
            {nav.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:underline"
              >
                {item}
              </a>
            ))}
          </nav>
        </header>

        <div className="flex flex-1 items-center justify-center page-x">
          <h1 className="flex items-center font-display text-[clamp(3rem,13vw,15rem)] leading-none font-semibold tracking-[-0.045em] whitespace-nowrap">
            Dan
            <span
              aria-hidden
              className="relative mx-[0.06em] inline-block h-[0.62em] w-[0.95em] overflow-hidden bg-foreground/5"
            >
              <ImageCycler
                images={heroImages}
                eager
                sizes="(min-width: 1024px) 15vw, 25vw"
                className="grayscale"
              />
            </span>
            Billson
          </h1>
        </div>

        <footer className="page-grid items-end text-sm leading-tight font-medium">
          <p className="col-span-6 md:col-span-3">
            <span className="block text-muted">Currently</span>
            {profile.role} at {profile.currently.company}
          </p>
          <p className="col-span-12 row-start-2 mt-4 max-w-[44ch] md:col-span-4 md:col-start-5 md:row-start-auto md:mt-0">
            {profile.intro}
          </p>
          <p className="col-span-6 text-right md:col-span-3 md:col-start-10">
            <span className="block text-muted">{profile.location}</span>
            {profile.coords}
          </p>
        </footer>
      </section>

      <main className="flex flex-col gap-40 pt-32 pb-40 text-sm font-medium">
        <section id="work" className="flex scroll-mt-8 flex-col gap-24">
          <LedgerHeading mark="&" lines={["Work", "Experi-", "ence"]} />
          <WorkTable
            rows={experience.map((e) => ({
              ...e,
              photos: e.photos ? getImages(e.photos) : [],
            }))}
          />
        </section>

        <section id="projects" className="flex scroll-mt-8 flex-col gap-24">
          <LedgerHeading mark="+" lines={["Side", "Proj-", "ects"]} />
          <LedgerTable>
            {projects.map((p) => (
              <div key={p.title} className="contents">
                <span className={`${cell} col-span-2 tabular-nums`}>
                  '{p.year.slice(2)}
                </span>
                <a
                  href={p.href}
                  className={`${cell} col-span-4 transition-colors duration-150 hover:bg-accent md:col-span-3`}
                >
                  {p.title}
                </a>
                <span className={`${cell} col-span-6 md:col-span-4`}>
                  {p.description}
                </span>
                <span
                  className={`${cell} hidden text-muted md:col-span-1 md:block`}
                >
                  {p.type}
                </span>
              </div>
            ))}
          </LedgerTable>
        </section>

        <section id="writing" className="page-grid scroll-mt-8 gap-y-8">
          <h2 className="col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            Writing
          </h2>
          <div className="col-span-12 grid grid-cols-subgrid md:col-span-7">
            {posts.map((p) => (
              <div key={p.title} className="contents">
                <span
                  className={`${cell} col-span-3 tabular-nums md:col-span-2`}
                >
                  {p.date.replaceAll("-", ".")}
                </span>
                <span className={`${cell} col-span-9 md:col-span-5`}>
                  {p.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="page-grid scroll-mt-8 gap-y-8">
          <h2 className="col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            About
          </h2>
          <div className="col-span-12 flex flex-col gap-16 md:col-span-7">
            <p className="max-w-[32ch] font-display text-3xl leading-tight font-medium tracking-tight text-pretty md:text-4xl">
              {profile.statement}
            </p>
            <div className="grid grid-cols-7 gap-x-[var(--gutter)]">
              {pastimes.map((p) => (
                <div key={p.label} className="contents">
                  <span className={`${cell} col-span-2`}>{p.label}</span>
                  <span className={`${cell} col-span-4`}>{p.detail}</span>
                  <span
                    className={`${cell} text-right text-muted tabular-nums`}
                  >
                    {getImages(p.category).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="page-grid scroll-mt-8 gap-y-8">
          <h2 className="col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2">
            Contact
          </h2>
          <ul className="col-span-12 grid grid-cols-subgrid md:col-span-7">
            {links.map((l) => (
              <li key={l.label} className="contents">
                <a
                  href={l.href}
                  className={`${cell} col-span-12 flex justify-between transition-colors duration-150 hover:bg-accent md:col-span-7`}
                >
                  {l.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="page-x pb-[var(--margin)]" aria-hidden>
        <div className="flex items-end justify-between border-foreground border-b font-display text-[clamp(3rem,11vw,12rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-foreground/10">
          <span>dan</span>
          <span>billson</span>
        </div>
      </footer>
    </>
  );
}
