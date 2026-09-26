"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { ImageCycler } from "@/components/image-cycler";
import { Scramble } from "@/components/scramble";
import { wordsIn } from "@/components/scramble-wave";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/content";
import "./hero.css";

/** Attio mark in the text colour, cap-height tall on the baseline. */
function AttioMark() {
  return (
    <svg
      viewBox="0 0 37 30"
      fill="currentColor"
      aria-hidden
      className="inline-block h-[0.7em] w-auto align-baseline"
    >
      <path d="m35.705 20.45-3.014-4.778s-.011-.02-.018-.029l-.238-.375a2.44 2.44 0 0 0-2.072-1.142l-4.854-.015-.34.537-5.8 9.195-.32.509 2.43 3.846a2.43 2.43 0 0 0 2.079 1.142h6.803c.839 0 1.633-.438 2.077-1.14l.24-.38s.009-.01.01-.015l3.02-4.784a2.41 2.41 0 0 0 0-2.572zm-.92 2-3.018 4.784q-.021.032-.042.058a.41.41 0 0 1-.652-.06l-3.02-4.784a1.3 1.3 0 0 1-.154-.344 1.37 1.37 0 0 1 0-.737c.034-.118.085-.236.152-.342l3.014-4.78.007-.01a.38.38 0 0 1 .24-.172c.031-.009.058-.011.08-.015h.034c.07 0 .243.022.35.195l3.014 4.777a1.34 1.34 0 0 1 0 1.43zM26.786 8.89a2.42 2.42 0 0 0 0-2.572l-3.014-4.777-.251-.402A2.44 2.44 0 0 0 21.442 0H14.64c-.85 0-1.626.426-2.08 1.142L.378 20.452A2.4 2.4 0 0 0 0 21.738c0 .453.13.9.374 1.284l3.268 5.181a2.44 2.44 0 0 0 2.076 1.14h6.804c.854 0 1.63-.427 2.079-1.142l.248-.391v-.005s.005-.006.005-.008l2.429-3.847 7.198-11.409 2.3-3.649zm-.71-1.286c0 .247-.07.496-.212.715L13.93 27.237a.41.41 0 0 1-.35.19c-.07 0-.24-.02-.35-.19l-3.016-4.786a1.35 1.35 0 0 1 0-1.428L22.15 2.11a.41.41 0 0 1 .35-.193c.069 0 .242.02.352.195l3.013 4.777c.142.22.211.469.211.715" />
    </svg>
  );
}

/** Stand-ins the intro's words can flip to on hover. */
const swaps = {
  design: "🎨",
  attio: <AttioMark />,
  care: "❤️",
  cask: "🍺",
  volleyball: "🏐",
  run: "🏃",
};

const at = (ms: number) => ({ "--at": `${ms}ms` }) as CSSProperties;

/**
 * Wordmark hero. The opening sequence is CSS (hero.css) so it runs from first
 * paint; this only picks up the running animations to know when it's over,
 * skips them on any input, and layers the intro line's word stagger on top.
 */
export function Hero({ images }: { images: { src: string }[] }) {
  const [start, setStart] = useState(0);
  const [done, setDone] = useState(false);
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root) return;
    // A different first frame each visit.
    setStart(Math.floor(Math.random() * images.length));

    let cancelled = false;
    let waveTimer = 0;
    let wave: ReturnType<typeof wordsIn> | undefined;
    const intro = root.querySelector<HTMLElement>('[data-enter="intro"]');
    const anims = root
      .getAnimations({ subtree: true })
      .filter(
        (a): a is CSSAnimation =>
          a instanceof CSSAnimation && a.animationName.startsWith("hero-"),
      );

    const skip = () => {
      window.clearTimeout(waveTimer);
      wave?.finish();
      for (const a of anims) a.finish();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "resize"];
    const unlisten = () => {
      for (const e of events) window.removeEventListener(e, skip);
    };

    // Reloaded mid-page: don't perform to an empty room.
    if (window.scrollY > window.innerHeight / 2) skip();
    for (const e of events) window.addEventListener(e, skip, { passive: true });

    // The intro line's words stagger in, tinted, as it fades (scramble-wave.ts).
    // Timed off the fade itself, so it lines up however late we hydrate; if
    // the fade is already over, the line has simply faded in and that's that.
    const fade = anims.find(
      (a) => (a.effect as KeyframeEffect | null)?.target === intro,
    );
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (intro && fade && !reduce) {
      const { delay, duration } = fade.effect?.getTiming() ?? {};
      const now = Number(fade.currentTime ?? 0);
      const start = Number(delay ?? 0);
      if (now < start + Number(duration ?? 0)) {
        waveTimer = window.setTimeout(
          () => {
            wave = wordsIn(intro);
          },
          Math.max(0, start - now),
        );
      }
    }

    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        if (cancelled) return;
        unlisten();
        root.dataset.state = "done";
        setDone(true);
      })
      // Rejected when an animation is cancelled, i.e. on unmount.
      .catch(() => {});

    return () => {
      cancelled = true;
      window.clearTimeout(waveTimer);
      wave?.finish();
      unlisten();
    };
  }, [images.length]);

  const frames = [...images.slice(start), ...images.slice(0, start)];

  return (
    <section
      ref={section}
      data-state={done ? "done" : "intro"}
      className="hero relative flex min-h-svh flex-col overflow-x-clip py-[var(--margin)]"
    >
      <SiteHeader />

      <div className="flex flex-1 items-center justify-center page-x">
        <h1 className="font-display text-[clamp(3rem,20vw,15rem)] leading-[0.85] font-semibold tracking-[-0.045em] whitespace-nowrap md:text-[clamp(3rem,13vw,15rem)]">
          <span data-mask className="inline-block">
            <span data-word style={at(100)} className="inline-block">
              <Scramble radius={140} grow="left">
                Dan
              </Scramble>
            </span>
          </span>
          {/* Cap-height tall, sitting on the baseline: Host Grotesk caps = 0.7em.
              No right margin: B's side bearing (~0.06em) already matches the left gap. */}
          <span
            aria-hidden
            className="relative ml-[0.06em] inline-block h-[0.7em] w-[1.07em] overflow-hidden"
          >
            <span data-slot-inner className="absolute inset-0 bg-foreground/5">
              <ImageCycler
                images={frames}
                active={done}
                eager
                sizes="(min-width: 1024px) 15vw, 25vw"
                className="grayscale"
              />
            </span>
          </span>
          {/* Phones: surname on its own line so the type can stay big. */}
          <br className="md:hidden" />
          <span data-mask className="inline-block">
            <span data-word style={at(160)} className="inline-block">
              <Scramble radius={140} grow="right">
                Billson
              </Scramble>
            </span>
          </span>
        </h1>
      </div>

      <footer className="page-grid items-end">
        {/* Leading ≥1.2 so the next line's selection doesn't clip descenders */}
        <Scramble
          as="p"
          radius={70}
          swaps={swaps}
          data-enter="intro"
          className="col-span-11 max-w-[42ch] font-display text-xl leading-[1.2] font-medium tracking-[-0.015em] text-pretty md:col-span-8 md:text-[1.75rem]"
        >
          {profile.intro}
        </Scramble>
        <span
          aria-hidden
          data-enter="arrow"
          className="col-start-12 text-right text-sm font-medium text-muted"
        >
          ↓
        </span>
      </footer>
    </section>
  );
}
