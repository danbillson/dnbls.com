"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { Lightbox } from "@/components/lightbox";
import type { Photo } from "@/lib/images";

type Place = {
  name: string;
  country: string;
  note: string;
  photos: Photo[];
};

type Template = {
  aspect: string;
  cols: string;
  rows: string;
  areas: string;
  /** Preferred orientation per slot, in `areas` order: p = portrait, l = landscape. */
  slots: ("p" | "l")[];
};

// Bento layouts by photo count, sized so each slot roughly matches its shape.
const templates: Record<number, Template> = {
  3: {
    aspect: "5 / 4",
    cols: "2fr 1fr",
    rows: "1fr 1fr",
    areas: `"a b" "a c"`,
    slots: ["p", "p", "p"],
  },
  4: {
    aspect: "5 / 4",
    cols: "repeat(6, 1fr)",
    rows: "1fr 1fr",
    areas: `"a a a a b b" "c c d d d d"`,
    slots: ["l", "p", "p", "l"],
  },
  5: {
    aspect: "5 / 4",
    cols: "1fr 1fr",
    rows: "repeat(3, 1fr)",
    areas: `"a b" "a c" "d e"`,
    slots: ["p", "l", "l", "l", "l"],
  },
};

const AREAS = "abcde";

/** Fill each slot with a photo of its shape where one's left, else whatever is. */
function arrange(photos: Photo[], slots: Template["slots"]) {
  const pools = {
    p: photos.filter((p) => p.height > p.width),
    l: photos.filter((p) => p.height <= p.width),
  };
  return slots.map((shape) => {
    const other = shape === "p" ? "l" : "p";
    return (pools[shape].shift() ?? pools[other].shift()) as Photo;
  });
}

/** Big list of places; hover (or tap/focus) one to swap in its photo bento. */
export function PlaceSwitcher({ places }: { places: Place[] }) {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState(0);
  const [open, setOpen] = useState(false);

  // Bento order is the viewing order, so the lightbox steps through it too.
  const arranged = places.map((p) => {
    const t = templates[p.photos.length];
    return {
      ...p,
      template: t,
      photos: t ? arrange(p.photos, t.slots) : p.photos,
    };
  });
  const current = arranged[active];

  return (
    <div data-reveal className="page-grid gap-y-10">
      <h3 className="rv-rise col-span-12 text-xs font-medium tracking-[0.08em] uppercase">
        Explore by place
      </h3>

      <ul className="col-span-12 md:col-span-6">
        {places.map((p, i) => (
          <li
            key={p.name}
            style={{ "--i": i + 1 } as CSSProperties}
            className="rv-mask"
          >
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              className={`rv-word flex items-start gap-3 text-left font-display text-[clamp(2.75rem,7vw,7rem)] leading-[1.02] font-semibold tracking-[-0.04em] transition-colors duration-150 outline-none focus-visible:underline ${i === active ? "text-foreground" : "text-muted"}`}
            >
              {p.name}
              <span className="mt-[0.9em] font-sans text-xs font-medium tracking-normal">
                {p.country}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <figure
        style={{ "--i": 2 } as CSSProperties}
        className="rv-rise col-span-12 flex flex-col gap-3 md:col-span-6 md:col-start-7 md:self-start"
      >
        {/* Every bento stays mounted in one cell so switching is instant. */}
        <div className="grid">
          {arranged.map((p, i) => (
            <div
              key={p.name}
              style={
                p.template && {
                  aspectRatio: p.template.aspect,
                  gridTemplateColumns: p.template.cols,
                  gridTemplateRows: p.template.rows,
                  gridTemplateAreas: p.template.areas,
                }
              }
              className={`grid gap-[var(--gutter)] [grid-area:1/1] ${p.template ? "" : "grid-cols-3"} ${i === active ? "" : "invisible"}`}
            >
              {p.photos.map((photo, j) => (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={`View ${p.name} photo ${j + 1}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => {
                    setViewing(j);
                    setOpen(true);
                  }}
                  style={p.template && { gridArea: AREAS[j] }}
                  className={`relative cursor-zoom-in overflow-hidden bg-foreground/5 ${p.template ? "" : "aspect-square"}`}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 60vw"
                    className="object-cover transition-transform duration-300 ease-out hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
        <figcaption
          aria-live="polite"
          className="max-w-[40ch] text-sm font-medium text-pretty"
        >
          {current.note}
        </figcaption>
      </figure>

      <Lightbox
        title={`${current.name}, ${current.country}`}
        photos={current.photos}
        index={viewing}
        open={open}
        onIndex={setViewing}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
