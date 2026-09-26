"use client";

import type { CSSProperties } from "react";
import { Scramble, type ScrambleMutation } from "@/components/scramble";

const FRUIT = [..."🍎🍐🍊🍋🍌🍉🍇🍓🫐🍒🍑🥭🍍🥝🍈"];
const fruit = (): ScrambleMutation => ({
  glyph: FRUIT[Math.floor(Math.random() * FRUIT.length)],
});

/**
 * Stepped, hyphenated section heading: `mark` hangs left of the second line.
 * Rows overlap at this leading, so each darkens onto the one above —
 * otherwise a row's selection highlight paints over the glyphs above it.
 *
 * Client component: `mutate` is a function prop, which can't cross the
 * server boundary. Kept apart from `ledger.tsx` so `cell` stays a plain
 * string on the server — exported from a client module it becomes a
 * client-reference stub.
 */
export function LedgerHeading({
  mark,
  lines,
}: {
  mark: string;
  lines: [string, string, string];
}) {
  const [first, second, third] = lines;
  return (
    <h2
      data-reveal
      className="page-grid font-display text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.92] font-semibold tracking-[-0.04em] [--rv-step:110ms] [--rv-word-ms:600ms]"
    >
      <span className="rv-mask col-span-9 col-start-4 mix-blend-darken">
        <span className="rv-word block">
          <Scramble radius={120} grow="right">
            {first}
          </Scramble>
        </span>
      </span>
      <span
        style={{ "--i": 1 } as CSSProperties}
        className="rv-mask col-span-2 col-start-2 row-start-2 mix-blend-darken"
        aria-hidden
      >
        <span className="rv-word block">
          <Scramble radius={120} grow="right" mutate={fruit}>
            {mark}
          </Scramble>
        </span>
      </span>
      <span
        style={{ "--i": 1 } as CSSProperties}
        className="rv-mask col-span-9 col-start-4 row-start-2 mix-blend-darken"
      >
        <span className="rv-word block">
          <Scramble radius={120} grow="right">
            {second}
          </Scramble>
        </span>
      </span>
      <span
        style={{ "--i": 2 } as CSSProperties}
        className="rv-mask col-span-7 col-start-6 row-start-3 mix-blend-darken"
      >
        <span className="rv-word block">
          <Scramble radius={120} grow="right">
            {third}
          </Scramble>
        </span>
      </span>
    </h2>
  );
}
