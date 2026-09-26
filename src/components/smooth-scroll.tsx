"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial scrolling for the whole site. Light lerp so it reads as weight,
 * not lag. Off under reduced motion, where native scrolling wins.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
