import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "A collection of my thoughts and ideas on software engineering and projects.",
};

export default async function Blog() {
  return (
    <div>
      <h1 className="font-medium text-2xl mt-14 mb-8 tracking-tighter">blog</h1>
    </div>
  );
}
