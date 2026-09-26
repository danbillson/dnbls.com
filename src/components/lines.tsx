"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

/**
 * Paragraphs whose visual lines rise out of their own masks, staggered by
 * `--i` across the whole block (see reveal.css). Lines only exist after
 * layout, so words render individually first, get grouped by row, then
 * re-render as line blocks — all before paint. A resize re-splits without
 * replaying.
 */
export function Lines({
  paragraphs,
  className,
  style,
}: {
  paragraphs: string[];
  className?: string;
  style?: CSSProperties;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[][] | null>(null);
  const settled = useRef(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || lines) return;
    const out: string[][] = [];
    for (const p of el.querySelectorAll("p")) {
      const rows: string[] = [];
      let top: number | null = null;
      for (const w of p.querySelectorAll<HTMLElement>("[data-w]")) {
        const t = Math.round(w.getBoundingClientRect().top);
        if (t === top) rows[rows.length - 1] += ` ${w.textContent}`;
        else rows.push(w.textContent ?? "");
        top = t;
      }
      out.push(rows);
    }
    setLines(out);
  }, [lines]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let width = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      settled.current = true;
      setLines(null);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let i = 0;
  return (
    <div
      ref={root}
      style={style}
      className={`rv-lines ${className ?? ""}`}
      data-split={lines ? "" : undefined}
      data-settled={settled.current ? "" : undefined}
    >
      {paragraphs.map((para, p) => (
        <p key={para}>
          {lines
            ? lines[p]?.map((line, l) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
                  key={l}
                  style={{ "--i": i++ } as CSSProperties}
                  className="rv-mask block"
                >
                  <span className="rv-word block">{line}</span>
                </span>
              ))
            : para.split(" ").map((word, w) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: measurement only
                <span key={w} data-w>
                  {word}{" "}
                </span>
              ))}
        </p>
      ))}
    </div>
  );
}
