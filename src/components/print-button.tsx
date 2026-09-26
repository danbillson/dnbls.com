"use client";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`-my-2 cursor-pointer py-2 transition-colors duration-150 hover:bg-accent print:hidden ${className ?? ""}`}
    >
      Print <span aria-hidden>↓</span>
    </button>
  );
}
