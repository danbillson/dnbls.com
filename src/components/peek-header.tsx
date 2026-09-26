"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

// Past the in-flow header's own height, so the fixed copy never overlaps it.
const PAST_TOP = 96;
// Ignore sub-pixel jitter and Lenis settling frames.
const MIN_DELTA = 4;

/**
 * Fixed copy of the site header that slides in while scrolling up and away
 * while scrolling down. Hidden at the top of the page, where the in-flow
 * header is in the same spot, so the swap is invisible. Not on /work: the
 * sidebar already pins the logo there.
 */
export function PeekHeader() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const dy = y - last;
        if (Math.abs(dy) < MIN_DELTA) return;
        last = y;
        setShown(dy < 0 && y > PAST_TOP);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Route change lands at the top; start hidden rather than mid-slide.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => setShown(false), [pathname]);

  if (pathname.startsWith("/work")) return null;

  return (
    <div
      data-shown={shown || undefined}
      inert={!shown}
      className="peek-header fixed inset-x-0 top-0 z-40 border-rule border-b bg-background py-[var(--margin)]"
    >
      <SiteHeader />
    </div>
  );
}
