import Image from "next/image";
import type { Photo } from "@/lib/images";

export type Span = [cols: number, rows: number];

/**
 * Horizontally scrolling bento: a two-row grid packed densely, tiles spanning
 * 1–2 cells each way. `spans[i]` sets the tile for `photos[i]`; unset tiles
 * fall back to 1×2 for portraits and 1×1 for landscapes.
 */
export function PhotoBento({
  photos,
  spans = [],
}: {
  photos: Photo[];
  spans?: Span[];
}) {
  return (
    <ul className="grid snap-x snap-mandatory auto-cols-[var(--cell)] grid-flow-col-dense grid-rows-[repeat(2,var(--cell))] scroll-px-[var(--margin)] gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] [--cell:clamp(7rem,14vw,14rem)] [scrollbar-width:none]">
      {photos.map((p, i) => {
        const [cols, rows] = spans[i] ?? (p.height > p.width ? [1, 2] : [1, 1]);
        return (
          <li
            key={p.src}
            style={{ gridColumn: `span ${cols}`, gridRow: `span ${rows}` }}
            className="relative snap-start bg-foreground/5"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes={
                cols > 1
                  ? "(min-width: 1024px) 28vw, 45vw"
                  : "(min-width: 1024px) 14vw, 25vw"
              }
              className="object-cover"
            />
          </li>
        );
      })}
    </ul>
  );
}
