# dnbls.com

Personal site.

## Tech

- Next.js (App Router), React, TypeScript
- Tailwind CSS v4
- Lint/format: Biome
- Package manager: pnpm

## Design tokens

- Display: Host Grotesk
- Body: Inter
- Dev: press G for the 12-col grid overlay
- Background `#F9F9F9`, foreground `#171717`, accent `#E4FF02`

## Images

Drop photos into `public/images/<category>/` — no imports needed; `getImages("travel")` in `src/lib/images.ts` reads the folder at build time. Filenames become alt text (`dolomites-lago-di-braies.jpg` → "Dolomites lago di braies"). Formats: jpg, png, webp, avif (convert HEIC first).

```
public/images/
  me/  beer/  running/
  work/{attio,paddle,sopost,climb-creative}/
  travel/{valencia,belgium,new-york,dolomites}/
```

## Getting started

```bash
pnpm install
pnpm dev
```
