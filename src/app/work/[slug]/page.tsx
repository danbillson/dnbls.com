import type { Metadata } from "next";
import { experience } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return experience.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = experience.find((e) => e.slug === slug);
  return { title: job ? `${job.company} — Work` : "Work" };
}

// Rendered by the layout's viewer, keyed off the pathname.
export default function Job() {
  return null;
}
