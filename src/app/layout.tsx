import type { Metadata } from "next";
import { GridOverlay } from "@/components/grid-overlay";
import { PrototypeToolbar } from "@/components/prototype-toolbar";
import { prototypeInitScript } from "@/lib/font-options";
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
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static init script
          dangerouslySetInnerHTML={{ __html: prototypeInitScript }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
        <GridOverlay />
        <PrototypeToolbar />
      </body>
    </html>
  );
}
