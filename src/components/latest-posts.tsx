"use client";

import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";
import type { BlogPostListItem } from "@/lib/blog";
import { Section } from "./ui/section";

type LatestPostsProps = {
  posts: BlogPostListItem[];
};

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <Section className="mt-10">
      <h3 className="mb-3 text-subtitle">Latest Posts</h3>
      <div className="flex flex-col space-y-0">
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-surface-secondary"
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.2,
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.slug}
              className="-mx-3 rounded-xl px-3 py-3"
              href={`/blog/${post.slug}`}
              data-id={post.slug}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal">{post.metadata.title}</h4>
                <p className="text-content-secondary">
                  {post.metadata.description}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </Section>
  );
}
