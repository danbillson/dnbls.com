import type { ReactNode } from "react";

/** Aside pulled out of the flow: a kicker and a hairline down the left. */
export function Callout({
  label = "Note",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="note"
      className="my-10 flex flex-col gap-2 border-l-2 border-foreground pl-5 [&_p]:m-0"
    >
      <span className="text-xs font-medium tracking-[0.08em] uppercase">
        {label}
      </span>
      <div className="text-muted">{children}</div>
    </div>
  );
}
