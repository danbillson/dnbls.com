import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { experience } from "@/lib/content";

const BASE = "https://dnbls.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/work`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/cv`, changeFrequency: "yearly", priority: 0.5 },
    ...experience.map((e) => ({
      url: `${BASE}/work/${e.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
