import { getPost, getPosts } from "@/lib/blog";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Dan Billson — Writing";
export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogImage({
    kicker: "Writing",
    title: post?.title ?? "Writing",
    subtitle: "Dan Billson",
    titleSize: 88,
  });
}
