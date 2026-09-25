import Image from "next/image";
import { experience, links, photoList, profile, projects } from "@/lib/content";

const rows = [
  { label: "Role", value: profile.role },
  { label: "Currently", value: profile.currently.company },
  { label: "Based", value: profile.location },
];

export default function Split() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      <aside className="flex flex-col justify-between gap-16 border-rule p-[var(--margin)] text-sm lg:sticky lg:top-0 lg:h-dvh lg:border-r">
        <div>
          <h1 className="mb-6 uppercase">{profile.name}</h1>
          <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-3">
            {rows.map((r) => (
              <div key={r.label} className="contents">
                <dt className="text-muted">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
            <dt className="text-muted">About</dt>
            <dd className="max-w-[46ch] text-pretty">{profile.statement}</dd>
            <dt className="text-muted">Experience</dt>
            <dd>
              {experience.slice(0, 4).map((e) => (
                <p key={e.company}>
                  {e.company}{" "}
                  <span className="text-muted">
                    {e.role}, {e.years}
                  </span>
                </p>
              ))}
            </dd>
            <dt className="text-muted">Elsewhere</dt>
            <dd>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="block hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </dd>
          </dl>
        </div>

        <nav aria-label="Selected work">
          <p className="mb-1 pl-[calc(7rem+1rem)] text-muted">Selected Work</p>
          <ol className="grid grid-cols-[7rem_1fr] gap-x-4">
            {projects.map((p, i) => (
              <li key={p.title} className="group contents">
                <span className="flex items-center tabular-nums">
                  {i === 0 ? (
                    <span className="size-3 bg-foreground" aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <a href={p.href} className="py-px group-hover:underline">
                  {p.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <main className="flex flex-col gap-[var(--gutter)] p-[var(--margin)]">
        <p className="text-right text-sm uppercase">About</p>
        {photoList.map((photo, i) => (
          <figure key={photo.alt}>
            {i % 3 === 1 ? (
              <div className="flex aspect-[4/3] items-center justify-center bg-[#e8e6e1]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="h-3/4 w-auto object-contain shadow-sm"
                />
              </div>
            ) : (
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                preload={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            )}
            <figcaption className="mt-1 flex justify-between text-xs text-muted">
              <span>{photo.alt}</span>
              <span className="tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </main>
    </div>
  );
}
