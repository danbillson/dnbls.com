"use client";

import "./reveal.css";
import { useEffect } from "react";

/**
 * Scroll-triggered reveals. Any `[data-reveal]` element gets `data-in` the
 * first time it crosses into the lower 85% of the viewport; `reveal.css` then
 * plays its `.rv-*` children. Render `[data-reveal][data-in]` server-side for
 * above-the-fold content so the same rules double as the load intro.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-in])",
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);
  return null;
}
