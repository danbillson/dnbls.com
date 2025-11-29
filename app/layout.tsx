import Nav from "@/components/nav";
import Social from "@/components/social";
import { absoluteUrl, getSiteUrl, ogImageUrl } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque as FontTitle,
  Work_Sans as FontSans,
} from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Dan Billson",
    template: "%s | Dan Billson",
  },
  description:
    "Software engineer, volleyball player and craft beer enthusiast.",
  openGraph: {
    title: "Dan Billson",
    description:
      "Software engineer, volleyball player and craft beer enthusiast.",
    url: absoluteUrl("/"),
    siteName: "Dan Billson",
    images: [
      {
        url: ogImageUrl(),
        width: 1200,
        height: 630,
        alt: "Dan Billson",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan Billson",
    description:
      "Software engineer, volleyball player and craft beer enthusiast.",
    images: [ogImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const fontTitle = FontTitle({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-title",
});

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontTitle.variable,
          fontSans.variable,
        )}
      >
        <main className="mt-6 p-6 max-w-2xl mx-auto">
          <Nav />
          {children}
          <Social />

          <SpeedInsights />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
