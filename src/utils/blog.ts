import Fuse from 'fuse.js'
import type { ComponentType, ElementType } from 'react'
import { lazy } from 'react'
import type { Language } from '../i18n/locales'
import { isLanguage } from '../i18n/locales'

type MdxComponentProps = {
  components?: Record<string, ElementType>
}

export type BlogPost = {
  title: string
  description: string
  date: string
  lastmod: string
  category: string
  tags: string[]
  published: boolean
  pin: boolean
  lang: Language
  slug: string
  Component: ComponentType<MdxComponentProps>
  loadComponent: () => Promise<BlogModule>
}

export type BlogModule = {
  default: ComponentType<MdxComponentProps>
  frontmatter?: Record<string, unknown>
}

type BlogPostQueryOptions = {
  includeDrafts?: boolean
}

const DRAFT_PREVIEW_PARAM = 'preview'
const DRAFT_PREVIEW_VALUE = 'drafts'

const compiledModules = import.meta.glob('../content/blog/*/*.mdx', {
}) as Record<string, () => Promise<BlogModule>>

const metadataModules = import.meta.glob('../content/blog/*/*.mdx', {
  eager: true,
  query: '?frontmatter',
  import: 'frontmatter',
}) as Record<string, Record<string, unknown> | undefined>

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === 'string')
}

function getLangFromPath(path: string): Language {
  const parts = path.split('/')
  const candidate = parts[parts.length - 2]
  return isLanguage(candidate) ? candidate : 'zh'
}

function getSlugFromPath(path: string): string {
  const fileName = path.split('/').pop() ?? ''
  return fileName.replace('.mdx', '')
}

function normalizeDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }
  return '2026-01-01'
}

function sortPosts(a: BlogPost, b: BlogPost): number {
  if (a.pin !== b.pin) {
    return a.pin ? -1 : 1
  }

  const aSortDate = a.lastmod || a.date
  const bSortDate = b.lastmod || b.date

  if (aSortDate !== bSortDate) {
    return aSortDate < bSortDate ? 1 : -1
  }

  return a.title.localeCompare(b.title)
}

function buildPostList(): BlogPost[] {
  return Object.entries(metadataModules)
    .map(([path, frontmatter]): BlogPost | null => {
      const load = compiledModules[path]
      if (!load) {
        return null
      }

      const data = frontmatter ?? {}
      const pathLang = getLangFromPath(path)
      const frontmatterLang = asString(data.lang, pathLang)
      const lang = isLanguage(frontmatterLang) ? frontmatterLang : pathLang
      const slug = asString(data.slug, getSlugFromPath(path))

      return {
        title: asString(data.title, slug),
        description: asString(data.description, ''),
        date: normalizeDate(asString(data.date, '2026-01-01')),
        lastmod: (asString(data.lastmod, '') === '') ? "" : normalizeDate(asString(data.lastmod, '2026-01-01')),
        category: asString(data.category, 'General'),
        tags: asStringList(data.tags),
        published: data.published === true,
        pin: data.pin === true,
        lang,
        slug,
        Component: lazy(load),
        loadComponent: load,
      } satisfies BlogPost
    })
    .filter((post): post is BlogPost => Boolean(post))
    .sort(sortPosts)
}

const allPosts = buildPostList()

export function preloadBlogPost(slug: string, lang: Language) {
  return getBlogPostBySlug(slug, lang)?.loadComponent()
}

export function isDraftPreviewEnabled(searchParams: URLSearchParams): boolean {
  return import.meta.env.DEV && searchParams.get(DRAFT_PREVIEW_PARAM) === DRAFT_PREVIEW_VALUE
}

export function getBlogPosts(options: BlogPostQueryOptions = {}): BlogPost[] {
  return allPosts.filter((post) => options.includeDrafts || post.published)
}

export function getAllPosts(): BlogPost[] {
  return getBlogPosts()
}

export function getBlogPostBySlug(
  slug: string,
  lang: Language,
  options: BlogPostQueryOptions = {},
): BlogPost | undefined {
  return allPosts.find(
    (post) => post.slug === slug && post.lang === lang && (options.includeDrafts || post.published),
  )
}

export function getPublishedPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug && post.published)
}

export function getCategories(posts: BlogPost[]): string[] {
  return Array.from(new Set(posts.map((post) => post.category))).sort((a, b) => a.localeCompare(b))
}

export function getTags(posts: BlogPost[]): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))
}

export function filterPosts(
  posts: BlogPost[],
  searchText: string,
  language: string,
  category: string,
  tag: string,
): BlogPost[] {
  let current = posts

  if (language !== 'all') {
    current = current.filter((post) => post.lang === language)
  }

  if (category !== 'all') {
    current = current.filter((post) => post.category === category)
  }

  if (tag !== 'all') {
    current = current.filter((post) => post.tags.includes(tag))
  }

  const normalized = searchText.trim()
  if (!normalized) {
    return [...current].sort(sortPosts)
  }

  const fuse = new Fuse(current, {
    keys: ['title', 'description', 'tags', 'category'],
    threshold: 0.35,
    ignoreLocation: true,
  })

  return fuse
    .search(normalized)
    .map((entry) => entry.item)
    .sort(sortPosts)
}
