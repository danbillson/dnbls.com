import { ContactGrid } from "@/components/contact-grid";
import { Hero } from "@/components/hero";
import { introScript } from "@/components/hero-intro";
import { cell, LedgerHeading, LedgerTable } from "@/components/ledger";
import { WorkTable } from "@/components/work-table";
import { experience, links, posts, profile, projects } from "@/lib/content";
import { getImages, interleave } from "@/lib/images";

// Hero = photos of me, mostly from Attio, plus a few picks from other jobs.
const heroExtras = [
  "/images/work/paddle/focus.jpg",
  "/images/work/sopost/award.jpg",
];
const heroExclude = [
  "/images/me/volleyball.jpg",
  "/images/me/team-england.jpg",
  "/images/me/cheer-partner-stunt.jpg",
];

// Full-bleed candidates for the first-visit intro.
const openerSrcs = [
  "/images/work/attio/presentation.jpg",
  "/images/me/friends.jpg",
  "/images/me/child.jpg",
  "/images/me/baby.jpg",
  "/images/me/stunt.jpg",
  "/images/work/attio/bar.jpg",
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
    getImages("me").filter((p) => !heroExclude.includes(p.src)),
  );
  const openers = openerSrcs.flatMap((src) => {
    const photo = heroImages.find((p) => p.src === src);
    return photo
      ? [{ src: photo.src, width: photo.width, height: photo.height }]
      : [];
  });

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script
        dangerouslySetInnerHTML={{ __html: introScript(openers.length) }}
      />
      <Hero images={heroImages} openers={openers} />

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
          <div className="col-span-12 md:col-span-7">
            <ContactGrid links={links} />
          </div>
        </section>
      </main>
    </>
  );
}
