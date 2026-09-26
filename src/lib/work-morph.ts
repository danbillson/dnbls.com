// Handshake between the homepage poster and the work viewer: the poster marks
// a navigation just before it happens, and the viewer reads it once on mount
// so the tile the picture morphs into skips its own reveal.
let pending = false;

export function markMorph() {
  pending = true;
}

export function consumeMorph() {
  const was = pending;
  pending = false;
  return was;
}

/** Full-width tile `sizes`, shared so the poster can preload the exact variant. */
export const heroTileSizes = "(min-width: 768px) 58vw, 100vw";
