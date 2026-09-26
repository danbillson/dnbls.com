import type { AnimationSequence } from "motion/react";

// Hero opening sequence: the words slide up out of their line, then the
// photo up into the slot, then the chrome.

export type IntroCtx = {
  el: {
    slotInner: HTMLElement;
    dan: HTMLElement;
    billson: HTMLElement;
    logo: HTMLElement;
    nav: HTMLElement[];
    intro: HTMLElement;
    arrow: HTMLElement;
  };
};

type Segment = AnimationSequence[number];
type Bezier = [number, number, number, number];

const outQuint: Bezier = [0.22, 1, 0.36, 1];

const rise = (el: Element, y: string, at: number, duration = 0.7): Segment => [
  el,
  { opacity: [0, 1], transform: [`translateY(${y})`, "translateY(0px)"] },
  { duration, ease: outQuint, at },
];

// Chrome (logo, nav, intro line, arrow) starts once the wordmark has landed.
const CHROME = 0.55;

/**
 * When the intro line fades in (s). The hero starts its word stagger (see
 * scramble-wave.ts) at this moment; the line itself only fades, since the
 * stagger is the entrance.
 */
export const introAt = CHROME + 0.08;

/** Words slide up out of their line, then the photo up into the slot. */
function brief(c: IntroCtx): AnimationSequence {
  const up = (el: Element, at: number, duration = 0.8): Segment => [
    el,
    { transform: ["translateY(110%)", "translateY(0%)"] },
    { duration, ease: outQuint, at },
  ];

  return [
    up(c.el.dan, 0.1),
    up(c.el.billson, 0.16),
    up(c.el.slotInner, 0.35, 0.9),
    ...[c.el.logo, ...c.el.nav].map((el, i) =>
      rise(el, "-6px", CHROME + i * 0.03, 0.6),
    ),
    [c.el.intro, { opacity: [0, 1] }, { duration: 0.3, at: introAt }],
    [c.el.arrow, { opacity: [0, 1] }, { duration: 0.5, at: CHROME + 0.25 }],
  ];
}

/** Reduced motion: no travel, just fades. */
function reduced(c: IntroCtx): AnimationSequence {
  const chrome = [c.el.logo, ...c.el.nav, c.el.intro, c.el.arrow];
  return [
    [
      [c.el.dan, c.el.billson, c.el.slotInner],
      { transform: ["translateY(0%)", "translateY(0%)"], opacity: [0, 1] },
      { duration: 0.5 },
    ],
    ...chrome.map(
      (el): Segment => [el, { opacity: [0, 1] }, { duration: 0.4, at: 0.2 }],
    ),
  ];
}

export function introSequence(c: IntroCtx, reduce: boolean): AnimationSequence {
  return reduce ? reduced(c) : brief(c);
}
