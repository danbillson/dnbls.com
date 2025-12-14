import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Figtree,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Social from "@/components/social";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-title",
});

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    url: "https://dnbls.com",
    siteName: "Dan Billson",
    locale: "en_GB",
    type: "website",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="mt-6 p-6 max-w-2xl mx-auto">
          <Nav />
          {children}
          <Social />
        </main>
      </body>
    </html>
  );
}
