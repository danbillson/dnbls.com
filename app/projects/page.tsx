import { absoluteUrl, ogImageUrl } from "@/lib/metadata";
import type { Metadata } from "next";

const title = "Projects";
const description = "A summary of my personal projects.";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await ogImageUrl("projects");
  const projectsUrl = await absoluteUrl("/projects");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: projectsUrl,
      images: [
        {
          url: ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Projects() {
  return (
    <section>
      <h1 className="font-medium text-2xl mt-14 mb-8 tracking-tighter">
        my projects
      </h1>
      <div className="prose prose-neutral">
        <p>
          Here are some of the projects I have worked on in my spare time, these
          range from small apps to test out specific technologies to larger full
          stack applications with auth and search features.
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://yonder-experiences.vercel.app/">
            Yonder Experiences
          </a>
        </h2>
        <p>
          A simple app to visualise the value of points for different
          experiences for the yonder credit card. Opens up a bit of a playground
          for data visualisation with the use of recharts to show the value in £
          per 1000 points.{" "}
          <span className="italic">
            Lets you know when is a good time to bulk buy granola.
          </span>
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/next-forge-paddle">
            next-forge-paddle
          </a>
        </h2>
        <p>
          A fork of{" "}
          <a href="https://github.com/haydenbleasel/next-forge">next-forge</a>,
          a &quot;Production-grade Turborepo template for Next.js apps&quot;
          with Paddle Billing for payments and billing.
          <br /> Read the{" "}
          <a href="https://docs.next-forge.com/migrations/payments/paddle">
            migration guide
          </a>{" "}
          to learn how to migrate a next-forge project to use Paddle.
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/advent-of-code-2023">
            Advent of Code 2024
          </a>
        </h2>
        <p>
          Another year of Advent of Code using Bun and TypeScript where I&apos;m
          able to explore interesting concepts like{" "}
          <a href="https://github.com/danbillson/advent-of-code-2024/blob/main/src/16/index.ts#L31">
            Dijkstra&apos;s
          </a>
          ,{" "}
          <a href="https://github.com/danbillson/advent-of-code-2024/blob/main/src/06/index.ts#L27">
            flood fill
          </a>{" "}
          and{" "}
          <a href="https://github.com/danbillson/advent-of-code-2024/blob/main/src/11/index.ts#L23">
            performant recursion
          </a>
          .
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/t3-pouring-at">pouring.at</a>
        </h2>
        <p>
          An app for craft bars and breweries to list what they are serving on
          tap so that people can search for their favourite beers by location,
          brewery or beer style.
        </p>
        <ul>
          <li>Next.js, Tailwind CSS and shadcn/ui for the front end.</li>
          <li>Drizzle, tRPC and Planetscale for the back end.</li>
          <li>Clerk for authentication and Upstash for rate limiting.</li>
        </ul>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/office-hours">Office Hours</a>
        </h2>
        <p>
          A simple booking app for selecting which dates and times you are
          planning on coming to the office. A covid project when space in the
          office was limited.
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/kana-quiz">Kana Quiz</a>
        </h2>
        <p>
          This was primarily created as an experiment to test out{" "}
          <a href="https://github.com/pmndrs/jotai">Jotai</a> and{" "}
          <a href="https://github.com/pmndrs/zustand">Zustand</a> as state
          management libraries which would later help decide the direction for
          how we managed state in one of the apps at SoPost.
        </p>

        <hr className="my-6! border-neutral-100" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://github.com/danbillson/advent-of-code-2023">
            Advent of Code 2023
          </a>
        </h2>
        <p>
          Not really a project but my latest and best attempt at Advent of Code,
          previous years I tried with Elixir and Rust which were definitely out
          of my comfort zone but in 2023 I managed to get through to day 20 with
          TypeScript.
        </p>
      </div>
    </section>
  );
}
