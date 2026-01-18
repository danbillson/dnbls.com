"use client";

import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { formatDate } from "@/lib/utils";

type BlogPostsProps = {
  posts: {
    slug: string;
    metadata: {
      title: string;
      date: string;
      description?: string;
    };
  }[];
};

export function BlogPosts({ posts }: BlogPostsProps) {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <AnimatedBackground
        enableHover
        className="w-full h-full bg-surface-secondary rounded-lg"
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.2,
        }}
      >
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col -mx-3 rounded-xl px-3 py-3"
            data-id={post.slug}
          >
            <h2 className="text-title">{post.metadata.title}</h2>
            {post.metadata.date && (
              <time
                dateTime={post.metadata.date}
                className="text-label-sm text-content-secondary"
              >
                {formatDate(post.metadata.date)}
              </time>
            )}
            {post.metadata.description && (
              <p className="text-content-secondary mt-4">
                {post.metadata.description}
              </p>
            )}
            <Link href={`/blog/${post.slug}`} className="absolute inset-0">
              <span className="sr-only">View Article</span>
            </Link>
          </article>
        ))}
      </AnimatedBackground>
    </div>
  );
}
