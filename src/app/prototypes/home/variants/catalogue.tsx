import Image from "next/image";
import { experience, nav, photoList, profile, projects } from "@/lib/content";

type Entry = { title: string; kind: string; year: string; count: number };

const entries: Entry[] = [
  ...projects.map((p, i) => ({
    title: p.title,
    kind: p.type,
    year: p.year,
    count: [5, 7, 5, 6, 6, 7][i],
  })),
  ...experience.map((e) => ({
    title: e.company,
    kind: e.role,
    year: e.years,
    count: 4,
  })),
];

const pairs = Array.from({ length: Math.ceil(entries.length / 2) }, (_, i) =>
  entries.slice(i * 2, i * 2 + 2),
);

function Item({ entry }: { entry: Entry }) {
  return (
    <p className="leading-tight">
      {entry.title}
      <br />
      <span className="text-muted">{entry.kind}</span>
      <br />
      <span className="tabular-nums">{entry.year}</span>
    </p>
  );
}

export default function Catalogue() {
  return (
    <main className="py-[var(--margin)] text-[1.0625rem]">
      <header className="page-grid mb-24 text-sm">
        <p className="col-span-6 md:col-span-4">{profile.name}</p>
        <p className="hidden text-muted md:col-span-2 md:block">
          {profile.role}
        </p>
        <nav className="col-span-6 flex justify-end gap-4 md:col-span-6">
          {nav.map((item) => (
            <a key={item} href="#top" className="hover:underline">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <h1 className="page-x mb-16 text-muted">Selected Work</h1>

      <div className="flex flex-col gap-16 md:gap-24">
        {pairs.map(([left, right], row) => (
          <div key={left.title} className="contents">
            {row === 3 && (
              <div className="flex gap-6 overflow-x-auto page-x [scrollbar-width:none]">
                {photoList.map((photo) => (
                  <Image
                    key={photo.alt}
                    src={photo.src}
                    alt={photo.alt}
                    placeholder="blur"
                    sizes="30vw"
                    className="h-[clamp(12rem,24vw,22rem)] w-auto shrink-0 object-cover grayscale transition-[filter] duration-300 hover:grayscale-0"
                  />
                ))}
              </div>
            )}
            <div className="page-grid">
              <div className="col-span-5 md:col-span-3">
                <Item entry={left} />
              </div>
              <span className="col-span-2 tabular-nums md:col-span-3">
                [{String(left.count).padStart(2, "0")}]
              </span>
              {right && (
                <div className="col-span-5 md:col-span-3">
                  <Item entry={right} />
                </div>
              )}
              {right && (
                <span className="hidden tabular-nums md:col-span-3 md:block">
                  [{String(right.count).padStart(2, "0")}]
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
