import Link from "next/link";
import { LogoIcon } from "@/components/logo-icon";
import { nav } from "@/lib/content";

/** Shared by the header and layouts that place the nav themselves. */
export function NavLinks() {
  return nav.map((item) => (
    <Link key={item.label} href={item.href} className="hover:underline">
      {item.label}
    </Link>
  ));
}

export function SiteHeader() {
  return (
    <header className="page-grid items-center text-[13px] font-medium md:text-sm">
      <Link href="/" className="col-span-2 flex items-center">
        <LogoIcon className="size-9" />
      </Link>
      <nav className="col-span-10 flex justify-end gap-3.5 md:col-span-6 md:col-start-7 md:justify-between">
        <NavLinks />
      </nav>
    </header>
  );
}
