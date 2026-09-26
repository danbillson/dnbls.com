import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { GridOverlay } from "@/components/grid-overlay";
import { PeekHeader } from "@/components/peek-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { fontVariables } from "@/lib/fonts";
import { personJsonLd } from "@/lib/llms";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dnbls.com"),
  title: {
    default: "Dan Billson",
    template: "%s | Dan Billson",
  },
  description:
    "Dan Billson is a design engineer in London, building interactive web experiences at Attio. Motion, typography and design systems.",
  alternates: {
    types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }] },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#main"
          className="fixed top-2 left-2 z-50 -translate-y-[calc(100%+1rem)] bg-accent px-3 py-2 text-sm font-medium transition-transform duration-150 focus:translate-y-0 motion-reduce:transition-none"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, `<` escaped
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <PeekHeader />
        {children}
        {process.env.NODE_ENV === "development" && <GridOverlay />}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
