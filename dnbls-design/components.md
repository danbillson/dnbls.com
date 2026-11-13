# Reference components

These are the source files in `~/git/dnbls.com`, the live site. Copy them
instead of approximating them. They depend on `tokens.css` and use `@/`
imports, so adjust paths when you copy.

## Foundations

| File | What it is |
| --- | --- |
| `dnbls-design/tokens.css` | Colours, fonts, curves, `page-grid` / `page-x`, selection, print. |
| `dnbls-design/fonts.ts` | `next/font` setup for Host Grotesk and Inter. Exports `fontVariables`. |
| `dnbls-design/palette.ts` | Scramble / OG colours. |
| `src/app/layout.tsx` | Root layout: skip link, Lenis, peek header, dev grid overlay. |
| `src/app/globals.css` | `.prose` (long-form styles, including rehype-pretty-code), work-page and poster keyframes, view-transition timing. |
| `src/components/grid-overlay.tsx` | Dev-only 12-column overlay, toggled with `G`. |
| `src/components/logo-icon.tsx` | The signature logo mark (stroke, `currentColor`). |

## Layout and chrome

| File | What it is |
| --- | --- |
| `src/components/site-header.tsx` | Grid header: logo on the left, nav across columns 7 to 12. |
| `src/components/peek-header.tsx` | A fixed copy of the header that slides in on scroll up and out on scroll down. |
| `src/components/smooth-scroll.tsx` | Lenis setup and the `jumpTo()` helper. |
| `src/components/ledger.tsx` | `LedgerTable` (subgrid, offset one column) and the `cell` class string. |
| `src/components/ledger-heading.tsx` | Stepped, hyphenated three-row section heading with a hanging mark. |
| `src/app/blog/page.tsx` | The canonical index page: h1 and lede, then a ledger table. |
| `src/app/blog/[slug]/page.tsx` | The canonical article page: kicker row, title, lede, prose column. |

## Motion

| File | What it is |
| --- | --- |
| `src/components/reveal.tsx` + `reveal.css` | The scroll and load reveal system: `data-reveal`/`data-in`, `.rv-rise`, `.rv-mask`/`.rv-word`, `.rv-img`, `.rv-held`, `.rv-parallax`, plus reduced-motion, no-JS and print fallbacks. |
| `src/components/words.tsx` | Splits a heading into masked words for `.rv-words` (spread, power, fps snap). |
| `src/components/lines.tsx` | Splits paragraphs into masked visual lines and re-splits on resize. |
| `src/components/hero.tsx` + `hero.css` | CSS-first opening sequence that JS observes and skips on input. |
| `src/components/work-poster.tsx` | Full-bleed inverted panel: large display list, accent rule on hover, view-transition morph. |
| `src/components/work-viewer.tsx` | Direction-aware wipe reveals between items. |

## Play

| File | What it is |
| --- | --- |
| `src/components/scramble.tsx` + `scramble.css` | Letters near the cursor swap to look-alike glyphs and palette colours, with emoji or word stand-ins. |
| `src/components/scramble-wave.ts` | A word-stagger tint wave for intro lines. |
| `src/components/contact-grid.tsx` | Hairline tile grid with directional, cursor-following brand fills. |
| `src/components/image-cycler.tsx` | Cycles through photos inside a slot. |
| `src/components/photo-bento.tsx` | Horizontally scrolling two-row bento with snap and staggered fades. |
| `src/components/lightbox.tsx` | `<dialog>`-based photo lightbox. |

## Content blocks

| File | What it is |
| --- | --- |
| `src/components/blog/callout.tsx` | Aside with a kicker label and a 2px foreground left bar. |
| `src/components/blog/info-links.tsx` | Kicker-style metadata row with `↗` external links. |
| `src/mdx-components.tsx` | MDX mapping: external links, figure with kicker caption (from alt; `caption={false}` hides it). |
| `src/lib/og.tsx` | OG image: off-white card, Host Grotesk, palette-tinted lettering. |
