import type { Metadata } from "next";
import { GridOverlay } from "@/components/grid-overlay";
import { PeekHeader } from "@/components/peek-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dnbls.com"),
  title: {
    default: "Dan Billson",
    template: "%s | Dan Billson",
  },
  description:
    "Software engineer, volleyball player and craft beer enthusiast.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the hero intro script sets data-hero pre-paint
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SmoothScroll />
        <PeekHeader />
        {children}
        {process.env.NODE_ENV === "development" && <GridOverlay />}
      </body>
    </html>
  );
}
