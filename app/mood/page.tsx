import { MoodBoard } from "@/components/mood-board";
import { absoluteUrl, ogImageUrl } from "@/lib/metadata";
import type { Metadata } from "next";

const title = "Mood";
const description = "A curated list of my favourite things.";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await ogImageUrl("mood");
  const moodUrl = await absoluteUrl("/mood");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: moodUrl,
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

export default function Mood() {
  return (
    <section>
      <h1 className="font-medium text-2xl mt-14 mb-8 tracking-tighter">
        mood board
      </h1>
      <div className="prose prose-neutral">
        <p>
          Here is a collection of things that I just like, either things that I
          have had in the past and love or would love to have in the future.
          Have a click around for more details.
        </p>
      </div>
      <div className="w-screen m-[0_calc(50%-50vw)] p-8">
        <MoodBoard />
      </div>
    </section>
  );
}
