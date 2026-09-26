import type { AnimationSequence } from "motion/react";

// Hero opening sequences. "full" plays once per session: a random full-bleed
// photo glides into the wordmark slot. "return" is the short version for
// every visit after: the words slide up, then the photo.

export type IntroMode = "full" | "return";

export type Rect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type IntroCtx = {
  /** Stage (hero section) size; all rects are relative to its top-left. */
  width: number;
  height: number;
  slot: Rect;
  dan: Rect;
  billson: Rect;
  el: {
    overlay: HTMLElement;
    photo: HTMLElement;
    slotInner: HTMLElement;
    dan: HTMLElement;
    billson: HTMLElement;
    logo: HTMLElement;
    nav: HTMLElement[];
    intro: HTMLElement;
    arrow: HTMLElement;
  };
  /** clip-path for the photo layer: full stage, or cropped to `r`. */
  clip: (r?: Rect) => string;
  /** transform for the photo: covering the stage, or covering `r`. */
  cover: (r?: Rect) => string;
};

type Segment = AnimationSequence[number];
type Bezier = [number, number, number, number];

const outQuint: Bezier = [0.22, 1, 0.36, 1];
const inOutQuart: Bezier = [0.76, 0, 0.24, 1];

const rise = (el: Element, y: string, at: number, duration = 0.7): Segment => [
  el,
  { opacity: [0, 1], transform: [`translateY(${y})`, "translateY(0px)"] },
  { duration, ease: outQuint, at },
];

/** Photo morphs into the slot; words fly in from the edges as it lands. */
function full(c: IntroCtx): AnimationSequence {
  const hold = 0.6;
  const morph = { duration: 1.1, ease: inOutQuart, at: hold };
  const words = { duration: 1.1, ease: outQuint, at: hold + 0.5 };
  const chrome = hold + 1.3;

  return [
    [c.el.overlay, { clipPath: [c.clip(), c.clip(c.slot)] }, morph],
    [c.el.photo, { transform: [c.cover(), c.cover(c.slot)] }, morph],
    [
      c.el.dan,
      { transform: [`translateX(${-c.dan.right - 24}px)`, "translateX(0px)"] },
      words,
    ],
    [
      c.el.billson,
      {
        transform: [
          `translateX(${c.width - c.billson.left + 24}px)`,
          "translateX(0px)",
        ],
      },
      words,
    ],
    ...[c.el.logo, ...c.el.nav].map((el, i) =>
      rise(el, "-6px", chrome + i * 0.045),
    ),
    rise(c.el.intro, "14px", chrome + 0.12, 0.9),
    [c.el.arrow, { opacity: [0, 1] }, { duration: 0.6, at: chrome + 0.4 }],
  ];
}

/** Words slide up out of their line, then the photo up into the slot. */
function brief(c: IntroCtx): AnimationSequence {
  const up = (el: Element, at: number, duration = 0.8): Segment => [
    el,
    { transform: ["translateY(110%)", "translateY(0%)"] },
    { duration, ease: outQuint, at },
  ];
  const chrome = 0.55;

  return [
    up(c.el.dan, 0.1),
    up(c.el.billson, 0.16),
    up(c.el.slotInner, 0.35, 0.9),
    ...[c.el.logo, ...c.el.nav].map((el, i) =>
      rise(el, "-6px", chrome + i * 0.03, 0.6),
    ),
    rise(c.el.intro, "10px", chrome + 0.08),
    [c.el.arrow, { opacity: [0, 1] }, { duration: 0.5, at: chrome + 0.25 }],
  ];
}

/** Reduced motion: no travel, just fades. */
function reduced(c: IntroCtx, mode: IntroMode): AnimationSequence {
  const chrome = [c.el.logo, ...c.el.nav, c.el.intro, c.el.arrow];
  const settle = { transform: ["translateY(0%)", "translateY(0%)"] };
  return [
    mode === "full"
      ? [c.el.overlay, { opacity: [1, 0] }, { duration: 0.6, at: 0.4 }]
      : [
          [c.el.dan, c.el.billson, c.el.slotInner],
          { ...settle, opacity: [0, 1] },
          { duration: 0.5 },
        ],
    ...chrome.map(
      (el): Segment => [
        el,
        { opacity: [0, 1] },
        { duration: 0.4, at: mode === "full" ? 0.7 : 0.2 },
      ],
    ),
  ];
}

export function introSequence(
  c: IntroCtx,
  mode: IntroMode,
  reduce: boolean,
): AnimationSequence {
  if (reduce) return reduced(c, mode);
  return mode === "full" ? full(c) : brief(c);
}

export const SEEN_KEY = "dnbls:intro-seen";

declare global {
  interface Window {
    /** Set by `introScript` before first paint, consumed by the hero. */
    __hero?: { mode: IntroMode; pick: number };
  }
}

/**
 * Inline, pre-paint: decides full vs return (once per session) and picks the
 * opener, so the SSR'd hero never flashes the wrong state.
 */
export function introScript(count: number) {
  return `(()=>{var d=document.documentElement,m="full";try{if(sessionStorage.getItem("${SEEN_KEY}"))m="return";sessionStorage.setItem("${SEEN_KEY}","1")}catch(e){}var p=Math.floor(Math.random()*${count});d.dataset.hero=m;window.__hero={mode:m,pick:p};var s=document.createElement("style");s.textContent='.hero-overlay:not([data-ready]) .hero-photo[data-i="'+p+'"]{display:block}';document.head.appendChild(s)})()`;
}
