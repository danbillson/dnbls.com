import Link from "next/link";

export default function Home() {
  return (
    <main className="grid flex-1 grid-cols-12 content-between gap-x-4 p-4">
      <p className="col-span-12 text-sm uppercase tracking-wide md:col-span-4">
        Dan Billson
      </p>
      <h1 className="col-span-12 font-display text-[clamp(3rem,12vw,12rem)] leading-none font-semibold tracking-tight">
        Portfolio{" "}
        <Link href="/prototypes/home" className="bg-accent px-[0.1em]">
          2026
        </Link>
      </h1>
    </main>
  );
}
