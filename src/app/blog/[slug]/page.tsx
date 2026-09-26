import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ScrollReveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Words } from "@/components/words";
import { getPost, getPosts, ledgerDate, longDate } from "@/lib/blog";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://dnbls.com/blog/${slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const kicker = "text-xs font-medium tracking-[0.08em] uppercase";

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  // Newest first, so "newer" sits before us in the list.
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <>
      <ScrollReveal />
      <div className="py-[var(--margin)]">
        <SiteHeader />
      </div>

      <main
        id="main"
        tabIndex={-1}
        className="pt-16 pb-40 text-sm font-medium outline-none md:pt-24"
      >
        <article>
          {/* Pre-marked in: plays as the load intro. */}
          <header data-reveal data-in className="page-grid gap-y-10">
            <div className="col-span-12 flex gap-x-6 md:col-span-2 md:col-start-2 md:flex-col md:gap-y-1">
              <p className={`rv-rise ${kicker}`}>
                <Link href="/blog" className="hover:bg-accent">
                  Writing
                </Link>
              </p>
              <time
                dateTime={post.date}
                style={{ "--i": 1 } as CSSProperties}
                className={`rv-rise tabular-nums ${kicker}`}
              >
                {ledgerDate(post.date)}
              </time>
              <p
                style={{ "--i": 2 } as CSSProperties}
                className={`rv-rise text-muted ${kicker}`}
              >
                {post.minutes} min read
              </p>
            </div>
            <div className="col-span-12 flex flex-col gap-8 md:col-span-8 md:col-start-4">
              <h1 className="rv-words max-w-[14ch] font-display text-[clamp(2.75rem,6.5vw,6.75rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance">
                <Words text={post.title} spread={350} />
              </h1>
              {post.description && (
                <p className="rv-rise max-w-[36ch] font-display text-xl leading-snug font-medium tracking-tight text-pretty text-muted [--d:350ms] md:text-2xl">
                  {post.description}
                </p>
              )}
            </div>
          </header>

          <div className="page-grid mt-16 md:mt-24">
            <div className="prose col-span-12 md:col-span-8 md:col-start-4 lg:col-span-6 lg:col-start-4">
              <Body />
            </div>
          </div>

          <footer className="page-grid mt-24 md:mt-32">
            <p
              className={`col-span-12 border-rule border-t pt-3 text-muted md:col-span-2 md:col-start-2 ${kicker}`}
            >
              {longDate(post.date)}
            </p>
            <nav
              aria-label="More writing"
              className="col-span-12 grid grid-cols-subgrid md:col-span-8 md:col-start-4"
            >
              {[
                { label: "Older", post: older },
                { label: "Newer", post: newer },
              ].map(({ label, post: p }) => (
                <div
                  key={label}
                  className="col-span-6 flex flex-col gap-3 border-rule border-t pt-3 md:col-span-4"
                >
                  <span className={`text-muted ${kicker}`}>{label}</span>
                  {p ? (
                    <Link
                      href={`/blog/${p.slug}`}
                      className="max-w-[24ch] font-display text-lg leading-tight font-semibold tracking-tight text-balance transition-colors duration-150 hover:bg-accent md:text-xl"
                    >
                      {p.title}
                    </Link>
                  ) : (
                    <Link
                      href="/blog"
                      className="w-fit transition-colors duration-150 hover:bg-accent"
                    >
                      All writing <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </footer>
        </article>
      </main>
    </>
  );
}
