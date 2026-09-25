import Image from "next/image";
import { experience, links, posts, profile, projects } from "@/lib/content";
import { getImages } from "@/lib/images";

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-grid gap-y-6 border-foreground border-t-2 pt-3 pb-24">
      <span className="col-span-2 text-sm font-semibold tabular-nums md:col-span-1">
        {n}
      </span>
      <h2 className="col-span-10 font-display text-5xl leading-none font-bold tracking-[-0.04em] md:col-span-5 md:text-6xl">
        {title}
      </h2>
      <div className="col-span-12 md:col-span-6">{children}</div>
    </section>
  );
}

const row =
  "grid grid-cols-6 gap-x-[var(--gutter)] border-rule border-b py-1.5 transition-colors duration-150 hover:bg-accent";

export default function Poster() {
  const [photo] = getImages("me");
  return (
    <main className="text-sm">
      <header className="page-grid gap-y-1 py-[var(--margin)] font-semibold">
        <span className="col-span-6 md:col-span-3">{profile.name}</span>
        <span className="col-span-6 md:col-span-3">{profile.role}</span>
        <span className="col-span-6 md:col-span-3">{profile.location}</span>
        <span className="col-span-6 md:col-span-3 md:text-right">
          Portfolio ’26
        </span>
      </header>

      <section className="page-grid min-h-[calc(100dvh-3.5rem)] grid-rows-[1fr_auto] gap-y-[var(--gutter)] pb-[var(--margin)]">
        <h1 className="col-span-12 self-end pb-[0.24em] font-display text-[clamp(4rem,19vw,22rem)] leading-[0.8] font-bold tracking-[-0.06em] md:col-span-9">
          Design
          <br />
          Engineer
        </h1>
        <div className="relative col-span-6 row-start-2 aspect-[3/4] md:col-span-3 md:col-start-10 md:row-start-1 md:self-end">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload
            sizes="25vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="col-span-6 row-start-2 flex flex-col justify-between bg-accent p-3 font-semibold md:col-span-3 md:col-start-10">
          <span>Currently</span>
          <a href={profile.currently.href} className="text-2xl tracking-tight">
            {profile.currently.company} ↗
          </a>
        </div>
        <p className="col-span-12 row-start-3 max-w-[48ch] text-base md:col-span-5 md:row-start-2 md:self-end">
          {profile.statement}
        </p>
      </section>

      <Section n="01" title="Work">
        {experience.map((e) => (
          <div key={e.company} className={row}>
            <span className="col-span-2 font-semibold">{e.company}</span>
            <span className="col-span-3">{e.role}</span>
            <span className="text-right tabular-nums">{e.years}</span>
          </div>
        ))}
      </Section>

      <Section n="02" title="Projects">
        {projects.map((p) => (
          <a key={p.title} href={p.href} className={row}>
            <span className="col-span-2 font-semibold">{p.title}</span>
            <span className="col-span-3">{p.description}</span>
            <span className="text-right tabular-nums">{p.year}</span>
          </a>
        ))}
      </Section>

      <Section n="03" title="Writing">
        {posts.map((p) => (
          <div key={p.title} className={row}>
            <span className="col-span-5">{p.title}</span>
            <span className="text-right tabular-nums">
              {p.date.slice(0, 7)}
            </span>
          </div>
        ))}
      </Section>

      <Section n="04" title="Contact">
        <ul className="grid grid-cols-2 gap-x-[var(--gutter)]">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="block border-rule border-b py-1.5 font-semibold transition-colors duration-150 hover:bg-accent"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
