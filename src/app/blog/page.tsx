import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cell, LedgerTable } from "@/components/ledger";
import { ScrollReveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Words } from "@/components/words";
import { getPosts, ledgerDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on software engineering, side projects and the odd pub crawl.",
};

export default async function Blog() {
  const posts = await getPosts();

  return (
    <>
      <ScrollReveal />
      <div className="py-[var(--margin)]">
        <SiteHeader />
      </div>

      <main className="flex flex-col gap-16 pt-16 pb-40 text-sm font-medium md:gap-24 md:pt-24">
        <section data-reveal data-in className="page-grid gap-y-8">
          <h1 className="rv-words col-span-12 font-display text-[clamp(3.25rem,8.5vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
            <Words text="Writing" />
          </h1>
          <p
            style={{ "--d": "250ms" } as CSSProperties}
            className="rv-rise col-span-12 max-w-[40ch] text-pretty text-muted md:col-span-4 md:col-start-9"
          >
            {metadata.description}
          </p>
        </section>

        <LedgerTable>
          <div className="contents text-xs tracking-[0.08em] uppercase text-muted">
            <span className={`${cell} rv-rise col-span-4 md:col-span-2`}>
              Date
            </span>
            <span className={`${cell} rv-rise col-span-8 md:col-span-4`}>
              Title
            </span>
            <span className={`${cell} rv-rise hidden md:col-span-3 md:block`}>
              About
            </span>
            <span
              className={`${cell} rv-rise hidden text-right md:col-span-1 md:block`}
            >
              Read
            </span>
          </div>
          {posts.map((p, i) => (
            <div
              key={p.slug}
              style={{ "--i": i + 1 } as CSSProperties}
              className="contents"
            >
              <time
                dateTime={p.date}
                className={`${cell} rv-rise col-span-4 tabular-nums md:col-span-2`}
              >
                {ledgerDate(p.date)}
              </time>
              <Link
                href={`/blog/${p.slug}`}
                className={`${cell} rv-rise col-span-8 transition-colors duration-150 hover:bg-accent md:col-span-4`}
              >
                {p.title}
              </Link>
              <span
                className={`${cell} rv-rise hidden text-muted md:col-span-3 md:block`}
              >
                {p.description}
              </span>
              <span
                className={`${cell} rv-rise hidden text-right tabular-nums text-muted md:col-span-1 md:block`}
              >
                {p.minutes} min
              </span>
            </div>
          ))}
        </LedgerTable>
      </main>
    </>
  );
}
