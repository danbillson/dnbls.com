"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

type Edge = "top" | "right" | "bottom" | "left";

// Fill collapsed against each edge; inset(0) = fully covered.
const hidden: Record<Edge, string> = {
  top: "inset(0 0 100% 0)",
  right: "inset(0 0 0 100%)",
  bottom: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
};

// Fill + ink per platform; email takes the site accent.
const brand: Record<string, { bg: string; fg: string }> = {
  GitHub: { bg: "#24292f", fg: "#fff" },
  X: { bg: "#000", fg: "#fff" },
  LinkedIn: { bg: "#0a66c2", fg: "#fff" },
  Email: { bg: "var(--accent)", fg: "var(--foreground)" },
};

const icons: Record<string, ReactNode> = {
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Email: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" />
      <path d="m2 5 10 8 10-8" />
    </svg>
  ),
};

/** Nearest edge to the pointer, so the fill follows the cursor in and out. */
function edgeOf(e: PointerEvent<HTMLElement>): Edge {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  const d = { top: y, bottom: 1 - y, left: x, right: 1 - x };
  return (Object.keys(d) as Edge[]).reduce((a, b) => (d[b] < d[a] ? b : a));
}

// The 400ms expo entry reads as full by ~240ms; a quick hover waits until
// then before exiting, so the fill always lands before it leaves.
const FULL_AT = 240;

// Each hover gets its own fill layer, cloned from the tile's focus fill, so a
// new entry wipes in from its own edge while earlier fills are still exiting.
const current = new WeakMap<HTMLElement, { fill: HTMLElement; at: number }>();

function onEnter(e: PointerEvent<HTMLElement>) {
  const tile = e.currentTarget;
  const template = tile.querySelector<HTMLElement>("[data-fill]");
  const layers = tile.querySelector<HTMLElement>("[data-layers]");
  if (e.pointerType !== "mouse" || !template || !layers) return;
  const fill = template.cloneNode(true) as HTMLElement;
  fill.removeAttribute("data-fill");
  fill.style.transition = "none";
  fill.style.clipPath = hidden[edgeOf(e)];
  layers.append(fill);
  fill.getBoundingClientRect();
  fill.style.transition = "";
  fill.style.clipPath = "inset(0)";
  current.set(tile, { fill, at: performance.now() });
}

function onLeave(e: PointerEvent<HTMLElement>) {
  const tile = e.currentTarget;
  const entry = current.get(tile);
  if (e.pointerType !== "mouse" || !entry) return;
  current.delete(tile);
  const { fill, at } = entry;
  const edge = edgeOf(e);
  const exit = () => {
    fill.addEventListener("transitionend", () => fill.remove(), {
      once: true,
    });
    fill.style.clipPath = hidden[edge];
    // Reduced motion: no transition, so nothing to wait for.
    if (fill.getAnimations().length === 0) fill.remove();
  };
  const wait = FULL_AT - (performance.now() - at);
  if (wait > 0) window.setTimeout(exit, wait);
  else exit();
}

/** Logo centred, name in the corner. Rendered twice: base + clipped fill copy. */
function Face({ label }: { label: string }) {
  return (
    <span className="absolute inset-0 grid place-items-center [&_svg]:size-[clamp(1.25rem,3.5vw,2.5rem)]">
      {icons[label]}
      <span className="absolute bottom-2 left-2.5 text-xs leading-none">
        {label}
      </span>
    </span>
  );
}

/** Logo tiles. A platform-coloured fill slides in from the edge the cursor enters by;
 * a clipped copy of the face rides on it, so the mark changes colour under the fill. */
export function ContactGrid({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <ul className="grid grid-cols-4 gap-px border border-rule bg-rule">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            style={
              {
                "--bg": brand[l.label]?.bg,
                "--fg": brand[l.label]?.fg,
              } as CSSProperties
            }
            className="group relative block aspect-square bg-white text-foreground outline-none"
          >
            <Face label={l.label} />
            {/* Keyboard focus shows the fill instantly; no slide for keys. */}
            <span
              data-fill
              aria-hidden
              style={{ clipPath: hidden.bottom }}
              className="absolute inset-0 bg-[var(--bg)] text-[var(--fg)] transition-[clip-path] duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-focus-visible:[clip-path:inset(0)]! group-focus-visible:transition-none motion-reduce:transition-none"
            >
              <Face label={l.label} />
            </span>
            {/* Pointer fills are appended here; React never renders into it. */}
            <span data-layers aria-hidden className="absolute inset-0" />
          </a>
        </li>
      ))}
    </ul>
  );
}
