import Image from "next/image";
import { experience, nav, photos, profile } from "@/lib/content";

export default function Wordmark() {
  return (
    <>
      <section className="flex min-h-dvh flex-col py-[var(--margin)]">
        <header className="page-grid items-center text-sm font-medium">
          <span className="col-span-2 flex size-8 items-center justify-center rounded-full border-[1.5px] border-foreground font-display text-xs font-bold">
            DB
          </span>
          <nav className="col-span-10 flex justify-end gap-6 md:col-span-6 md:col-start-7 md:justify-between">
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
            <span className="relative mx-[0.06em] inline-block h-[0.62em] w-[0.95em] overflow-hidden">
              <Image
                src={photos.mikkeller.src}
                alt={photos.mikkeller.alt}
                fill
                preload
                sizes="15vw"
                className="object-cover grayscale"
              />
            </span>
            Billson
          </h1>
        </div>

        <footer className="page-grid items-end text-sm font-medium leading-tight">
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

      <section id="work" className="py-24">
        <h2 className="page-x mb-4 text-sm font-medium text-muted">Work</h2>
        <ul className="border-rule border-t">
          {experience.map((e) => (
            <li
              key={e.company}
              className="page-grid items-baseline border-rule border-b py-2 transition-colors duration-150 hover:bg-accent"
            >
              <span className="col-span-12 font-display text-5xl font-semibold tracking-tight md:col-span-6 md:text-7xl">
                {e.company}
              </span>
              <span className="col-span-8 text-sm md:col-span-4">{e.role}</span>
              <span className="col-span-4 text-right text-sm tabular-nums md:col-span-2">
                {e.years}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
