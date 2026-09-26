// Placeholder content lifted from reference/ for prototyping.

export const profile = {
  name: "Dan Billson",
  role: "Design Engineer",
  intro:
    "I’m a design engineer at Attio. I like things made with care — interactions, typefaces, a proper pint of cask. The rest of the time you’ll find me on a volleyball court or out on a run.",
  statement:
    "Design engineer in Attio’s little creative studio. Most of my career has been building product very close to design. Off the clock it’s volleyball, running when I’m not injured, and beer — the traditional stuff and the weird stuff.",
};

export const links = [
  { label: "X", href: "https://x.com/dbillson" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/danbillson/" },
  { label: "GitHub", href: "https://github.com/danbillson" },
  { label: "Email", href: "mailto:dbillson@outlook.com" },
];

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/about" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
];

export const experience = [
  {
    slug: "attio",
    company: "Attio",
    href: "https://attio.com",
    photos: "work/attio",
    role: "Design Engineer",
    roles: ["Product Engineer", "Design Engineer"],
    team: ["Workflows", "Studio"],
    location: "London",
    years: "2025–",
    period: "2025 – Present",
    short: "'25",
    summary:
      "Joined on the workflows team building the node-based editor, then moved to marketing to build attio.com.",
    about:
      "Joined as a product engineer on the workflows team, building out the node-based workflow editor. Then made the jump to marketing as a design engineer, where I now build the interactive bits of attio.com.",
    highlights: [
      "New workflows editor",
      "Switched from product to the creative studio",
    ],
  },
  {
    slug: "paddle",
    company: "Paddle",
    href: "https://www.paddle.com",
    photos: "work/paddle",
    role: "Software Engineer",
    roles: ["Software Engineer"],
    team: ["Developer Experience", "Web2App"],
    location: "London",
    years: "2024–2025",
    period: "2024 – 2025",
    short: "'24",
    summary:
      "Developer Experience. Docs homepage refresh, design system, open source, the Paddle MCP server.",
    about:
      "Moved to London to join the Developer Experience team. Led cross-functional projects from discovery through launch, and pushed for design fidelity and interaction polish across our developer-facing surfaces.",
    highlights: [
      "Led the developer docs homepage refresh",
      "Built the Paddle MCP server",
      "Paddle Billing migration guide for next-forge",
      "Design system and open source SDKs",
      "Talks at Paddle Forward and meetups",
    ],
    stack: ["TypeScript", "Next.js", "Tailwind", "Motion"],
  },
  {
    slug: "sopost",
    company: "SoPost",
    href: "https://sopost.com",
    photos: "work/sopost",
    role: "Senior Software Engineer",
    roles: ["Software Engineer", "Senior Software Engineer"],
    team: ["Consumer Journeys"],
    years: "2021–2024",
    period: "2021 – 2024",
    short: "'21",
    summary:
      "Platform team. Component library, front-end guild, and the rebuild of the core data capture platform.",
    about:
      "Built the core product: tools to create and manage sampling campaigns, dynamic landing pages and emails, and the builder used to configure them. Promoted to senior in 2023.",
    highlights: [
      "Component library and design system, with design",
      "Started the Front-end Guild and brown bag sessions",
      "Ran the SoCode Summer School",
      "Led the data capture rebuild, RFC to production",
    ],
    stack: ["TypeScript", "React", "Next.js", "Elixir", "Storybook"],
  },
  {
    slug: "climb-creative",
    company: "Climb Creative",
    href: "https://precisionproco.co.uk/",
    role: "Front-end Developer",
    roles: ["Front-end Developer"],
    years: "2020–2021",
    period: "2020 – 2021",
    short: "'20",
    summary:
      "Led the WTTB product page and checkout rebuild, plus the Canva integration.",
    about:
      "Joined a small dev team inside one of the UK’s biggest print groups after moving back up north. Hands-on work across the WTTB storefront.",
    highlights: [
      "Led the WTTB product page and checkout rebuild",
      "Canva integration for custom product design",
    ],
  },
  {
    slug: "marmalade",
    company: "Marmalade",
    href: "https://www.wearemarmalade.co.uk/",
    role: "Front-end Developer",
    roles: ["Front-end Developer"],
    years: "2019–2020",
    period: "2019 – 2020",
    short: "'19",
    summary:
      "Driver Hub blog on Gatsby and headless Drupal. Puppeteer quote-check automation.",
    about:
      "A compact dev team with room to push the stack forward — Gatsby, Lerna monorepos and the newest React features.",
    highlights: [
      "Driver Hub blog on Gatsby and headless Drupal",
      "Puppeteer scripts running 100+ concurrent quote checks",
    ],
    stack: ["React", "Gatsby", "Drupal", "Puppeteer"],
  },
  {
    slug: "thg",
    company: "THG",
    href: "https://www.thg.com/",
    role: "Graduate Front-end Developer",
    roles: ["Graduate Front-end Developer"],
    team: ["Site Builds"],
    years: "2018",
    period: "2018",
    short: "'18",
    summary: "Site builds for Neutrogena and Gillette, the MyProtein rebrand.",
    about:
      "First role straight out of university, at the group behind MyProtein. A crash course in the tools and practices that keep a large company moving.",
    highlights: [
      "Site builds for Neutrogena and Gillette",
      "The MyProtein rebrand",
    ],
  },
];

export const projects = [
  {
    title: "wardrobe.dnbls.com",
    type: "Clothes classifier",
    year: "2026",
    href: "https://wardrobe.dnbls.com",
    description: "Clothing classified and filtered by occasion with jev.",
  },
  {
    title: "pothooks",
    type: "Type tool",
    year: "2026",
    href: "https://pothooks.com",
    description: "Create and download your own hand-drawn fonts.",
  },
  {
    title: "ink.dnbls.com",
    type: "Shader experiment",
    year: "2026",
    href: "https://ink.dnbls.com",
    description: "Ink-like shaders giving a drawn effect to a 3D model.",
  },
  {
    title: "ui.dnbls.com",
    type: "Design system",
    year: "2025",
    href: "https://ui.dnbls.com",
    description: "Foundations, patterns and components used across projects.",
  },
  {
    title: "Yonder Experiences",
    type: "Data visualisation",
    year: "2024",
    href: "https://yonder-experiences.vercel.app/",
    description: "The value of Yonder points across experiences, in £/1000.",
  },
  {
    title: "next-forge-paddle",
    type: "Open source",
    year: "2024",
    href: "https://github.com/danbillson/next-forge-paddle",
    description: "next-forge with Paddle Billing, plus a migration guide.",
  },
  {
    title: "pouring.at",
    type: "Web app",
    year: "2023",
    href: "https://pouring.at",
    description: "Find craft beer by location, brewery or style.",
  },
];

export const posts = [
  { title: "Top 10 pubs in London in 2025", date: "2025-11-28" },
  { title: "How to Learn Web Development in 2025", date: "2025-11-02" },
  { title: "Animating height in React", date: "2025-07-27" },
  { title: "How much time does this demand?", date: "2025-06-29" },
  { title: "Setting up a new M4 MacBook Air", date: "2025-05-04" },
  { title: "AI vs Advent of Code", date: "2025-03-01" },
  { title: "Top 10 bars/pubs in London", date: "2024-11-19" },
];

// Draft copy for /about — facts need checking before this ships.
export const about = {
  headline: "Pixels, Pints and PBs",
  body: [
    "Hi, I’m Dan. I’m a design engineer at Attio in London, working in our little creative studio. I’ve spent most of my time building products very close to design but have also tried my hand at developer experience, open source and agency work, with my first work experience as a graphic designer for the local paper.",
    "Lately I’ve been into print. Which is funny, because I’ve worked for my friend Ryan at a cheer apparel company doing screen printing and at one of the UK’s biggest print groups, and didn’t care about it much either time. Turns out I just needed it to be my own.",
    "I spent a few years cheerleading and competed for Team England. These days it’s volleyball and running whenever I’m not injured.",
    "And beer. That gets its own section.",
  ],
  beer: {
    headline: "A Proper Pint",
    columns: [
      [
        "I’m a traditionalist at heart. Czech pilsner with a thick foam head, a Munich helles, Belgian Trappist, lambic that tastes like a farmhouse, and a well-kept pint of cask in a British pub.",
        "Styles that have been made the same way for a very long time, for good reason.",
      ],
      [
        "That’s turned into a bit of a pilgrimage habit: the cellars at Pilsner Urquell, the Augustiner Bierkeller in Munich, Cantillon in Brussels, and breweries all over the UK.",
        "I’ve still got plenty of time for the weird stuff — Omnipollo, Emperor’s — and a solid pale from Beak or Baron.",
      ],
      [
        "At home I brew the odd batch on a Grainfather, with mixed results and a lot of cleaning.",
        "I also keep a running list of the best pubs in London, updated every year — good beer, good people, music quiet enough to talk over.",
      ],
    ],
    link: {
      label: "Top 10 pubs in London, 2025",
      href: "/blog/top-10-pubs-in-london-2025",
    },
  },
  travel: {
    hero: "travel/dolomites/mountain-02.jpg",
    intro:
      "I travel for the culture, the beer and the food — ideally all three before lunch. Mostly Europe, the odd long-haul, always too many photos of buildings.",
    places: [
      {
        name: "Valencia",
        country: "Spain",
        photos: "travel/valencia",
        note: "Calatrava’s City of Arts and Sciences, beach volleyball and clóchinas by the sea.",
      },
      {
        name: "Belgium",
        country: "Ghent & around",
        photos: "travel/belgium",
        note: "Canal-side gables, Trappist beer and a long afternoon at the Waterhuis aan de Bierkant.",
      },
      {
        name: "New York",
        country: "USA",
        photos: "travel/new-york",
        note: "Bridges, the Oculus and craning up at the Woolworth Building.",
      },
      {
        name: "Dolomites",
        country: "Italy",
        photos: "travel/dolomites",
        note: "Hiking with friends under jagged peaks, wildflowers all the way up.",
      },
    ],
  },
};
