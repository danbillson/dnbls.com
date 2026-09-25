"use client";

import { type PointerEvent, useRef, useState } from "react";
import { ImageCycler } from "@/components/image-cycler";
import { cell, LedgerTable } from "@/components/ledger";

type Row = {
  company: string;
  role: string;
  years: string;
  short: string;
  photos: { src: string }[];
};

const OFFSET = 24;

/** Ledger of roles. Hovering a row floats that company's photos by the cursor. */
export function WorkTable({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  function follow(e: PointerEvent) {
    const el = previewRef.current;
    if (!el) return;
    const { offsetWidth: w, offsetHeight: h } = el;
    // Flip to the left of the cursor near the right edge.
    const x =
      e.clientX + OFFSET + w > window.innerWidth
        ? e.clientX - OFFSET - w
        : e.clientX + OFFSET;
    el.style.transform = `translate3d(${x}px, ${e.clientY - h / 2}px, 0)`;
  }

  function onPointerOver(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const row = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-company]",
    );
    if (row) setActive(row.dataset.company ?? null);
    follow(e);
  }

  return (
    <>
      <div
        onPointerOver={onPointerOver}
        onPointerMove={(e) => e.pointerType === "mouse" && follow(e)}
        onPointerLeave={() => setActive(null)}
      >
        <LedgerTable>
          {rows.map((r) => {
            // Other rows recede while one is hovered.
            const dim = `transition-colors duration-150 ${active && active !== r.company ? "text-muted" : ""}`;
            return (
              <div
                key={r.company}
                data-company={r.company}
                className="contents"
              >
                <span className={`${cell} col-span-2 tabular-nums ${dim}`}>
                  {r.short}
                </span>
                <span className={`${cell} col-span-4 md:col-span-3 ${dim}`}>
                  {r.company}
                </span>
                <span className={`${cell} col-span-6 md:col-span-4 ${dim}`}>
                  {r.role}
                </span>
                <span
                  className={`${cell} hidden text-muted md:col-span-1 md:block`}
                >
                  {r.years}
                </span>
              </div>
            );
          })}
        </LedgerTable>
      </div>

      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 aspect-[4/3] w-[clamp(14rem,22vw,22rem)]"
      >
        {rows.map((r) =>
          r.photos.length ? (
            <div
              key={r.company}
              className={`absolute inset-0 bg-foreground/5 ${active === r.company ? "" : "invisible"}`}
            >
              <ImageCycler
                images={r.photos}
                interval={1000}
                active={active === r.company}
                sizes="(min-width: 1024px) 22vw, 14rem"
                className="grayscale"
              />
            </div>
          ) : null,
        )}
      </div>
    </>
  );
}
