# Ethan Portfolio Agent Guide

This repository is near completion. Keep changes small, preserve the current architecture, and treat the existing code, data files, and `DESIGN.md` as the source of truth.

## 1. Project Scope

- Build and maintain Ethan Chan’s bilingual personal portfolio website.
- Keep the tone professional, technical-consulting-style, and highly structured.
- Use centralized placeholder content only where the real copy has not been finalized.
- Prefer local fixes over broad refactors.

## 2. Current Stack

- React + TypeScript + Vite.
- `react-router-dom` with browser routing and `import.meta.env.BASE_URL` as the basename.
- MDX blog content with `gray-matter` frontmatter parsing.
- `react-helmet-async` for SEO metadata.
- `framer-motion` for subtle animation.
- `fuse.js` for blog search.
- Swiper for the project carousel.

## 3. Design System

- `DESIGN.md` is the visual source of truth.
- The site is dark-first and Shopify-inspired.
- Use deep forest and teal-black surfaces, cinematic spacing, ultra-light display typography, full-pill buttons, and layered shadows.
- Neon Green `#36F4A4` is limited to focus rings, active states, and small accents.
- Preserve the current font stacks, spacing scale, and token-based styling.
- Keep motion low-key: fade-in, subtle slide-up, hover elevation, and gentle menu transitions only.

## 4. Routing and Localization

- Canonical routes are `/zh/` and `/en/`.
- Root `/` redirects to `/zh/`.
- Keep the route structure stable:
  - `/zh/`, `/zh/experience`, `/zh/blog`, `/zh/blog/:slug`, `/zh/contact`
  - `/en/`, `/en/experience`, `/en/blog`, `/en/blog/:slug`, `/en/contact`
- Preserve the navigation order: Home, Experience, Blog, Contact.
- Keep the language switcher behavior intact so it preserves the current page intent.
- Maintain the localized labels in `src/data/navigation.ts` and related i18n files.

## 5. Data and Content Conventions

- Keep reusable content centralized in `src/data/`.
- `src/data/navigation.ts` owns menu labels and route segments.
- `src/data/projects.ts` must continue to provide exactly 3 homepage projects.
- `src/data/skills.ts` owns the grouped skill sections shown on the home page.
- `src/data/experiences.ts` owns the summary, timeline, project experience, and architecture highlights.
- `src/data/contact.ts` is the single source of truth for email and social links; do not hard-code contact details in components.
- Keep blog posts in `src/content/blog/zh/` and `src/content/blog/en/`.
- Blog frontmatter must include title, description, date, category, tags, published, lang, and slug.
- Keep published drafts hidden when `published: false`.

## 6. Page Requirements

- Home page: hero, skill tree, and exactly 3 project cards. No demo link.
- Experience page: professional summary, timeline, project experience, and architecture highlights. Explain the problem, decision, and outcome.
- Blog: list page and post page, search, category filter, tag filter, empty state, and readable MDX code blocks.
- Contact page: contact information and a short invitation only. Do not add a backend form.
- Keep the footer aligned with the contact data and do not show LinkedIn anywhere.

## 7. SEO and Analytics

- Keep `src/utils/seo.ts` as the metadata helper and preserve the placeholder canonical URL until a real site domain exists.
- Every page should continue to provide title, description, `og:title`, `og:description`, `og:type`, and canonical metadata.
- `src/utils/analytics.ts` should only load Google Analytics when `VITE_GA_MEASUREMENT_ID` is present.
- Keep `.env.example` with `VITE_GA_MEASUREMENT_ID=` only.
- Never commit `.env`, `.env.local`, real analytics IDs, or other secrets.

## 8. Git, CI, and Deployment

- Generate one final English commit message only after the work is complete. Use conventional prefix like `feat:`, `fix:`, `docs:`, etc.
- Don't commit. Let the author, Ethan, review the final changes and commit.
- Run `pnpm build`, `pnpm lint`, and `pnpm typecheck` when the scripts exist.
- CI lives in `.github/workflows/ci.yml` and currently runs on Node 24 with `pnpm install --frozen-lockfile`, lint, typecheck, and build.
- Cloudflare Pages should keep `pnpm install --frozen-lockfile` as the install command, `pnpm build` as the build command, and `dist` as the output directory.
- Preserve `BrowserRouter` and keep SPA fallback behavior working for deep links. Cloudflare Pages fallback is handled by `public/_redirects`.

## 9. README and Documentation

- Keep `README.md` concise but complete.
- It should cover project name, project description, tech stack, design system source, local development, environment variables, blog authoring, bilingual content, Cloudflare Pages deployment, GitHub Actions CI, and git workflow.
- Include a short guide for adding new blog posts in both language folders.

## 10. Non-Negotiables

- No unauthorized font files.
- No LinkedIn link.
- No comments system.
- No RSS feed.
- No backend contact form.
- No real secrets or production analytics IDs in the repository.
- Do not reimplement mature features when standard libraries already cover the need.
- Keep carousel, blog parsing, and search implementations simple and maintainable.

## 11. Definition of Done

- The app builds successfully with React + TypeScript + Vite.
- Home, Experience, Blog, and Contact all exist and are wired through language-prefix routing.
- Navbar order, language switcher, and theme toggle work.
- Footer shows the current contact data and no LinkedIn.
- Home keeps the hero, skill tree, and 3 projects.
- Experience content explains problems, decisions, and outcomes.
- Blog supports MDX, bilingual content, categories, search, tags, and hidden drafts.
- Contact remains form-free.
- Dark mode still follows `DESIGN.md`, and light mode remains professional.
- SEO metadata, GA placeholder wiring, `.env.example`, CI, README, and deployment readiness remain intact.