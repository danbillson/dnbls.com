"use client";

import {
  createElement,
  Fragment,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./scramble.css";

export type ScrambleHit = {
  /** Normalised distance from the pointer: 0 under the cursor, 1 at the edge. */
  t: number;
  char: string;
};

/** The full look of a hit char. Anything omitted is the original. */
export type ScrambleMutation = {
  glyph?: string;
  color?: string;
  background?: string;
  weight?: number | string;
} | null;

export type ScrambleProps = {
  as?: "span" | "p" | "h1" | "h2" | "div";
  children: string;
  /** Hit radius around the pointer, px. */
  radius?: number;
  /** How long a hit char stays mutated, ms. */
  hold?: number;
  /** What a hit char becomes. Return null to leave it alone. Default: `spectrum`. */
  mutate?: (hit: ScrambleHit) => ScrambleMutation;
  /** Re-run `mutate` on a hit char every `tick` ms until it's released. */
  tick?: number;
  /** How a char comes back: instantly, colour fades, or a short glyph flicker. */
  revert?: "snap" | "fade" | "decode";
  /**
   * Re-hit a mutated char when the pointer gets this much closer (in t) than
   * when it was hit, so a wide radius can grade by distance. 0 = never.
   */
  escalate?: number;
  /**
   * Anchor a single-line text so mutated glyphs push it outwards in one
   * direction, leaving whatever sits on the other side untouched.
   */
  grow?: "left" | "right";
  /** Whole-word stand-ins, keyed by the lowercase word without punctuation. */
  swaps?: Record<string, ReactNode>;
  /** Chance a hovered word with a stand-in shows it instead, per pass. */
  swapChance?: number;
  className?: string;
  [data: `data-${string}`]: string | undefined;
};

const wordKey = (word: string) =>
  word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const isCore = (ch: string) => /[\p{L}\p{N}]/u.test(ch);

const pick = <T,>(list: readonly T[]) =>
  list[Math.floor(Math.random() * list.length)];

// Look-alikes: keeps the word's silhouette readable.
const SHAPE: Record<string, string> = {
  a: "@4^",
  b: "6&",
  c: "(<",
  d: "6",
  e: "3€",
  f: "#",
  g: "9&",
  h: "#",
  i: "1!|",
  j: "]",
  k: "<",
  l: "1|",
  m: "^",
  n: ">",
  o: "0*",
  p: "9",
  q: "9",
  r: "?",
  s: "5$",
  t: "+7",
  u: "_",
  v: "^",
  w: "^",
  x: "%*",
  y: "?",
  z: "2",
  A: "4^",
  B: "8",
  C: "(",
  D: "0",
  E: "3",
  G: "6",
  I: "1|",
  K: "<",
  L: "|",
  O: "0",
  S: "5$",
  T: "7",
  V: "^",
  Z: "2",
  "0": "O",
  "1": "I",
  "2": "Z",
  "3": "E",
  "5": "S",
  "8": "B",
};
export const shapeSwap = (ch: string) => {
  const s = SHAPE[ch];
  return s ? pick([...s]) : undefined;
};

// Tuned for the light background: saturated enough to read at body size.
const PALETTE = [
  "#ffb400",
  "#ff6a00",
  "#ff2e7e",
  "#8a4dff",
  "#9a7bff",
  "#3ea63a",
  "#2f6df6",
  "#e0141c",
];

/** Random palette colour, and about a third of the time a look-alike glyph. */
export const spectrum = ({ char }: ScrambleHit): ScrambleMutation => ({
  color: pick(PALETTE),
  glyph: Math.random() < 0.35 ? shapeSwap(char) : undefined,
});

const DECODE = "#%&?*+<>/=";

type Slot = {
  el: HTMLElement;
  char: string;
  x: number;
  y: number;
  busy: boolean;
  /** Distance the current mutation was made at. */
  t: number;
  timer?: number;
  ticker?: number;
  word?: Word;
};

type Word = {
  el: HTMLElement;
  chars: Slot[];
  /** Has a stand-in to show. */
  alt: boolean;
  /** Dice already rolled for the current pass. */
  rolled: boolean;
  /** Stand-in currently showing. */
  on: boolean;
  timer?: number;
};

type Lines = { text: string; rows: string[][] };

/**
 * Text whose characters mutate as the pointer passes near them, then settle
 * back after `hold`. Line breaks are frozen from the natural layout, so a
 * swapped glyph pushes its line longer rather than rewrapping it. Selecting
 * any of the text snaps it all back to the real string. Pointer-only (no
 * touch) and DOM-driven: nothing re-renders on pointermove.
 */
export function Scramble({
  as = "span",
  children: text,
  radius = 80,
  hold = 2000,
  mutate = spectrum,
  tick = 0,
  revert = "snap",
  escalate = 0,
  grow,
  swaps,
  swapChance = 0.1,
  className,
  ...rest
}: ScrambleProps) {
  const root = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<Lines | null>(null);
  const fixed = lines?.text === text ? lines : null;
  const words = text.split(" ");
  const rows = fixed?.rows ?? [words];

  // Freeze the natural line breaks; redo on resize and once fonts land.
  useLayoutEffect(() => {
    if (fixed) return;
    const el = root.current;
    if (!el) return;
    const out: string[][] = [];
    let top = Number.NaN;
    el.querySelectorAll<HTMLElement>("[data-w]").forEach((w, i) => {
      const t = Math.round(w.getBoundingClientRect().top);
      if (t !== top) {
        top = t;
        out.push([]);
      }
      out[out.length - 1].push(words[i]);
    });
    setLines({ text, rows: out });
  }, [fixed, text, words]);

  useEffect(() => {
    let frame = 0;
    const reflow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLines(null));
    };
    window.addEventListener("resize", reflow);
    if (document.fonts?.status !== "loaded") document.fonts?.ready.then(reflow);
    return () => {
      window.removeEventListener("resize", reflow);
      cancelAnimationFrame(frame);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-query the DOM when rows change
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const slots: Slot[] = [
      ...el.querySelectorAll<HTMLElement>("[data-char]"),
    ].map((c) => ({
      el: c,
      char: c.dataset.char ?? "",
      x: 0,
      y: 0,
      busy: false,
      t: 1,
    }));
    const words: Word[] = [...el.querySelectorAll<HTMLElement>("[data-w]")].map(
      (w) => {
        const word: Word = {
          el: w,
          chars: slots.filter((c) => w.contains(c.el)),
          alt: !!w.querySelector("[data-alt]"),
          rolled: false,
          on: false,
        };
        for (const c of word.chars) c.word = word;
        return word;
      },
    );
    let dirty = true;
    let selecting = false;

    // Char centres relative to the root, so scrolling doesn't invalidate them.
    const measure = (base: DOMRect) => {
      for (const s of slots) {
        const r = s.el.getBoundingClientRect();
        s.x = r.left + r.width / 2 - base.left;
        s.y = r.top + r.height / 2 - base.top;
      }
      dirty = false;
    };
    const invalidate = () => {
      dirty = true;
    };
    const ro = new ResizeObserver(invalidate);
    ro.observe(el);

    const apply = (s: Slot, m: NonNullable<ScrambleMutation>) => {
      s.el.style.color = m.color ?? "";
      s.el.style.backgroundColor = m.background ?? "";
      s.el.style.fontWeight = m.weight == null ? "" : String(m.weight);
      s.el.textContent = reduce ? s.char : (m.glyph ?? s.char);
    };

    const settle = (s: Slot) => {
      window.clearTimeout(s.timer);
      window.clearInterval(s.ticker);
      s.el.textContent = s.char;
      s.el.style.color = "";
      s.el.style.backgroundColor = "";
      s.el.style.fontWeight = "";
      delete s.el.dataset.hit;
      s.busy = false;
      const w = s.word;
      if (w && !w.on && !w.chars.some((c) => c.busy)) w.rolled = false;
      // Glyphs change width: neighbours have moved.
      dirty = true;
    };

    const unflip = (w: Word) => {
      window.clearTimeout(w.timer);
      delete w.el.dataset.altOn;
      w.on = false;
      w.rolled = false;
      for (const c of w.chars) c.busy = false;
      dirty = true;
    };

    /** Show the word's stand-in for the hold; its chars sit out meanwhile. */
    const flip = (w: Word) => {
      for (const c of w.chars) settle(c);
      w.on = true;
      w.rolled = true;
      for (const c of w.chars) c.busy = true;
      w.el.dataset.altOn = "";
      w.timer = window.setTimeout(() => unflip(w), hold);
      dirty = true;
    };

    const release = (s: Slot) => {
      window.clearInterval(s.ticker);
      const swapped = s.el.textContent !== s.char;
      if (revert !== "decode" || !swapped || reduce) return settle(s);
      const flick = () => DECODE[Math.floor(Math.random() * DECODE.length)];
      s.el.textContent = flick();
      s.timer = window.setTimeout(() => {
        s.el.textContent = flick();
        s.timer = window.setTimeout(() => settle(s), 50);
      }, 50);
    };

    const hit = (s: Slot, t: number) => {
      const m = mutate({ t, char: s.char });
      if (!m) return;
      window.clearTimeout(s.timer);
      window.clearInterval(s.ticker);
      s.busy = true;
      s.t = t;
      s.el.dataset.hit = "";
      apply(s, m);
      dirty = true;
      if (tick > 0)
        s.ticker = window.setInterval(() => {
          const next = mutate({ t: s.t, char: s.char });
          if (next) apply(s, next);
          dirty = true;
        }, tick);
      s.timer = window.setTimeout(() => release(s), hold);
    };

    let frame = 0;
    let px = 0;
    let py = 0;
    const tickFrame = () => {
      frame = 0;
      if (selecting) return;
      const base = el.getBoundingClientRect();
      if (
        px < base.left - radius ||
        px > base.right + radius ||
        py < base.top - radius ||
        py > base.bottom + radius
      )
        return;
      if (dirty) measure(base);
      const x = px - base.left;
      const y = py - base.top;
      for (const s of slots) {
        const t = Math.hypot(s.x - x, s.y - y) / radius;
        if (t >= 1) continue;
        if (!(!s.busy || (escalate > 0 && t < s.t - escalate))) continue;
        const w = s.word;
        if (w?.alt && !w.rolled) {
          w.rolled = true;
          if (Math.random() < swapChance) {
            flip(w);
            continue;
          }
        }
        hit(s, t);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(tickFrame);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    // Highlighting the text reveals the real string; hits pause until it's cleared.
    const onSelect = () => {
      const sel = document.getSelection();
      const touching =
        !!sel &&
        !sel.isCollapsed &&
        sel.rangeCount > 0 &&
        sel.getRangeAt(0).intersectsNode(el);
      if (touching && !selecting) {
        for (const w of words) if (w.on) unflip(w);
        for (const s of slots) if (s.busy) settle(s);
      }
      selecting = touching;
    };
    document.addEventListener("selectionchange", onSelect);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("selectionchange", onSelect);
      cancelAnimationFrame(frame);
      ro.disconnect();
      for (const w of words) unflip(w);
      for (const s of slots) settle(s);
    };
  }, [radius, hold, mutate, tick, revert, escalate, swapChance, fixed]);

  const live = (
    <span
      aria-hidden
      className={
        grow
          ? `absolute inset-y-0 whitespace-nowrap ${grow === "left" ? "right-0" : "left-0"}`
          : undefined
      }
    >
      {rows.map((row, r) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static text, order is identity
          key={r}
          className={
            fixed && rows.length > 1 ? "block whitespace-nowrap" : undefined
          }
        >
          {row.map((word, i) => {
            const alt = swaps?.[wordKey(word)];
            const chars = [...word];
            // Stand-in goes where the letters were; punctuation keeps its place.
            const last = alt ? chars.findLastIndex(isCore) : -1;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static text, order is identity
              <Fragment key={i}>
                {i > 0 && " "}
                <span data-w className="whitespace-nowrap">
                  {chars.map((ch, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static text, order is identity
                    <Fragment key={j}>
                      <span
                        data-char={ch}
                        data-core={alt && isCore(ch) ? "" : undefined}
                      >
                        {ch}
                      </span>
                      {j === last && <span data-alt>{alt}</span>}
                    </Fragment>
                  ))}
                </span>
              </Fragment>
            );
          })}
        </span>
      ))}
    </span>
  );

  const body: ReactNode = (
    <>
      {/* select-none keeps the hidden copies out of what gets copied. */}
      <span className="sr-only select-none">{text}</span>
      {/* Anchored: an invisible copy holds the natural width, the live text overflows it. */}
      {grow && (
        <span aria-hidden className="invisible select-none">
          {text}
        </span>
      )}
      {live}
    </>
  );

  return createElement(
    as,
    {
      ...rest,
      ref: root,
      className: grow
        ? `relative inline-block whitespace-nowrap ${className ?? ""}`
        : className,
      "data-scramble": "",
      "data-revert": revert,
    },
    body,
  );
}
