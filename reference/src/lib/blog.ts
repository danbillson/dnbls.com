import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export type BlogPostMetadata = {
  title: string;
  date: string;
  description?: string;
};

export type BlogPostListItem = {
  slug: string;
  metadata: BlogPostMetadata;
};

type MDXModule = {
  metadata: BlogPostMetadata;
  default: React.ComponentType;
};

async function getPostMetadata(slug: string): Promise<BlogPostMetadata | null> {
  try {
    const mod = (await import(`@/content/blog/${slug}.mdx`)) as MDXModule;
    return mod.metadata ?? null;
  } catch {
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPostListItem[]> {
  const blogDir = join(process.cwd(), "src", "content", "blog");
  const files = readdirSync(blogDir).filter((name) => name.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const metadata = await getPostMetadata(slug);

      if (!metadata) {
        return null;
      }

      return {
        slug,
        metadata,
      };
    }),
  );

  // Filter out any failed imports and sort by date descending
  return posts
    .filter((post): post is BlogPostListItem => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date).getTime();
      const dateB = new Date(b.metadata.date).getTime();
      return dateB - dateA;
    });
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostListItem | null> {
  const metadata = await getPostMetadata(slug);

  if (!metadata) {
    return null;
  }

  return {
    slug,
    metadata,
  };
}
