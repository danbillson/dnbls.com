---
name: nextjs-pagespeed
description: Audits and optimizes Next.js App Router sites deployed on Vercel for Google PageSpeed Insights. Use when investigating PageSpeed, Core Web Vitals, LCP, INP, CLS, render-blocking resources, image delivery, JavaScript bundles, fonts, caching, or hydration performance.
---
# Next.js PageSpeed
Improve real user performance without removing important design or functionality.
## Workflow
1. Establish the exact route, deployment URL, mobile or desktop profile, current score, and failing audits.
2. Distinguish PageSpeed lab data from field Core Web Vitals. Do not treat one run as conclusive.
3. Inspect the affected route before editing:
- Server and Client Component boundaries
- LCP element and its request chain
- Images, fonts, CSS, and third-party resources
- Hydration and main-thread work
- Sources of layout shift
4. Prioritize changes by likely user impact: LCP, INP, CLS, then transferred bytes and cache efficiency.
5. Make the smallest change that removes the measured bottleneck.
6. Run `pnpm run build` and `pnpm run lint`.
7. Retest the production deployment with the same PageSpeed profile. Compare medians across multiple runs when practical.
## Project patterns
- Keep landing-page content as Server Components by default. Isolate the smallest interactive leaf behind `"use client"`.
- Preserve the hero headline in initial server HTML. Never hide an LCP candidate behind hydration or begin its animation at `opacity: 0`.
- Use `next/image` with accurate `sizes`, dimensions, and per-use quality. Reserve `priority` for genuine above-the-fold LCP candidates.
- Prefer SVG or native HTML over a client chart or component library when interaction is unnecessary.
- Prefer native `<details>` and `<summary>` for simple disclosure UI.
- Keep expensive 3D, charting, editor, and visualization dependencies isolated to the routes or interactions that require them.
- Use `next/font`; preload only essential fonts and weights. Preserve metric-compatible fallbacks to limit CLS.
- Batch browser geometry reads and writes with `requestAnimationFrame`; use passive scroll listeners.
- Keep `experimental.inlineCss` only while production builds and visual rendering remain verified after Next.js upgrades.
- Keep the modern `browserslist` and empty polyfill alias aligned. Do not remove compatibility code unless every supported browser implements the APIs.
- Use ISR for shared marketing HTML when freshness requirements allow it.
- Use a one-year immutable cache for static assets. Rename an asset whenever its contents change.
- Respect `prefers-reduced-motion` in CSS and JavaScript.
## Guardrails
- Do not claim a score of 100 without a PageSpeed result for the exact production URL and profile.
- Do not optimize only for the score. Protect accessibility, SEO, visual fidelity, and real-user Core Web Vitals.
- Do not lazy-load above-the-fold content or the LCP image.
- Do not preload non-critical resources.
- Do not add `will-change` broadly or keep it active permanently.
- Do not set immutable caching on mutable asset URLs unless the release process renames or versions them.
- Treat experimental Next.js options and internal module aliases as upgrade-sensitive.
## Report format
Return:
1. Baseline URL, profile, metrics, and failing audits
2. Root causes supported by code or runtime evidence
3. Changes ordered by expected impact
4. Files changed and trade-offs
5. Build and lint results
6. Before-and-after PageSpeed results, clearly separating measured results from estimates