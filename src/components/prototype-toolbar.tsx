"use client";

import { useEffect, useState } from "react";
import {
  type BodyFont,
  bodyFonts,
  FONT_KEY,
  GRID_KEY,
} from "@/lib/font-options";

export function PrototypeToolbar() {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState<BodyFont>("inter");
  const [grid, setGrid] = useState(false);

  // Pick up whatever the init script applied before hydration.
  useEffect(() => {
    const d = document.documentElement.dataset;
    if (d.font) setFont(d.font as BodyFont);
    setGrid(d.grid === "1");
  }, []);

  function applyFont(next: BodyFont) {
    setFont(next);
    document.documentElement.dataset.font = next;
    localStorage.setItem(FONT_KEY, next);
  }

  function applyGrid(next: boolean) {
    setGrid(next);
    if (next) document.documentElement.dataset.grid = "1";
    else delete document.documentElement.dataset.grid;
    localStorage.setItem(GRID_KEY, next ? "1" : "0");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "g")
        applyGrid(document.documentElement.dataset.grid !== "1");
      if (e.key === "f") {
        const current = document.documentElement.dataset.font ?? "inter";
        const i = bodyFonts.findIndex((f) => f.id === current);
        applyFont(bodyFonts[(i + 1) % bodyFonts.length].id);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const label = bodyFonts.find((f) => f.id === font)?.label;

  return (
    <div className="fixed top-1/2 right-0 z-50 flex -translate-y-1/2 flex-row-reverse items-center gap-2 font-[family-name:var(--font-inter)] text-xs">
      {open && (
        <div className="w-56 bg-foreground p-3 text-background shadow-lg">
          <p className="mb-1 text-background/50">Body font (F)</p>
          <div className="mb-3 grid grid-cols-2 gap-1">
            {bodyFonts.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFont(f.id)}
                className={`px-2 py-1 text-left ${font === f.id ? "bg-accent text-foreground" : "bg-background/10 hover:bg-background/20"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center justify-between">
            <span>Grid overlay (G)</span>
            <input
              type="checkbox"
              checked={grid}
              onChange={(e) => applyGrid(e.target.checked)}
              className="accent-[var(--accent)]"
            />
          </label>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="bg-foreground px-1.5 py-3 text-background [writing-mode:vertical-rl] hover:bg-foreground/85"
      >
        Aa · {label}
      </button>
    </div>
  );
}
