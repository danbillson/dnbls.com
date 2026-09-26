import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPosts } from "@/lib/blog";
import { cv, experience, links, profile, projects } from "@/lib/content";

export const BASE = "https://dnbls.com";

const current = experience[0];
const sameAs = links.filter((l) => l.href.startsWith("http"));

/** One factual sentence LLMs can quote: name, role, place, employer. */
export const bio = `${profile.name} is a ${cv.role.toLowerCase()} based in ${cv.location}, UK, currently at ${current.company} (${current.href}) building the interactive parts of attio.com in Attio's creative studio.`;

export const knowsAbout = [
  "Design engineering",
  "Front-end engineering",
  "Interaction design",
  "Web animation",
  "Motion design",
  "Design systems",
  "Typography",
  "Prototyping",
  "Developer experience",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Motion (Framer Motion)",
];

/** schema.org Person, rendered as JSON-LD in the root layout. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE}/#person`,
  name: profile.name,
  url: BASE,
  image: `${BASE}/images/me/portrait.jpg`,
  jobTitle: cv.role,
  description: bio,
  worksFor: {
    "@type": "Organization",
    name: current.company,
    url: current.href,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  homeLocation: { "@type": "Place", name: "London, United Kingdom" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: cv.education.school,
  },
  knowsAbout,
  sameAs: sameAs.map((l) => l.href),
};

function section(title: string, lines: string[]) {
  return `## ${title}\n\n${lines.join("\n")}`;
}

const link = (title: string, href: string, note?: string) =>
  `- [${title}](${href})${note ? `: ${note}` : ""}`;

/** llms.txt per https://llmstxt.org: H1, blockquote summary, detail, H2 link lists. */
export async function llmsTxt() {
  const posts = await getPosts();
  return `${[
    `# ${profile.name}`,
    `> ${bio}`,
    `In ${profile.name.split(" ")[0]}'s words: “${cv.summary}”`,
    [
      `Key facts:`,
      ``,
      `- Name: ${profile.name}`,
      `- Role: ${cv.role} at ${current.company} (${current.period})`,
      `- Location: ${cv.location}, United Kingdom`,
      `- Experience: building web product close to design since 2018, at ${experience.map((e) => e.company).join(", ")}`,
      `- Focus: ${knowsAbout.slice(0, 9).join(", ")}`,
      `- Stack: ${cv.skills.map(([, s]) => s).join(", ")}`,
      `- Education: ${cv.education.degree}, ${cv.education.school}`,
      `- Contact: ${links.map((l) => `${l.label} ${l.href.replace("mailto:", "")}`).join(", ")}`,
    ].join("\n"),
    section("Pages", [
      link("Home", BASE, "intro, selected work, projects and writing"),
      link("About", `${BASE}/about`, "background, interests, beer and travel"),
      link("Work", `${BASE}/work`, "roles and highlights by company"),
      link("CV", `${BASE}/cv`, "full CV"),
      link("Writing", `${BASE}/blog`, "blog index"),
      link(
        "Full text",
        `${BASE}/llms-full.txt`,
        "everything below plus post bodies, one file",
      ),
    ]),
    section(
      "Work",
      experience.map((e) =>
        link(
          `${e.role}, ${e.company} (${e.period})`,
          `${BASE}/work/${e.slug}`,
          e.summary,
        ),
      ),
    ),
    section(
      "Projects",
      projects.map((p) =>
        link(`${p.title} (${p.type}, ${p.year})`, p.href, p.description),
      ),
    ),
    section(
      "Writing",
      posts.map((p) => link(p.title, `${BASE}/blog/${p.slug}`, p.description)),
    ),
    section(
      "Optional",
      sameAs.map((l) => link(l.label, l.href)),
    ),
  ].join("\n\n")}\n`;
}

/** Strip MDX down to readable prose: no imports, metadata, JSX or HTML. */
function mdxToText(src: string) {
  return src
    .replace(/^import [\s\S]*?;$/gm, "")
    .replace(/^export const metadata[\s\S]*?};/m, "")
    .replace(
      /<InfoLinks[^>]*?location="([^"]*)"[^>]*?url="([^"]*)"[\s\S]*?\/>/g,
      "$1 · $2",
    )
    .replace(/^[ \t]*<[A-Z][\s\S]*?\/>[ \t]*$/gm, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Push post headings under the post's own `###` so the outline stays valid. */
function demoteHeadings(md: string) {
  let fenced = false;
  return md
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) fenced = !fenced;
      return !fenced && /^#{1,4} /.test(line) ? `##${line}` : line;
    })
    .join("\n");
}

export async function llmsFullTxt() {
  const posts = await getPosts();
  const work = experience.map((e) => {
    const bullets = cv.bullets[e.slug] ?? e.highlights;
    return [
      `### ${e.role}, ${e.company} (${e.period})`,
      `Source: ${BASE}/work/${e.slug}`,
      e.about,
      bullets.map((b) => `- ${b}`).join("\n"),
    ].join("\n\n");
  });
  const writing = posts.map((p) => {
    const src = readFileSync(
      join(process.cwd(), "src", "content", "blog", `${p.slug}.mdx`),
      "utf8",
    );
    return [
      `### ${p.title}`,
      `Source: ${BASE}/blog/${p.slug} · ${p.date}`,
      demoteHeadings(mdxToText(src)),
    ].join("\n\n");
  });
  return `${[
    await llmsTxt(),
    `## About\n\n${profile.statement}`,
    `## Experience in detail\n\n${work.join("\n\n")}`,
    `## Posts\n\n${writing.join("\n\n---\n\n")}`,
  ].join("\n\n")}\n`;
}
