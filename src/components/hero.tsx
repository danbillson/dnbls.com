"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import {
  type IntroCtx,
  type IntroMode,
  introSequence,
  type Rect,
} from "@/components/hero-intro";
import { ImageCycler } from "@/components/image-cycler";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/content";
import "./hero.css";

type Photo = { src: string; width: number; height: number };

function relative(el: Element, stage: DOMRect): Rect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top - stage.top,
    left: r.left - stage.left,
    right: r.right - stage.left,
    bottom: r.bottom - stage.top,
    width: r.width,
    height: r.height,
  };
}

/**
 * Wordmark hero with an opening sequence (see hero-intro.ts). Pair with
 * `introScript` inline before it. Any input skips to the end.
 */
export function Hero({
  images,
  openers,
}: {
  /** Cycler frames; rotated so the opener is frame one. */
  images: { src: string }[];
  /** Full-bleed candidates, in the order `introScript` indexes. */
  openers: Photo[];
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const intro = useRef<{ mode: IntroMode; pick: number } | null>(null);

  const section = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const photos = useRef<(HTMLDivElement | null)[]>([]);
  const slot = useRef<HTMLSpanElement>(null);
  const slotInner = useRef<HTMLSpanElement>(null);
  const dan = useRef<HTMLSpanElement>(null);
  const billson = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    // Hard load: the inline script decided. Client navigation: already seen.
    intro.current ??= window.__hero ?? {
      mode: "return",
      pick: Math.floor(Math.random() * openers.length),
    };
    window.__hero = undefined;
    const { mode, pick: p } = intro.current;
    document.documentElement.dataset.hero = mode;

    const root = section.current;
    const layer = overlay.current;
    const photo = photos.current[p];
    if (
      !root ||
      !layer ||
      !photo ||
      !slot.current ||
      !slotInner.current ||
      !dan.current ||
      !billson.current
    )
      return;
    const els = {
      slot: slot.current,
      slotInner: slotInner.current,
      dan: dan.current,
      billson: billson.current,
    };

    photos.current.forEach((el, i) => {
      el?.toggleAttribute("data-show", i === p);
    });
    layer.dataset.ready = "";
    setPick(p);

    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;
    const skip = () => controls?.complete();
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "resize"];
    const unlisten = () => {
      for (const e of events) window.removeEventListener(e, skip);
    };

    const finish = () => {
      unlisten();
      if (cancelled) return;
      // Flip synchronously so there's no frame between overlay and slot.
      root.dataset.state = "done";
      setDone(true);
    };

    (async () => {
      await Promise.all([
        document.fonts.ready,
        mode === "full" &&
          photo
            .querySelector("img")
            ?.decode()
            .catch(() => {}),
      ]);
      if (cancelled) return;
      // Reloaded mid-page: don't perform to an empty room.
      if (window.scrollY > window.innerHeight / 2) return finish();

      const stage = root.getBoundingClientRect();
      const W = stage.width;
      const H = stage.height;
      const ar = openers[p].width / openers[p].height;
      // Width of the natural-aspect box that covers a w×h frame.
      const coverWidth = (w: number, h: number) => Math.max(w, h * ar);

      const ctx: IntroCtx = {
        width: W,
        height: H,
        slot: relative(els.slot, stage),
        dan: relative(els.dan, stage),
        billson: relative(els.billson, stage),
        el: {
          overlay: layer,
          photo,
          slotInner: els.slotInner,
          dan: els.dan,
          billson: els.billson,
          logo: root.querySelector("header > a") as HTMLElement,
          nav: [...root.querySelectorAll<HTMLElement>("header nav a")],
          intro: root.querySelector('[data-enter="intro"]') as HTMLElement,
          arrow: root.querySelector('[data-enter="arrow"]') as HTMLElement,
        },
        clip: (r) =>
          r
            ? `inset(${r.top}px ${W - r.right}px ${H - r.bottom}px ${r.left}px)`
            : "inset(0px 0px 0px 0px)",
        cover: (r) => {
          if (!r) return "translate(0px, 0px) scale(1)";
          const dx = r.left + r.width / 2 - W / 2;
          const dy = r.top + r.height / 2 - H / 2;
          const s = coverWidth(r.width, r.height) / coverWidth(W, H);
          return `translate(${dx}px, ${dy}px) scale(${s})`;
        },
      };

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      controls = animate(introSequence(ctx, mode, reduce));
      for (const e of events)
        window.addEventListener(e, skip, { passive: true });
      await controls.finished;
      finish();
    })();

    return () => {
      cancelled = true;
      controls?.stop();
      unlisten();
    };
  }, [openers]);

  // Cycler starts on whatever the intro landed on.
  const start =
    pick === null ? -1 : images.findIndex((f) => f.src === openers[pick].src);
  const frames =
    start < 0 ? images : [...images.slice(start), ...images.slice(0, start)];

  return (
    <section
      ref={section}
      data-state={done ? "done" : "intro"}
      className="hero relative flex min-h-dvh flex-col overflow-x-clip py-[var(--margin)]"
    >
      {!done && (
        <div ref={overlay} aria-hidden className="hero-overlay">
          {openers.map((photo, i) => (
            <div
              key={photo.src}
              ref={(el) => {
                photos.current[i] = el;
              }}
              data-i={i}
              className="hero-photo"
              style={{ "--ar": photo.width / photo.height } as CSSProperties}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover grayscale"
              />
            </div>
          ))}
        </div>
      )}

      <SiteHeader />

      <div className="flex flex-1 items-center justify-center page-x">
        <h1 className="font-display text-[clamp(3rem,13vw,15rem)] leading-none font-semibold tracking-[-0.045em] whitespace-nowrap">
          <span data-mask className="inline-block">
            <span ref={dan} data-word className="inline-block">
              Dan
            </span>
          </span>
          {/* Cap-height tall, sitting on the baseline: Host Grotesk caps = 0.7em.
              No right margin: B's side bearing (~0.06em) already matches the left gap. */}
          <span
            ref={slot}
            aria-hidden
            className="relative ml-[0.06em] inline-block h-[0.7em] w-[1.07em] overflow-hidden"
          >
            <span
              ref={slotInner}
              data-slot-inner
              className="absolute inset-0 bg-foreground/5"
            >
              <ImageCycler
                images={frames}
                active={done}
                eager
                sizes="(min-width: 1024px) 15vw, 25vw"
                className="grayscale"
              />
            </span>
          </span>
          <span data-mask className="inline-block">
            <span ref={billson} data-word className="inline-block">
              Billson
            </span>
          </span>
        </h1>
      </div>

      <footer className="page-grid items-end">
        {/* Leading ≥1.2 so the next line's selection doesn't clip descenders */}
        <p
          data-enter="intro"
          className="col-span-11 max-w-[42ch] font-display text-xl leading-[1.2] font-medium tracking-[-0.015em] text-pretty md:col-span-8 md:text-[1.75rem]"
        >
          {profile.intro}
        </p>
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
