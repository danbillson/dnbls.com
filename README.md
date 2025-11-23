# dnbls.com

My personal portfolio and blog built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Portfolio**: Showcase of my work, skills, and experiences
- 📝 **Blog**: Articles about software engineering, tech, and personal interests
- 📄 **CV**: Professional background and experience
- 💻 **Projects**: Highlights of my development projects
- 📦 **Content Management**: MDX content with @next/mdx

## Tech Stack

- ⚡ **Framework**: Next.js 16
- ⚛️ **React**: React 19
- 🔷 **Language**: TypeScript
- 🎨 **Styling**: Tailwind CSS v4
- 📝 **Content**: @next/mdx with remark and rehype plugins
- 🚀 **Deployment**: Vercel

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Run the development server

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Content Structure

- `app/` - Next.js app directory with page components
- `components/` - Reusable React components
- `content/blog/` - MDX blog posts
- `public/` - Static assets
- `styles/` - Global styles and Tailwind configuration
- `lib/` - Utility functions and MDX content management

## Adding New Content

### Blog Posts

Add new MDX files to the `content/blog/` directory with the following format:

```mdx
export const metadata = {
  title: "Post Title",
  date: "YYYY-MM-DD",
  description: "Brief description of the post",
};

Content...
```

After adding a new blog post, you'll need to:

1. Add the import to `lib/mdx.ts`
2. Add the component to `app/blog/[...slug]/page.tsx`
3. Add the metadata to the `allPostsData` array in `lib/mdx.ts`

## Key Dependencies

- **@next/mdx**: MDX support for Next.js
- **@tailwindcss/postcss**: Tailwind CSS v4 PostCSS plugin
- **@tailwindcss/typography**: Typography plugin for prose content
- **tailwindcss-animate**: Animation utilities
- **motion**: Animation library (formerly framer-motion)
- **rehype-pretty-code**: Syntax highlighting for code blocks
- **remark-gfm**: GitHub Flavored Markdown support
