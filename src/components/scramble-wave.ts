import { animate } from "motion";
import { spectrum } from "@/components/scramble";

const outQuint = [0.22, 1, 0.36, 1] as const;

/**
 * Entrance for a `Scramble`'s text: words rise out of their line masks in
 * reading order, letters tinted from the hover palette, and the colour drains
 * to ink a beat behind the rise. Rides on the Scramble's frozen line breaks
 * (rows) so nothing rewraps. `finish()` jumps everything to its final state.
 */
export function wordsIn(
  el: HTMLElement,
  { step = 28, rise = 0.7, drain = 380 } = {},
) {
  const words = [...el.querySelectorAll<HTMLElement>("[data-w]")];
  const rows = [...new Set(words.map((w) => w.parentElement))].filter(
    (r): r is HTMLElement => !!r,
  );
  const chars = words.map((w) => [
    ...w.querySelectorAll<HTMLElement>("[data-char]"),
  ]);
  const timers: number[] = [];
  let finished = false;

  for (const r of rows) r.style.clipPath = "inset(0 -0.2em -0.25em)";
  words.forEach((w, i) => {
    w.style.display = "inline-block";
    for (const c of chars[i])
      c.style.color =
        spectrum({ t: 0, char: c.dataset.char ?? "" })?.color ?? "";
  });

  const controls = words.map((w, i) =>
    animate(
      w,
      { transform: ["translateY(120%)", "translateY(0%)"] },
      { duration: rise, ease: outQuint, delay: (i * step) / 1000 },
    ),
  );
  words.forEach((_, i) => {
    timers.push(
      window.setTimeout(
        () => {
          for (const c of chars[i]) c.style.color = "";
        },
        i * step + drain,
      ),
    );
  });
  const last = (words.length - 1) * step + Math.max(rise * 1000, drain);
  timers.push(window.setTimeout(() => cleanup(), last + 50));

  const cleanup = () => {
    if (finished) return;
    finished = true;
    for (const t of timers) window.clearTimeout(t);
    for (const c of controls) {
      c.complete();
      c.stop();
    }
    for (const r of rows) r.style.clipPath = "";
    words.forEach((w, i) => {
      w.style.display = "";
      w.style.transform = "";
      for (const c of chars[i]) c.style.color = "";
    });
  };

  return { finish: cleanup };
}
