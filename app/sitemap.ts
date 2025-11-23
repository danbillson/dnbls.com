import { getAllPosts } from "@/lib/mdx";

export default async function sitemap() {
  let routes = ["", "/work", "/projects", "/blog", "/mood"].map((route) => ({
    url: `https://dnbls.com${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const allPosts = await getAllPosts();
  let blogs = allPosts.map((post) => ({
    url: `https://danbillson.com${post.slug}`,
    lastModified: new Date(post.metadata.date).toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
