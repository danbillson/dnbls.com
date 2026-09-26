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
