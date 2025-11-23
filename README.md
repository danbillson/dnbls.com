# dnbls.com

My personal portfolio and blog built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Portfolio**: Showcase of my work, skills, and experiences
- 📝 **Blog**: Articles about software engineering, tech, and personal interests
- 📄 **CV**: Professional background and experience
- 💻 **Projects**: Highlights of my development projects
- 📦 **Content Management**: Uses ContentLayer for MDX content

## Tech Stack

- ⚡ **Framework**: Next.js
- 🔷 **Language**: TypeScript
- 🎨 **Styling**: Tailwind CSS
- 📝 **Content**: ContentLayer with MDX
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
- `styles/` - Global styles
- `lib/` - Utility functions and shared code

## Adding New Content

### Blog Posts

Add new MDX files to the `content/blog/` directory with the following frontmatter:

```md
---
title: Post Title
date: YYYY-MM-DD
description: Brief description of the post
---

Content...
```
