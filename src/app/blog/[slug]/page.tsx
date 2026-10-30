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
// One centred column for the whole article: header, body and footer. Capped
// at a reading measure and centred within its span, so wide screens don't
// leave the text hugging the left edge. The cap also overrides `.prose`'s 64ch.
const column =
  "col-span-12 w-full max-w-[40rem] justify-self-center md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4";

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
  // Held-drawing posts play the title on a frame grid; snap the subtitle to it.
  const frame = post.fps ? 1000 / post.fps : 1;
  const subtitleDelay = Math.round(Math.round(350 / frame) * frame);

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
            <div className={`${column} flex gap-x-6`}>
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
            <div
              style={
                post.fps
                  ? ({ "--rv-fps": post.fps } as CSSProperties)
                  : undefined
              }
              className={`${column} flex flex-col gap-8 ${post.fps ? "rv-held" : ""}`}
            >
              <h1 className="rv-words max-w-[14ch] font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance">
                <Words text={post.title} spread={350} fps={post.fps} />
              </h1>
              {post.description && (
                <p
                  style={{ "--d": `${subtitleDelay}ms` } as CSSProperties}
                  className="rv-rise max-w-[36ch] font-display text-xl leading-snug font-medium tracking-tight text-pretty text-muted md:text-2xl"
                >
                  {post.description}
                </p>
              )}
            </div>
          </header>

          <div className="page-grid mt-16 md:mt-24">
            <div className={`prose ${column}`}>
              <Body />
            </div>
          </div>

          <footer className="page-grid mt-24 gap-y-6 md:mt-32">
            <p
              className={`${column} border-rule border-t pt-3 text-muted ${kicker}`}
            >
              {longDate(post.date)}
            </p>
            <nav
              aria-label="More writing"
              className={`${column} grid grid-cols-2 gap-x-[var(--gutter)]`}
            >
              {[
                { label: "Older", post: older },
                { label: "Newer", post: newer },
              ].map(({ label, post: p }) => (
                <div
                  key={label}
                  className="flex flex-col gap-3 border-rule border-t pt-3"
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
