"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";

// Ignore sub-pixel jitter and Lenis settling frames.
const MIN_DELTA = 4;

/**
 * Fixed copy of the site header that slides in while scrolling up and away
 * while scrolling down. Within its own height of the top it stops reacting
 * to direction and its shadow fades; at zero it's swapped out instantly for
 * the in-flow header, which sits in the same spot, so it simply scrolls away
 * with the page. Not on /work: the sidebar already pins the logo there.
 */
export function PeekHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [near, setNear] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const h = ref.current?.offsetHeight ?? 0;
        const dy = y - last;
        setNear(y < h);
        if (y <= 0) {
          setShown(false);
        } else if (Math.abs(dy) >= MIN_DELTA) {
          // Once shown near the top it covers the in-flow header, so hold it
          // there; elsewhere direction decides, and it only enters past `h`
          // so the two never overlap half-shown.
          setShown((s) => (s && y < h) || (dy < 0 && y > h));
        }
        last = y;
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
  useEffect(() => {
    setShown(false);
    setNear(true);
  }, [pathname]);

  if (pathname.startsWith("/work")) return null;

  return (
    <div
      ref={ref}
      data-shown={shown || undefined}
      data-near={near || undefined}
      inert={!shown}
      className="peek-header fixed inset-x-0 top-0 z-40 bg-background py-[var(--margin)] print:hidden"
    >
      <SiteHeader />
    </div>
  );
}
