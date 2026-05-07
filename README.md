# Ethan Portfolio Website

## Project name

Ethan Chan 曾嘉誠 Personal Portfolio

## Project description

A bilingual (Chinese/English) personal brand website for Ethan Chan, focused on software engineering capabilities, system architecture thinking, project experience, photography work, technical blog writing, and contact channels.

## Tech stack

- React
- TypeScript
- Vite
- React Router
- MDX
- gray-matter
- Fuse.js
- Framer Motion
- react-icons
- Swiper
- react-helmet-async

## Design system source

This project follows:

- `AGENTS.md` for product/feature requirements
- `DESIGN.md` for visual system rules (dark-first Shopify-inspired system)

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create `.env` (do not commit):

```txt
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Template is provided in `.env.example`:

```txt
VITE_GA_MEASUREMENT_ID=
```

## Blog authoring guide

## Add a new blog post

Create a new `.mdx` file under:

```txt
src/content/blog/zh/
src/content/blog/en/
```

Add frontmatter:

```md
---
title: "Post title"
description: "Short summary"
date: "2026-04-29"
category: "System Design"
tags: ["React", "Architecture"]
published: true
pin: false
lang: "en"
slug: "post-title"
---
```

Then write your article content below frontmatter using Markdown/MDX syntax.

## Bilingual content guide

- Chinese routes: `/zh/`, `/zh/experience`, `/zh/photography`, `/zh/blog`, `/zh/blog/:slug`, `/zh/contact`
- English routes: `/en/`, `/en/experience`, `/en/photography`, `/en/blog`, `/en/blog/:slug`, `/en/contact`
- Language switcher keeps current page intent (`/zh/experience` -> `/en/experience`)
- Keep paired zh/en articles with consistent slugs where possible

## Photography content guide

Photography entries live in `src/data/photography.ts`.

The placeholder version uses stable Lorem Picsum URLs. To replace them with real work, add image files under:

```txt
public/photography/
```

Then change an entry's `images` value to one or more filenames, for example:

```ts
images: ['taipei-night-01.jpg', 'taipei-night-02.jpg']
```

## Deployment guide for Zeabur

Use these settings in Zeabur:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Flow:

1. Push this repository to GitHub (private).
2. In Zeabur, import the GitHub repository.
3. Apply the build settings above.
4. Deploy and verify deep links like `/zh/blog/system-design-note`.

If deep-link refresh returns 404, configure SPA fallback on the platform side while keeping `BrowserRouter`.

## GitHub Actions CI

CI file: `.github/workflows/ci.yml`

Workflow steps:

1. `npm ci`
2. `npm run lint --if-present`
3. `npm run typecheck --if-present`
4. `npm run build`

## Git workflow

1. Implement all features first.
2. Run checks:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
3. Create a single final commit:
   - `feat: build bilingual personal portfolio website`
4. Push to a private GitHub repository.
