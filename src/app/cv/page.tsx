import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PrintButton } from "@/components/print-button";
import { ScrollReveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Words } from "@/components/words";
import { cv, experience, links, profile, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
};

const kicker = "text-xs font-medium tracking-[0.08em] uppercase";
const heading =
  "rv-rise col-span-12 font-display text-4xl font-semibold tracking-tight md:col-span-3 md:col-start-2 print:text-3xl";
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const email = links.find((l) => l.label === "Email");
const github = links.find((l) => l.label === "GitHub");
const picked = cv.projects.flatMap((t) =>
  projects.filter((p) => p.title === t),
);

export default function CV() {
  return (
    <>
      <ScrollReveal />
      <div className="py-[var(--margin)] print:hidden">
        <SiteHeader />
      </div>

      <main
        id="main"
        tabIndex={-1}
        className="flex flex-col gap-32 pt-16 pb-40 text-[15px] font-medium outline-none md:pt-24 md:text-sm print:gap-10 print:pt-0 print:pb-0"
      >
        <section data-reveal data-in className="page-grid gap-y-10">
          <div className="col-span-12 md:col-span-7 print:col-span-7">
            <h1 className="rv-words font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] print:text-6xl">
              <Words text={profile.name} />
            </h1>
            <p className="rv-rise mt-4 font-display text-xl font-medium tracking-[-0.015em] md:text-2xl">
              {cv.role}
            </p>
          </div>
          <div
            style={at(1)}
            className="rv-rise col-span-12 flex flex-col gap-1 md:col-span-4 md:col-start-9 md:items-end md:text-right print:col-span-4 print:col-start-9 print:items-end print:text-right"
          >
            <span>{cv.location}</span>
            {email && (
              <a href={email.href} className="hover:underline">
                {email.href.replace("mailto:", "")}
              </a>
            )}
            {github && (
              <a href={github.href} className="hover:underline">
                {github.href.replace("https://", "")}
              </a>
            )}
            <span className="hidden print:block">dnbls.com</span>
            <PrintButton className={`mt-4 w-fit ${kicker}`} />
          </div>
        </section>

        <section
          data-reveal
          className="page-grid gap-y-8 print:break-inside-avoid"
        >
          <h2 className={heading}>Summary</h2>
          <p
            style={at(1)}
            className="rv-rise col-span-12 max-w-[60ch] font-display text-xl leading-snug font-medium tracking-[-0.015em] text-pretty md:col-span-7 md:text-2xl print:text-lg"
          >
            {cv.summary}
          </p>
        </section>

        <section className="page-grid gap-y-8">
          <h2 data-reveal className={heading}>
            Experience
          </h2>
          <ol className="col-span-12 flex flex-col gap-12 md:col-span-7">
            {experience.map((job) => (
              <li
                key={job.slug}
                data-reveal
                className="grid grid-cols-7 gap-x-[var(--gutter)] gap-y-3"
              >
                <div className="rv-rise col-span-7 flex flex-col text-muted md:col-span-2">
                  <span className="tabular-nums print:whitespace-nowrap">
                    {job.period}
                  </span>
                  {job.location && <span>{job.location}</span>}
                </div>
                <div className="col-span-7 flex flex-col gap-3 md:col-span-5">
                  <h3
                    style={at(1)}
                    className="rv-rise font-display text-2xl font-semibold tracking-tight print:break-after-avoid"
                  >
                    <a href={job.href} className="hover:underline">
                      {job.company}
                    </a>
                    <span className="block font-sans text-sm font-medium text-muted md:ml-3 md:inline">
                      {job.roles.toReversed().join(" · ")}
                    </span>
                  </h3>
                  <ul className="flex flex-col">
                    {(cv.bullets[job.slug] ?? job.highlights).map((b, i) => (
                      <li
                        key={b}
                        style={at(i + 2)}
                        className="rv-rise max-w-[60ch] border-rule border-t py-1.5 text-pretty print:border-0 print:py-1"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                  {job.stack && (
                    <p style={at(8)} className="rv-rise text-muted">
                      {job.stack.join(", ")}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          data-reveal
          className="page-grid gap-y-8 print:break-inside-avoid"
        >
          <h2 className={heading}>Projects</h2>
          <div className="col-span-12 grid grid-cols-7 gap-x-[var(--gutter)] md:col-span-7">
            {picked.map((p, i) => (
              <div
                key={p.title}
                style={at(i + 1)}
                className="rv-rise col-span-7 grid grid-cols-subgrid border-rule border-t py-1.5 print:border-0 print:py-1"
              >
                <a
                  href={p.href}
                  className="col-span-7 hover:underline md:col-span-2"
                >
                  {p.title}
                </a>
                <span className="col-span-7 text-pretty md:col-span-4">
                  {p.description}
                </span>
                <span className="hidden text-muted md:block">{p.type}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          data-reveal
          className="page-grid gap-y-8 print:break-inside-avoid"
        >
          <h2 className={heading}>Skills</h2>
          <dl className="col-span-12 grid grid-cols-7 gap-x-[var(--gutter)] md:col-span-7">
            {cv.skills.map(([label, value], i) => (
              <div
                key={label}
                style={at(i + 1)}
                className="rv-rise col-span-7 grid grid-cols-subgrid border-rule border-t py-1.5 print:border-0 print:py-1"
              >
                <dt className="col-span-7 text-muted md:col-span-2">{label}</dt>
                <dd className="col-span-7 text-pretty md:col-span-5">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          data-reveal
          className="page-grid gap-y-8 print:break-inside-avoid"
        >
          <h2 className={heading}>Education</h2>
          <div
            style={at(1)}
            className="rv-rise col-span-12 grid grid-cols-7 gap-x-[var(--gutter)] md:col-span-7"
          >
            <span className="col-span-7 text-muted tabular-nums md:col-span-2">
              {cv.education.period}
            </span>
            <div className="col-span-7 flex flex-col md:col-span-5">
              <span>{cv.education.degree}</span>
              <span className="text-muted">{cv.education.school}</span>
            </div>
          </div>
        </section>

        <section
          data-reveal
          className="page-grid gap-y-8 print:break-inside-avoid"
        >
          <h2 className={heading}>Interests</h2>
          <p style={at(1)} className="rv-rise col-span-12 md:col-span-7">
            {cv.interests}
          </p>
        </section>
      </main>
    </>
  );
}
