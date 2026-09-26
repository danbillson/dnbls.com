"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photo } from "@/lib/images";

/**
 * Full-screen photo viewer on the page background. Native <dialog>, so focus
 * trapping and Esc come free; arrows step through, clicking the margin closes.
 */
export function Lightbox({
  title,
  photos,
  index,
  open,
  onIndex,
  onClose,
}: {
  title: string;
  photos: Photo[];
  index: number;
  open: boolean;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const photo = photos[index];
  const step = (delta: number) =>
    onIndex((index + delta + photos.length) % photos.length);
  const touchX = useRef<number | null>(null);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const from = touchX.current;
        touchX.current = null;
        const to = e.changedTouches[0]?.clientX;
        if (from === null || to === undefined) return;
        if (Math.abs(to - from) > 40) step(to < from ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-dvw max-w-none flex-col overscroll-contain bg-background text-sm font-medium text-foreground opacity-0 transition-[opacity,display,overlay] transition-discrete duration-200 backdrop:bg-transparent open:flex open:opacity-100 motion-reduce:transition-none starting:open:opacity-0"
    >
      <div className="page-grid items-center py-[var(--margin)]">
        <p className="col-span-8">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="col-span-4 -my-3 justify-self-end py-3 hover:underline"
        >
          Close
        </button>
      </div>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click is a pointer shortcut; Esc and Close cover keyboard */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: as above */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="flex min-h-0 flex-1 items-center justify-center px-[var(--margin)]"
      >
        {photo && (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="h-[calc(100dvh-7rem)] w-auto max-w-full object-contain"
          />
        )}
      </div>

      <div className="page-grid items-center py-[var(--margin)]">
        <p aria-live="polite" className="col-span-6 text-muted tabular-nums">
          {index + 1} / {photos.length}
        </p>
        <div className="col-span-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            className="-my-3 py-3 hover:underline"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="-my-3 py-3 hover:underline"
          >
            Next
          </button>
        </div>
      </div>
    </dialog>
  );
}
