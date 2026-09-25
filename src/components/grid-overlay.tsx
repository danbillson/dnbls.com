export function GridOverlay() {
  return (
    <div
      aria-hidden
      className="grid-overlay pointer-events-none fixed inset-0 z-40 page-grid"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static columns
          key={i}
          className="h-full bg-[color-mix(in_oklab,red_8%,transparent)]"
        />
      ))}
    </div>
  );
}
