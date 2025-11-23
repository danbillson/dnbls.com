import { getAllPosts } from "@/lib/mdx";

export default async function sitemap() {
  const routes = ["", "/work", "/projects", "/blog", "/mood"].map((route) => ({
    url: `https://dnbls.com${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const allPosts = await getAllPosts();
  const blogs = allPosts.map((post) => ({
    url: `https://dnbls.com${post.slug}`,
    lastModified: new Date(post.metadata.date).toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
