import Link from "next/link";
import { nav } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="page-grid items-center text-[13px] font-medium md:text-sm">
      <Link
        href="/"
        className="col-span-2 flex size-8 items-center justify-center rounded-full border-[1.5px] border-foreground font-display text-xs font-bold"
      >
        DB
      </Link>
      <nav className="col-span-10 flex justify-end gap-3.5 md:col-span-6 md:col-start-7 md:justify-between">
        {nav.map((item) => (
          <Link key={item.label} href={item.href} className="hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
