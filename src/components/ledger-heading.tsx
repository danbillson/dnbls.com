"use client";

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
    <h2 className="page-grid font-display text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
      <span className="col-span-9 col-start-4 mix-blend-darken">
        <Scramble radius={120} grow="right">
          {first}
        </Scramble>
      </span>
      <span
        className="col-span-2 col-start-2 row-start-2 mix-blend-darken"
        aria-hidden
      >
        <Scramble radius={120} grow="right" mutate={fruit}>
          {mark}
        </Scramble>
      </span>
      <span className="col-span-9 col-start-4 row-start-2 mix-blend-darken">
        <Scramble radius={120} grow="right">
          {second}
        </Scramble>
      </span>
      <span className="col-span-7 col-start-6 row-start-3 mix-blend-darken">
        <Scramble radius={120} grow="right">
          {third}
        </Scramble>
      </span>
    </h2>
  );
}
