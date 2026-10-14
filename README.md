# Ethan Web
My official website built with React, Vite, and TypeScript.

## Stack
React, TypeScript, Vite, React Router, MDX, Framer Motion, Fuse.js, Swiper, and React Helmet Async.

## Design
`DESIGN.md` is the visual source of truth, inspired by [awesome-design-md](https://github.com/VoltAgent/awesome-design-md).

The site preserves the original forest-green palette with equivalent OKLCH notation. English headings use Space Grotesk and body text uses Inter. The homepage uses a split hero, five project rows, a full-image photography carousel, and skill disclosures that start closed. The photography page includes deferred 3D gallery lights with reduced-motion support. See `DESIGN.md` for current decisions and [the design review](docs/design-review.md) for historical prototype evidence.

## Development
Install dependencies with `pnpm install`, then run `pnpm dev`.

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:e2e`

## Content
Blog posts live in `src/content/blog/zh/` and `src/content/blog/en/`. Keep frontmatter complete with `title`, `description`, `date`, `category`, `tags`, `published`, `lang`, and `slug`. Use `lastmod` for the update date. Pinned posts appear first; other posts sort by `lastmod`, with `date` as the fallback. Posts with `published: false` stay hidden in production.

## Environment and Deployment
Set `VITE_GA_MEASUREMENT_ID` locally only if you want Google Analytics enabled. Never commit local environment files.

Cloudflare Pages uses `pnpm install --frozen-lockfile`, `pnpm build`, and the `dist` output directory. GitHub Actions checks lint, types, and build on Node 24. Deploy and push only when the owner requests them.

## Contact
- Email: [hello@ethan-devlab.com](mailto:hello@ethan-devlab.com)
