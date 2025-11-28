// Import all blog posts
import AiVsAdventOfCode from "@/content/blog/ai-vs-advent-of-code.mdx";
import AnimatingHeightInReact from "@/content/blog/animating-height-in-react.mdx";
import CreatingABlog from "@/content/blog/creating-a-blog.mdx";
import HowMuchTimeDoesThisDemand from "@/content/blog/how-much-time-does-this-demand.mdx";
import HowToLearnWebDevelopmentIn2025 from "@/content/blog/how-to-learn-web-development-in-2025.mdx";
import SoftwareEngineerMacbookSetup from "@/content/blog/software-engineer-macbook-setup.mdx";
import Top10PubsInLondon2025 from "@/content/blog/top-10-pubs-in-london-2025.mdx";
import Top10PubsInLondon from "@/content/blog/top-10-pubs-in-london.mdx";
import Top10TakeawaysFromGettingReal from "@/content/blog/top-10-takeaways-from-getting-real.mdx";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import "@/styles/mdx.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const postComponents: Record<string, React.ComponentType> = {
  "ai-vs-advent-of-code": AiVsAdventOfCode,
  "animating-height-in-react": AnimatingHeightInReact,
  "creating-a-blog": CreatingABlog,
  "how-much-time-does-this-demand": HowMuchTimeDoesThisDemand,
  "how-to-learn-web-development-in-2025": HowToLearnWebDevelopmentIn2025,
  "software-engineer-macbook-setup": SoftwareEngineerMacbookSetup,
  "top-10-pubs-in-london": Top10PubsInLondon,
  "top-10-takeaways-from-getting-real": Top10TakeawaysFromGettingReal,
  "top-10-pubs-in-london-2025": Top10PubsInLondon2025,
};

type BlogPostProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join("/");
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slugAsParams === slugString);

  if (!post) {
    return {};
  }

  const { title, date: publishedTime, description } = post.metadata;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `https://dnbls.com/blog/${slugString}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: [post.slugAsParams] }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slugAsParams === slugString);

  if (!post) {
    notFound();
  }

  const MDXContent = postComponents[slugString];

  if (!MDXContent) {
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
        <MDXContent />
      </div>
    </article>
  );
}
