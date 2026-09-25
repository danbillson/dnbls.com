"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Hard-cut slideshow (à la paulkalkbrenner.net). Every frame stays mounted so
 * swaps are instant; only the current one is visible. Decorative — the parent
 * carries the meaning. Static under reduced motion, paused while the tab is
 * hidden or `active` is false.
 */
export function ImageCycler({
  images,
  interval = 1000,
  active = true,
  sizes,
  eager = false,
  className = "",
}: {
  images: { src: string }[];
  interval?: number;
  active?: boolean;
  sizes: string;
  /** Load every frame up front (hero). Otherwise the browser decides. */
  eager?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id: number | undefined;
    const start = () => {
      window.clearInterval(id);
      id = window.setInterval(
        () => setIndex((i) => (i + 1) % images.length),
        interval,
      );
    };
    const onVisibility = () =>
      document.hidden ? window.clearInterval(id) : start();

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, images.length, interval]);

  return images.map((image, i) => (
    <Image
      key={image.src}
      src={image.src}
      alt=""
      fill
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      fetchPriority={eager && i === 0 ? "high" : undefined}
      className={`object-cover ${i === index ? "" : "invisible"} ${className}`}
    />
  ));
}
