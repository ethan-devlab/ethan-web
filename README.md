# Ethan Web
My official website built with React, Vite, and TypeScript.

## Stack
React, TypeScript, Vite, React Router, MDX, Framer Motion, Fuse.js, Swiper, and React Helmet Async.

## Design
`DESIGN.md` is the visual source of truth, inspired by [awesome-design-md](https://github.com/VoltAgent/awesome-design-md).

## Development
Install dependencies with `pnpm install`, then run `pnpm dev` for local development.

Other common commands:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:e2e`

## Content
Blog posts live in `src/content/blog/zh/` and `src/content/blog/en/`. Add matching posts in both folders when you want bilingual coverage, and keep frontmatter complete with `title`, `description`, `date`, `category`, `tags`, `published`, `lang`, and `slug`.

## Environment
Set `VITE_GA_MEASUREMENT_ID` locally only if you want Google Analytics enabled.

## Contact
- Email: [hello@ethan-devlab.com](mailto:hello@ethan-devlab.com)