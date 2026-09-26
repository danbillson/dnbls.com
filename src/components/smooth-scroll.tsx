"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

/**
 * Jump straight to a scroll position. Goes through Lenis when it's running so
 * an in-flight smooth scroll can't drag the page back on its next frame.
 */
export function jumpTo(top: number) {
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: "instant" });
}

/**
 * Inertial scrolling for the whole site. Light lerp so it reads as weight,
 * not lag. Off under reduced motion, where native scrolling wins.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
    lenis = instance;
    return () => {
      instance.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
