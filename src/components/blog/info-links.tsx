/** Place row under a pub heading: location, then outbound links. */
export function InfoLinks({
  location,
  url,
  instagram,
}: {
  location: string;
  url?: string;
  instagram?: string;
}) {
  const links = [
    url && { label: "Website", href: url },
    instagram && { label: "Instagram", href: instagram },
  ].filter((l): l is { label: string; href: string } => Boolean(l));
  return (
    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium tracking-[0.08em] uppercase">
      <span>{location}</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="-my-2 py-2 text-muted transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          {l.label} <span aria-hidden>↗</span>
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      ))}
    </p>
  );
}
