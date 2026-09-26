import Link from "next/link";
import { LogoIcon } from "@/components/logo-icon";
import { nav } from "@/lib/content";

/** Shared by the header and layouts that place the nav themselves. */
export function NavLinks() {
  return nav.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="-my-2 py-2 hover:underline"
    >
      {item.label}
    </Link>
  ));
}

export function SiteHeader() {
  return (
    <header className="page-grid items-center overflow-x-clip text-[13px] font-medium md:text-sm">
      <Link href="/" className="col-span-2 flex items-center">
        <LogoIcon className="size-9" />
      </Link>
      <nav
        aria-label="Site"
        className="col-span-10 flex min-w-0 justify-end gap-2.5 overflow-x-clip text-xs min-[390px]:gap-3.5 min-[390px]:text-[13px] md:col-span-6 md:col-start-7 md:justify-between md:text-sm"
      >
        <NavLinks />
      </nav>
    </header>
  );
}
