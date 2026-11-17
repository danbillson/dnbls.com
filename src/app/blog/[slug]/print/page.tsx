import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { ledgerDate } from "@/lib/blog";
import {
  BOOKLETS,
  type BookletData,
  type BookletPage,
  getBooklet,
  type Photo,
} from "@/lib/booklet";
import "./booklet.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BOOKLETS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]/print">): Promise<Metadata> {
  const { slug } = await params;
  const booklet = await getBooklet(slug);
  return {
    title: booklet ? `${booklet.post.title} (print)` : undefined,
    robots: { index: false, follow: false },
  };
}

// Print sizes in pt and mm: the PDF is the product, not the screen preview.
const kicker =
  "text-[6.5pt] leading-none font-medium tracking-[0.08em] uppercase";
const body = "text-[8.5pt] leading-[1.45] font-normal text-pretty";
const heading =
  "font-display text-[19pt] leading-[0.95] font-semibold tracking-[-0.03em] text-balance";
const two = (n: number) => String(n).padStart(2, "0");

/** One side of an A6 leaf. Odd pages are rectos, with the spine on the left. */
function Page({
  n,
  folio = true,
  children,
}: {
  n: number;
  folio?: boolean;
  children: ReactNode;
}) {
  const recto = n % 2 === 1;
  return (
    <section
      aria-label={`Page ${n}`}
      className={`booklet-page flex h-[148mm] w-[105mm] flex-col overflow-hidden bg-white pt-[9mm] pb-[7mm] ${recto ? "pr-[8mm] pl-[11mm]" : "pr-[11mm] pl-[8mm]"}`}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <p
        aria-hidden={!folio}
        className={`mt-[4mm] flex tabular-nums text-muted ${recto ? "justify-end" : ""} ${kicker} ${folio ? "" : "invisible"}`}
      >
        {two(n)}
      </p>
    </section>
  );
}

/** Ledger kicker row: label left, muted detail right, hairline under. */
function Row({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div
      className={`flex shrink-0 justify-between gap-[3mm] border-rule border-b pb-[1.5mm] ${kicker}`}
    >
      <span>{left}</span>
      {right && <span className="text-muted">{right}</span>}
    </div>
  );
}

function Img({ photo, className }: { photo: Photo; className: string }) {
  return (
    // Unoptimised: the PDF should embed the full-size file, not a
    // screen-width resize.
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      unoptimized
      loading="eager"
      className={`bg-foreground/5 object-cover ${className}`}
    />
  );
}

function Ledger({
  head,
  rows,
}: {
  head: ReactNode[];
  rows: { key: string; cells: ReactNode[] }[];
}) {
  const cell = "border-rule border-b py-[1.6mm] align-baseline";
  return (
    <table className="-mx-[2mm] w-[calc(100%+4mm)] border-separate border-spacing-x-[2mm]">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed columns
              key={i}
              className={`${cell} text-left font-medium text-muted ${kicker}`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            {r.cells.map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed columns
              <td key={i} className={cell}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function render(b: BookletData, page: BookletPage, n: number) {
  switch (page.kind) {
    case "cover":
      return (
        <Page n={n} folio={false}>
          <Row
            left={b.edition}
            right={
              <span className="bg-accent px-[1mm] text-foreground tabular-nums">
                {b.year}
              </span>
            }
          />
          <Img photo={b.cover} className="mt-[4mm] min-h-0 w-full flex-1" />
          <h1 className="mt-[5mm] font-display text-[27pt] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
            {b.title}
          </h1>
          <div className="mt-[5mm]">
            <Row left="Dan Billson" right="dnbls.com" />
          </div>
        </Page>
      );

    case "intro":
      return (
        <Page n={n} folio={false}>
          <Row
            left="Dan Billson"
            right={
              <span className="tabular-nums">{ledgerDate(b.post.date)}</span>
            }
          />
          <div className="mt-[6mm] flex flex-col gap-[3mm]">
            {b.intro.map((p) => (
              <p
                key={p}
                className="font-display text-[11pt] leading-[1.3] font-medium tracking-tight text-pretty"
              >
                {p}
              </p>
            ))}
          </div>
        </Page>
      );

    case "list":
      return (
        <Page n={n}>
          <h2 className={heading}>The list</h2>
          <div className="mt-[6mm]">
            <Ledger
              head={["No.", "Pub", "Area", "Page", <span key="tick" />]}
              rows={b.pubs.map((p) => ({
                key: p.name,
                cells: [
                  <span key="n" className={`tabular-nums ${kicker}`}>
                    {two(p.rank)}
                  </span>,
                  <span key="name" className="text-[8pt] font-medium">
                    {p.name}
                  </span>,
                  <span
                    key="area"
                    className={`whitespace-nowrap text-muted ${kicker}`}
                  >
                    {p.location}
                  </span>,
                  <span key="page" className={`tabular-nums ${kicker}`}>
                    {two(b.pageOf.get(p.rank) ?? 0)}
                  </span>,
                  <span
                    key="tick"
                    aria-hidden
                    className="inline-block size-[2.6mm] border border-foreground/50 align-[-0.3mm]"
                  />,
                ],
              }))}
            />
          </div>
        </Page>
      );

    case "pub": {
      const pub = b.pub(page.rank);
      return (
        <Page n={n}>
          <Row left={`No. ${two(pub.rank)}`} right={pub.location} />
          {page.photo && pub.photo ? (
            <Img
              photo={pub.photo}
              className="mt-[4mm] h-auto w-full shrink-0"
            />
          ) : (
            <p
              aria-hidden
              className="mt-[5mm] font-display text-[64pt] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums"
            >
              {two(pub.rank)}
            </p>
          )}
          <div className="mt-auto pt-[5mm]">
            <h2 className={heading}>{pub.name}</h2>
            <div className="mt-[3mm] flex flex-col gap-[2mm]">
              {pub.text.map((p) => (
                <p key={p} className={body}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Page>
      );
    }

    case "photo": {
      const pub = b.pub(page.rank);
      return (
        <Page n={n}>
          <Row left={`No. ${two(pub.rank)}`} right={pub.name} />
          {pub.photo && (
            <Img photo={pub.photo} className="mt-[4mm] min-h-0 w-full flex-1" />
          )}
        </Page>
      );
    }

    case "notes":
      return (
        <Page n={n} folio={false}>
          <h2 className={heading}>Notes</h2>
          <div aria-hidden className="mt-[3mm] min-h-0 flex-1 overflow-hidden">
            {Array.from({ length: 24 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: identical rules
              <div key={i} className="h-[7mm] border-rule border-b" />
            ))}
          </div>
          <div
            className={`mt-[5mm] flex flex-col gap-[1.5mm] text-muted ${kicker}`}
          >
            <p>Set in Host Grotesk and Inter</p>
            <p>Printed and stitched at home</p>
            <p className="normal-case tracking-normal">
              dnbls.com/blog/{b.post.slug}
            </p>
          </div>
        </Page>
      );

    case "back":
      return (
        <Page n={n} folio={false}>
          <div className="mt-auto">
            <Ledger
              head={["Year", "Number one"]}
              rows={b.numberOnes.map((r) => ({
                key: r.year,
                cells: [
                  <span key="y" className={`tabular-nums ${kicker}`}>
                    {r.year}
                  </span>,
                  <span key="n" className="text-[8pt] font-medium">
                    {r.name}
                  </span>,
                ],
              }))}
            />
            <div className="mt-[8mm]">
              <Row left={b.title} right="dnbls.com" />
            </div>
          </div>
        </Page>
      );
  }
}

export default async function BookletPrint({
  params,
}: PageProps<"/blog/[slug]/print">) {
  const { slug } = await params;
  const booklet = await getBooklet(slug);
  if (!booklet) notFound();

  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <header className="page-x flex flex-wrap justify-between gap-4 py-6 text-xs font-medium tracking-[0.08em] uppercase print:hidden">
        <span>
          {booklet.post.title}: {booklet.pages.length} pages, A6
        </span>
        <span className="text-muted">
          Save the PDF with <code>pnpm booklet {slug}</code>
        </span>
      </header>
      {/* Laid out as spreads on screen: page 1 alone on the right. */}
      <div className="booklet grid grid-cols-[repeat(2,105mm)] justify-center gap-y-[10mm] bg-foreground/5 py-[12mm] [&>:first-child]:col-start-2">
        {booklet.pages.map((page, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: pages are fixed
          <Fragment key={i}>{render(booklet, page, i + 1)}</Fragment>
        ))}
      </div>
    </main>
  );
}
