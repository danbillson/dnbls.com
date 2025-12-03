import Gallery from "@/components/gallery";
import { LatestPosts } from "@/components/latest-posts";
import { Title } from "@/components/title";
import { Section } from "@/components/ui/section";
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";

export default async function Home() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <>
      <Title />
      <Section>
        <div className="prose prose-neutral">
          <p>
            Design engineer in London, working at{" "}
            <a
              href="https://attio.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Attio
            </a>
            . Ex-cheerleader on Team England, now playing volleyball. Big fan of
            craft beer, coffee and <Link href="/mood">much more</Link>.
          </p>
        </div>
      </Section>
      <Gallery />
      <Section>
        <div className="prose prose-neutral mt-10">
          <p>
            For those of you new to cheerleading, I recommend checking out{" "}
            <a
              href="https://www.youtube.com/watch?v=4VmvaqKoGTY"
              target="_blank"
              rel="noopener noreferrer"
            >
              Team England 2019
            </a>
            . That was a fun one.
          </p>
        </div>
      </Section>
      <LatestPosts posts={latestPosts} />
    </>
  );
}
