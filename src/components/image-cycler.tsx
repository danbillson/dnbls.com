"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/images";

/**
 * Hard-cut slideshow (à la paulkalkbrenner.net). Every frame stays mounted so
 * swaps are instant; only the active one is visible. Static under reduced motion
 * and paused while the tab is hidden.
 */
export function ImageCycler({
  images,
  interval = 800,
  sizes,
  className = "",
}: {
  images: Pick<Photo, "src" | "alt">[];
  interval?: number;
  sizes: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
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
  }, [images.length, interval]);

  return images.map((image, i) => (
    <Image
      key={image.src}
      src={image.src}
      alt={i === index ? image.alt : ""}
      aria-hidden={i !== index}
      fill
      sizes={sizes}
      loading="eager"
      fetchPriority={i === 0 ? "high" : "low"}
      className={`object-cover ${i === index ? "" : "invisible"} ${className}`}
    />
  ));
}
