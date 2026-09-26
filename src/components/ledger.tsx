import type { ReactNode } from "react";

/**
 * Subgrid wrapper so rows share the 12-col page grid. Offset one column on
 * desktop. Its own reveal trigger: rows carry `--i` and cells `.rv-rise`.
 */
export function LedgerTable({ children }: { children: ReactNode }) {
  return (
    <div data-reveal className="page-grid [--rv-step:45ms]">
      <div className="col-span-12 grid grid-cols-subgrid md:col-span-10 md:col-start-2">
        {children}
      </div>
    </div>
  );
}

/** Each cell carries its own rule, so gutters break the lines like a ledger. */
export const cell = "min-w-0 truncate border-rule border-b py-1";
