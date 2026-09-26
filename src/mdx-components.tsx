import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Callout } from "@/components/blog/callout";
import { InfoLinks } from "@/components/blog/info-links";

/**
 * Element styling for post bodies lives in `.prose` (globals.css) so the
 * markdown stays plain. Only things that need a component are mapped here.
 */
const components: MDXComponents = {
  // Posts have `# Title` only by accident; the page owns the h1.
  h1: (props) => <h2 {...props} />,
  a: ({ href, children, ...props }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
        {external && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    );
  },
  Image: ({ className, alt, ...props }) => (
    <figure className="my-10">
      <Image
        {...props}
        alt={alt}
        sizes="(min-width: 768px) 58vw, 100vw"
        className={`w-full bg-foreground/5 ${className ?? ""}`}
      />
      {alt && (
        <figcaption
          aria-hidden
          className="mt-2 text-xs font-medium tracking-[0.08em] uppercase text-muted"
        >
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  Callout,
  InfoLinks,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
