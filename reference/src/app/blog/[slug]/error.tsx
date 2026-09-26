"use client";

export default function BlogError({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-title mb-4">Something went wrong</h2>
      <p className="text-content-secondary mb-6">Failed to load blog post</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-interactive-primary text-content-inverse rounded-md hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
