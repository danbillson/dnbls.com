import { experience, posts, projects } from "@/lib/content";

const cell = "min-w-0 truncate border-rule border-b py-1";

function Heading({ lines }: { lines: [string, string, string, string] }) {
  const [amp, first, second, third] = lines;
  return (
    <h2 className="page-grid font-display text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
      <span className="col-span-3 col-start-4">{first}</span>
      <span className="col-span-2 col-start-2 row-start-2">{amp}</span>
      <span className="col-span-9 col-start-4 row-start-2">{second}</span>
      <span className="col-span-7 col-start-6 row-start-3">{third}</span>
    </h2>
  );
}

export default function Ledger() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between p-[var(--margin)]">
        <span className="size-4 bg-accent" aria-hidden />
        <button
          type="button"
          className="rounded-full bg-foreground px-3 py-0.5 text-sm font-semibold text-background"
        >
          Menu
        </button>
      </header>

      <main className="flex flex-col gap-40 pt-24 pb-40 text-sm font-medium">
        <section className="flex flex-col gap-24">
          <Heading lines={["&", "Work", "Experi-", "ence"]} />
          <div className="page-grid">
            <div className="col-span-12 grid grid-cols-subgrid md:col-span-10 md:col-start-2">
              {experience.map((e) => (
                <div key={e.company} className="contents">
                  <span className={`${cell} col-span-2 tabular-nums`}>
                    {e.short}
                  </span>
                  <span className={`${cell} col-span-4 md:col-span-3`}>
                    {e.company}
                  </span>
                  <span className={`${cell} col-span-6 md:col-span-4`}>
                    {e.role}
                  </span>
                  <span
                    className={`${cell} hidden text-muted md:col-span-1 md:block`}
                  >
                    {e.years}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-24">
          <Heading lines={["+", "Side", "Proj-", "ects"]} />
          <div className="page-grid">
            <div className="col-span-12 grid grid-cols-subgrid md:col-span-10 md:col-start-2">
              {projects.map((p) => (
                <div key={p.title} className="contents">
                  <span className={`${cell} col-span-2 tabular-nums`}>
                    '{p.year.slice(2)}
                  </span>
                  <a
                    href={p.href}
                    className={`${cell} col-span-4 hover:bg-accent md:col-span-3`}
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
            </div>
          </div>
        </section>

        <section className="page-grid gap-y-8">
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
      </main>

      <footer className="mt-auto page-x pb-[var(--margin)]">
        <div className="flex items-end justify-between border-foreground border-b font-display text-[clamp(3rem,11vw,12rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-foreground/10">
          <span>dan</span>
          <span>billson</span>
        </div>
      </footer>
    </div>
  );
}
