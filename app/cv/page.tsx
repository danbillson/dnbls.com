import "@/styles/mdx.css";
import CV from "@/content/cv.mdx";
import { absoluteUrl, ogImageUrl } from "@/lib/metadata";
import type { Metadata } from "next";

const title = "CV";
const description = "Dan Billson's CV and professional experience";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await ogImageUrl("cv");
  const cvUrl = await absoluteUrl("/cv");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: cvUrl,
      images: [
        {
          url: ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function CVPage() {
  return (
    <article className="py-8">
      <div className="mdx">
        <CV />
      </div>
    </article>
  );
}
