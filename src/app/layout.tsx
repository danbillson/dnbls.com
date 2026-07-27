import type { Metadata } from "next";
import { fontMono, fontSans } from "@/lib/fonts";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import Nav from "@/components/nav";
import Social from "@/components/social";

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
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} font-sans`}
    >
      <body className={`antialiased`}>
        <main className="mt-6 p-6 max-w-2xl mx-auto">
          <MotionProvider>
            <Nav />
            {children}
            <Social />
          </MotionProvider>
        </main>
      </body>
    </html>
  );
}
