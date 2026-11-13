---
name: dnbls-design
description: Dan Billson's personal design system, taken from dnbls.com. Covers colour tokens, Host Grotesk + Inter type scale, the 12-column page grid, spacing, borders, hover and focus states, motion curves and durations, reduced-motion rules, copy voice and reference components. Use when starting, styling or reviewing UI for a project in Dan's own style (new sites, prototypes, side projects, OG images), or when a project's AGENTS.md points here. Not for client work or projects with their own brand.
---

# dnbls design system

The live reference is dnbls.com. Its source is at `~/git/dnbls.com`, and this
skill lives inside that repo at `dnbls-design/`. The site imports the token
files directly, so the files next to this one are always current.

## Character

Editorial and ledger-like. Off-white paper, near-black ink, and one
acid yellow-green accent used only for highlights. Big, tightly tracked
display type. Hairline rules on a strict 12-column grid. Square corners and
flat surfaces. Motion is quick and expo-out, with playful details on top of
the strict layout (letters that scramble under the cursor, emoji
stand-ins, held 12fps drawings). Restraint is the default. Each page gets
one or two moments of play, not ten.

## Setup (Next.js + Tailwind v4)

1. Copy `tokens.css`, `fonts.ts` and, if needed, `palette.ts` from this folder into the project.
2. `globals.css`:
   ```css
   @import "tailwindcss";
   @import "./tokens.css";
   ```
3. Root layout:
   ```tsx
   import { fontVariables } from "@/lib/fonts";

   <html lang="en" className={`${fontVariables} h-full antialiased`}>
     <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
   ```
4. Add a skip link as the first child of `<body>`:
   ```tsx
   <a href="#main" className="fixed top-2 left-2 z-50 -translate-y-[calc(100%+1rem)] bg-accent px-3 py-2 text-sm font-medium transition-transform duration-150 focus:translate-y-0 motion-reduce:transition-none">
     Skip to content
   </a>
   ```
5. In dev, add the grid overlay (`G` toggles it). See `components.md`.

Outside Next.js, keep the same variables. Load Host Grotesk and Inter from
Google Fonts and set `--font-host-grotesk` and `--font-inter`.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `background` | `#f9f9f9` | Page. Off-white, never pure white. |
| `foreground` | `#171717` | Ink: text, heavy rules, inverted panels. |
| `accent` | `#e4ff02` | Highlights only (see below). |
| `muted` | foreground at 62% | Secondary text. 4.9:1, AA at small sizes. |
| `rule` | foreground at 15% | Hairlines, ledger rows, tile gaps. |

- **Accent is a highlighter, never ink.** Use it for the hover background on
  links (`hover:bg-accent`, text stays foreground), `::selection`, the skip
  link, a rule that fills on hover, highlighted code lines
  (`color-mix(... accent 35%)`) and at most one small fill (the email tile).
  Never use it as text colour (it fails contrast on the light background),
  and never as a large area or brand wash.
- Mix tints from the foreground. Don't add new greys:
  `bg-foreground/5` for image placeholders and empty frames,
  `color-mix(in oklab, var(--foreground) 6%, transparent)` for inline code
  and soft shadows.
- Pure `#fff` means paper laid on the page: code blocks, contact tiles and print. Nothing else.
- Inverted panels use `bg-foreground text-background`, with
  `text-background/70` for secondary text. Over photos, add a black scrim
  (`bg-linear-to-b from-black/40 via-black/20 to-black/60`).
- `palette.ts` (eight saturated colours) is only for playful moments:
  scrambled letters and OG-card lettering. Don't use it for UI state, charts
  or buttons.
- Photos are full colour, except small decorative slots (the hero wordmark
  slot is `grayscale`).
- Light mode only. There is no dark theme. Don't invent one unless asked.

## Type

Two families: **Host Grotesk** (`font-display`) for display and headings,
**Inter** (`font-sans`) for everything else. Use only weights **500** and
**600**. Never 700, never light. UI text is `font-medium` by default. Code
uses Tailwind's default `font-mono` stack.

| Role | Classes |
| --- | --- |
| Wordmark | `font-display font-semibold text-[clamp(3rem,20vw,15rem)] md:text-[clamp(3rem,13vw,15rem)] leading-[0.85] tracking-[-0.045em]` |
| Page title (h1) | `font-display font-semibold text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] tracking-[-0.045em]` |
| Stepped section heading | `font-display font-semibold text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.92] tracking-[-0.04em]` |
| Article title | `font-display font-semibold text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.04em] text-balance max-w-[14ch]` |
| Large list item | `font-display font-semibold text-[clamp(2rem,4.5vw,4.5rem)] leading-none tracking-[-0.03em]` |
| Section h2 | `font-display text-4xl font-semibold tracking-tight` |
| Statement | `font-display text-3xl md:text-4xl leading-[1.15] font-medium tracking-tight text-pretty max-w-[32ch]` |
| Subtitle / lede | `font-display text-xl md:text-2xl leading-snug font-medium tracking-tight text-pretty text-muted max-w-[36ch]` |
| UI / body | `text-[15px] md:text-sm font-medium` (header nav `text-[13px] md:text-sm`) |
| Kicker / label | `text-xs font-medium tracking-[0.08em] uppercase` |
| Long-form prose | `.prose`: 16px, 1.6 line height, weight 400, 64ch. Copy it from `globals.css` |

Rules:
- The bigger the type, the tighter the tracking and leading. Display sizes
  use `clamp()` against `vw`, not breakpoint steps.
- Kickers do a lot of work: table headers, metadata rows, figcaptions, "Read
  more", counters and callout labels.
- Use `tabular-nums` for dates, years, counters and durations.
- Use `text-balance` on headings and `text-pretty` on paragraphs. Cap line
  length with `ch` (14ch titles, 32 to 40ch ledes, 64ch prose).
- Dates in lists are `DD.MM.YYYY`. In prose they're "28 November 2025". Years in lists can be `'24`.
- Arrows are characters, not icons: `→` for internal links, `↗` for
  external ones, always `<span aria-hidden>`. External links get
  `target="_blank" rel="noreferrer"` plus `<span className="sr-only"> (opens in new tab)</span>`.

## Layout and spacing

- **Grid:** `page-grid` is 12 columns with `--gutter` gaps and `--margin`
  padding (1rem, then 1.25rem from 64rem up). `page-x` gives the margin only.
  Put everything on this grid and use `grid-cols-subgrid` for rows that must
  line up with it.
- **Desktop offset:** content sits one column in (`md:col-start-2 md:col-span-10`).
- **Section pattern:** heading `col-span-12 md:col-span-3 md:col-start-2`,
  body `col-span-12 md:col-span-7`, `gap-y-8` between them.
- **Header:** `page-grid items-center`. Logo `col-span-2` (`size-9`), nav
  `col-span-10 md:col-span-6 md:col-start-7 md:justify-between`. Nav links
  `hover:underline` with a `-my-2 py-2` hit area.
- **Article column:** `col-span-12 w-full max-w-[40rem] justify-self-center md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4`.
- **Vertical rhythm is generous:** `pt-32 pb-40` on main, `gap-40` between
  home sections, `gap-24` from a big heading to its table, and
  `pt-16 md:pt-24` under the header on inner pages. Space separates
  sections; rules separate rows.
- **Ledger tables:** each cell carries its own `border-b border-rule py-1.5 md:py-1 min-w-0 md:truncate`,
  so the gutters break the lines like a ledger. Don't use full-width row
  borders. See `ledger.tsx`.
- **Tiled grids:** `grid gap-px border border-rule bg-rule` with
  `bg-white` tiles gives perfect hairlines.
- **Corners are square.** No `rounded-*`, ever.
- **Surfaces are flat.** No shadows on cards. The one exception is a shadow
  on things that really float over content:
  `shadow-[0_24px_48px_-20px_rgb(23_23_23/0.35)]`.
- **Borders:** 1px `rule` hairlines are the default. 2px `foreground` marks
  emphasis: blockquote and callout left bars, and a short `w-12` (3rem)
  section-break rule.
- Images sit in a `bg-foreground/5` frame that holds their space while they load.

## Interaction

- **Link hover:** a background highlight,
  `transition-colors duration-150 hover:bg-accent`. Prose links are
  underlined (`decoration-muted`, 3px offset) and get the accent
  background on hover. Nav links underline on hover.
- Hover-only effects run only for a mouse (`e.pointerType === "mouse"`
  or `@media (hover: hover) and (pointer: fine)`). Touch never gets
  stuck hover states.
- Keyboard focus shows the end state instantly (no slide) and must always
  be visible. Make `<main id="main" tabIndex={-1} className="outline-none">`
  the skip-link target.
- Directional fills follow the cursor: they enter from the edge it came in
  by and leave by the edge it left by (`contact-grid.tsx`).
- Inertial scroll uses Lenis with `lerp: 0.1`. It's off under reduced
  motion and on reading pages (`smooth-scroll.tsx`).

## Motion

Curves (from `tokens.css`, as `ease-out-expo` and similar utilities or `var(--ease-out-expo)`):
- `--ease-out-expo` `cubic-bezier(0.19, 1, 0.22, 1)`: the house curve. Use it for UI transitions, hovers, wipes and fills.
- `--ease-out-quint` `cubic-bezier(0.22, 1, 0.36, 1)`: for load and scroll reveals.
- `--ease-morph` `cubic-bezier(0.32, 0.72, 0, 1)`: for shared-element and view-transition morphs.
- Plain `ease` is for opacity-only fades.

Durations:
- 150ms: colour hovers.
- 160 to 320ms: UI transitions. 320ms for page view transitions.
- 400ms: fills and wipes.
- 450 to 900ms: entrances (700ms rise, 800 to 900ms masked words).
- 1000ms: the image settle inside a reveal.
- 560ms: morphs.
- **Exits are faster than entrances.** The peek header comes in at 220ms
  expo and leaves at 160ms ease-in.
- Stagger with `--i` × 35 to 110ms (60ms by default), clamped at about 5 to 8
  items so long lists don't drag.

Entrance vocabulary (use these, don't invent new ones):
- **Masked rise:** words or lines slide up 110 to 135% out of a
  `clip-path` line mask (`Words` and `Lines` components).
- **Rise and fade:** 14px up with opacity, for text blocks and table cells (`.rv-rise`).
- **Wipe reveal:** `clip-path: inset(100% 0 0 0)` opens while the image
  inside settles from `scale(1.08)`. The direction follows the navigation.
- **Picture fade:** the image fades into its grey frame (`.rv-img`).
- **Held drawing** (signature, use sparingly): the 12fps steps() smear,
  overshoot and squash on headline words (`.rv-held`).

Rules:
- Animate only `transform`, `opacity` and `clip-path` (plus `filter: blur(2px)` at most).
- CSS-first. Above-the-fold intros are CSS keyframes, so they start at
  first paint. JS only observes them (`getAnimations()`) and skips them on
  any input. Render `data-reveal data-in` on the server for content that's
  already in view.
- Scroll reveals fire once (`IntersectionObserver`, `rootMargin: 0px 0px -15% 0px`) and never replay on scroll-up.
- **Every animation ships a reduced-motion version.** Drop the movement
  and keep a 200 to 300ms opacity fade. View transitions cut instantly.
  Lenis is off.
- Under `@media (scripting: none)` and in print, everything is visible
  and nothing is pending.
- No bouncy springs in UI chrome. Overshoot belongs only to the held-drawing style.

## Voice

British English (colour, centre). Sentence case everywhere. Labels are
short, often a single word ("Writing", "Work", "Contact"). Dry, a little
playful ("Pics or it didn't happen."). Use `·` for inline separators,
`›` for breadcrumbs (`Work › Experience`) and `01 / 05` for counters.
Code comments explain *why*, in plain sentences.

## Don'ts

- Rounded corners, card shadows, gradients (except photo scrims), glassmorphism.
- A second accent colour, accent text, or palette colours as UI state.
- Bold (700) or light weights, a third typeface, or icon fonts where a `→` would do.
- Centred hero plus three feature cards. Use the grid, left-aligned type and offset columns.
- Full-width row borders on tables (use per-cell rules).
- Animations without a reduced-motion fallback, hover effects that fire on touch, or replaying scroll reveals.
- New greys or hard-coded hex values in components. Use tokens and `color-mix` from `foreground`.

## Reference components

`components.md` lists the signature components with paths to their source
in `~/git/dnbls.com`. Read the source before rebuilding one, and copy it
rather than approximating it.
