// Import all blog posts to get their metadata
import * as aiVsAdventOfCodeModule from "@/content/blog/ai-vs-advent-of-code.mdx";
import * as animatingHeightInReactModule from "@/content/blog/animating-height-in-react.mdx";
import * as creatingABlogModule from "@/content/blog/creating-a-blog.mdx";
import * as howMuchTimeDoesThisDemandModule from "@/content/blog/how-much-time-does-this-demand.mdx";
import * as howToLearnWebDevelopmentIn2025Module from "@/content/blog/how-to-learn-web-development-in-2025.mdx";
import * as softwareEngineerMacbookSetupModule from "@/content/blog/software-engineer-macbook-setup.mdx";
import * as top10PubsInLondon2025Module from "@/content/blog/top-10-pubs-in-london-2025.mdx";
import * as top10PubsInLondonModule from "@/content/blog/top-10-pubs-in-london.mdx";
import * as top10TakeawaysFromGettingRealModule from "@/content/blog/top-10-takeaways-from-getting-real.mdx";

const aiVsAdventOfCodeMeta = aiVsAdventOfCodeModule.metadata;
const animatingHeightInReactMeta = animatingHeightInReactModule.metadata;
const creatingABlogMeta = creatingABlogModule.metadata;
const howMuchTimeDoesThisDemandMeta = howMuchTimeDoesThisDemandModule.metadata;
const howToLearnWebDevelopmentIn2025Meta =
  howToLearnWebDevelopmentIn2025Module.metadata;
const softwareEngineerMacbookSetupMeta =
  softwareEngineerMacbookSetupModule.metadata;
const top10PubsInLondonMeta = top10PubsInLondonModule.metadata;
const top10TakeawaysFromGettingRealMeta =
  top10TakeawaysFromGettingRealModule.metadata;
const top10PubsInLondon2025Meta = top10PubsInLondon2025Module.metadata;
export interface Post {
  slug: string;
  slugAsParams: string;
  metadata: {
    title: string;
    date: string;
    description?: string;
    published?: boolean;
  };
}

export interface CV {
  metadata: Record<string, never>;
}

const allPostsData: Post[] = [
  {
    slug: "/blog/ai-vs-advent-of-code",
    slugAsParams: "ai-vs-advent-of-code",
    metadata: {
      title: aiVsAdventOfCodeMeta.title || "",
      date: aiVsAdventOfCodeMeta.date || "",
      description: aiVsAdventOfCodeMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/animating-height-in-react",
    slugAsParams: "animating-height-in-react",
    metadata: {
      title: animatingHeightInReactMeta.title || "",
      date: animatingHeightInReactMeta.date || "",
      description: animatingHeightInReactMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/creating-a-blog",
    slugAsParams: "creating-a-blog",
    metadata: {
      title: creatingABlogMeta.title || "",
      date: creatingABlogMeta.date || "",
      description: creatingABlogMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/how-much-time-does-this-demand",
    slugAsParams: "how-much-time-does-this-demand",
    metadata: {
      title: howMuchTimeDoesThisDemandMeta.title || "",
      date: howMuchTimeDoesThisDemandMeta.date || "",
      description: howMuchTimeDoesThisDemandMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/how-to-learn-web-development-in-2025",
    slugAsParams: "how-to-learn-web-development-in-2025",
    metadata: {
      title: howToLearnWebDevelopmentIn2025Meta.title || "",
      date: howToLearnWebDevelopmentIn2025Meta.date || "",
      description: howToLearnWebDevelopmentIn2025Meta.description,
      published: true,
    },
  },
  {
    slug: "/blog/software-engineer-macbook-setup",
    slugAsParams: "software-engineer-macbook-setup",
    metadata: {
      title: softwareEngineerMacbookSetupMeta.title || "",
      date: softwareEngineerMacbookSetupMeta.date || "",
      description: softwareEngineerMacbookSetupMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/top-10-pubs-in-london",
    slugAsParams: "top-10-pubs-in-london",
    metadata: {
      title: top10PubsInLondonMeta.title || "",
      date: top10PubsInLondonMeta.date || "",
      description: top10PubsInLondonMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/top-10-takeaways-from-getting-real",
    slugAsParams: "top-10-takeaways-from-getting-real",
    metadata: {
      title: top10TakeawaysFromGettingRealMeta.title || "",
      date: top10TakeawaysFromGettingRealMeta.date || "",
      description: top10TakeawaysFromGettingRealMeta.description,
      published: true,
    },
  },
  {
    slug: "/blog/top-10-pubs-in-london-2025",
    slugAsParams: "top-10-pubs-in-london-2025",
    metadata: {
      title: top10PubsInLondon2025Meta.title || "",
      date: top10PubsInLondon2025Meta.date || "",
      description: top10PubsInLondon2025Meta.description,
      published: true,
    },
  },
];

export async function getAllPosts(): Promise<Post[]> {
  // Sort by date
  return allPostsData
    .filter((post) => post.metadata.published)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date);
      const dateB = new Date(b.metadata.date);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slugAsParams === slug) || null;
}

export async function getCV(): Promise<CV> {
  return { metadata: {} };
}
