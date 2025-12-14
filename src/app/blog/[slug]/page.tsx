import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);

  return <Post />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);

  console.log(Post);
  return { title: slug };
}

export function generateStaticParams() {
  const posts = readdirSync(join(process.cwd(), "src", "content", "blog"));
  return posts.map((name) => ({ slug: name.replace(/\.mdx$/, "") }));
}

export const dynamicParams = false;
