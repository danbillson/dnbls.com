import { generateOgImage } from "@/components/og-image";
import { getAllPosts } from "@/lib/mdx";

export const alt = "Dan Billson";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slugAsParams === slug);

  // Use post title as subtitle, or fallback to slug
  const subtitle = post?.metadata.title || slug;

  return generateOgImage(subtitle);
}

