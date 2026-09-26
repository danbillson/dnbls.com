import Image from "next/image";
import type { Photo } from "@/lib/images";

/**
 * Full-bleed row of photos at their natural ratio, running off the right edge
 * (à la paulkalkbrenner.net). Portraits sit a touch shorter than landscapes,
 * top-aligned, so the row steps rather than lines up.
 */
export function PhotoStrip({ photos }: { photos: Photo[] }) {
  return (
    <ul className="flex snap-x snap-mandatory scroll-px-[var(--margin)] items-start gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] [--strip-h:clamp(16rem,32vw,32rem)] [scrollbar-width:none]">
      {photos.map((p) => (
        <li
          key={p.src}
          style={{ aspectRatio: `${p.width} / ${p.height}` }}
          className={`relative shrink-0 snap-start bg-foreground/5 ${p.height > p.width ? "h-[calc(var(--strip-h)*0.88)]" : "h-[var(--strip-h)]"}`}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 32vw, 60vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
