"use client";

import { useEffect, useState } from "react";

/** Dev-only 12-col overlay matching `page-grid`. Toggle with G. */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key !== "g") return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      setVisible((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 page-grid"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static columns
          key={i}
          className="h-full bg-[color-mix(in_oklab,red_8%,transparent)]"
        />
      ))}
    </div>
  );
}
