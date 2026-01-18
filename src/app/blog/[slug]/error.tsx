"use client";

export default function BlogError({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-2xl font-medium mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">Failed to load blog post</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
