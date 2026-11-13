<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design system

`dnbls-design/` is the site's design system and also a global agent skill
(symlinked into `~/.agents/skills` and `~/.claude/skills`). `tokens.css`,
`fonts.ts` and `palette.ts` there are imported by the site (`@design/*`).
When you change a token, a type style, a motion curve or a signature
pattern, update `dnbls-design/SKILL.md` (and `components.md` if a
component moves) in the same change.
