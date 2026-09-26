"use client";

/**
 * Pre-paint inline script. Real on the server (runs during HTML parsing);
 * inert on the client, where React never executes rendered scripts anyway.
 * See next docs: guides/preventing-flash-before-hydration.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
