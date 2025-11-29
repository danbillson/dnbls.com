import "@/styles/mdx.css";
import CV from "@/content/cv.mdx";
import { absoluteUrl, ogImageUrl } from "@/lib/metadata";
import type { Metadata } from "next";

const title = "CV";
const description = "Dan Billson's CV and professional experience";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: absoluteUrl("/cv"),
    images: [
      {
        url: ogImageUrl("cv"),
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("cv")],
  },
};

export default function CVPage() {
  return (
    <article className="py-8">
      <div className="mdx">
        <CV />
      </div>
    </article>
  );
}
