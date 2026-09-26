import type { Metadata } from "next";
import { BlogPosts } from "@/components/blog-posts";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "A collection of my thoughts and ideas on software engineering and projects.",
};

export default async function Blog() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <h1 className="text-title mt-14 mb-8">blog</h1>
      <BlogPosts posts={posts} />
    </div>
  );
}
