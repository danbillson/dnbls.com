"use client";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`cursor-pointer transition-colors duration-150 hover:bg-accent print:hidden ${className ?? ""}`}
    >
      Print ↓
    </button>
  );
}
