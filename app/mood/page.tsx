import { MoodBoard } from "@/components/mood-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mood",
  description: "A curated list of my favourite things.",
};

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
