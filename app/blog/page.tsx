import { BlogPosts } from "@/components/blog-posts";
import { getAllPosts } from "@/lib/mdx";
import { absoluteUrl, ogImageUrl } from "@/lib/metadata";
import type { Metadata } from "next";

const title = "Blog";
const description =
  "A collection of my thoughts and ideas on software engineering and projects.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: absoluteUrl("/blog"),
    images: [
      {
        url: ogImageUrl("blog"),
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("blog")],
  },
};

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="font-medium text-2xl mt-14 mb-8 tracking-tighter">blog</h1>

      <BlogPosts posts={posts} />
    </div>
  );
}
