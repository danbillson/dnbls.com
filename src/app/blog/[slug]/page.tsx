import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { default: Post } = await import(`@/content/blog/${slug}.mdx`);
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      notFound();
    }

    return (
      <article className="py-8">
        <div className="mb-8 text-center prose prose-neutral">
          <time
            dateTime={post.metadata.date}
            className="mb-1 text-xs text-gray-600"
          >
            {formatDate(post.metadata.date)}
          </time>
          <h1 className="text-3xl font-medium">{post.metadata.title}</h1>
        </div>
        <div className="mdx">
          <Post />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      type: "article",
      title: post.metadata.title,
      description: post.metadata.description,
      url: `https://dnbls.com/blog/${slug}`,
      publishedTime: post.metadata.date,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
