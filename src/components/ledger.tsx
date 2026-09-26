import type { ReactNode } from "react";

/** Stepped, hyphenated section heading: `mark` hangs left of the second line. */
export function LedgerHeading({
  mark,
  lines,
}: {
  mark: string;
  lines: [string, string, string];
}) {
  const [first, second, third] = lines;
  return (
    <h2 className="page-grid font-display text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
      <span className="col-span-9 col-start-4">{first}</span>
      <span className="col-span-2 col-start-2 row-start-2" aria-hidden>
        {mark}
      </span>
      <span className="col-span-9 col-start-4 row-start-2">{second}</span>
      <span className="col-span-7 col-start-6 row-start-3">{third}</span>
    </h2>
  );
}

/** Subgrid wrapper so rows share the 12-col page grid. Offset one column on desktop. */
export function LedgerTable({ children }: { children: ReactNode }) {
  return (
    <div className="page-grid">
      <div className="col-span-12 grid grid-cols-subgrid md:col-span-10 md:col-start-2">
        {children}
      </div>
    </div>
  );
}

/** Each cell carries its own rule, so gutters break the lines like a ledger. */
export const cell = "min-w-0 truncate border-rule border-b py-1";
