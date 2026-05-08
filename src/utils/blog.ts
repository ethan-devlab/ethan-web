import Fuse from 'fuse.js'
import type { ComponentType, ElementType } from 'react'
import type { Language } from '../i18n/locales'
import { isLanguage } from '../i18n/locales'

type MdxComponentProps = {
  components?: Record<string, ElementType>
}

export type BlogPost = {
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  published: boolean
  pin: boolean
  lang: Language
  slug: string
  Component: ComponentType<MdxComponentProps>
}

export type BlogModule = {
  default: ComponentType<MdxComponentProps>
  frontmatter?: Record<string, unknown>
}

const compiledModules = import.meta.glob('../content/blog/*/*.mdx', {
  eager: true,
}) as Record<string, BlogModule>

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

  if (a.date !== b.date) {
    return a.date < b.date ? 1 : -1
  }

  return a.title.localeCompare(b.title)
}

function buildPostList(): BlogPost[] {
  return Object.entries(compiledModules)
    .map(([path, module]) => {
      if (!module.default) {
        return null
      }

      const data = module.frontmatter ?? {}
      const pathLang = getLangFromPath(path)
      const frontmatterLang = asString(data.lang, pathLang)
      const lang = isLanguage(frontmatterLang) ? frontmatterLang : pathLang
      const slug = asString(data.slug, getSlugFromPath(path))

      return {
        title: asString(data.title, slug),
        description: asString(data.description, ''),
        date: normalizeDate(asString(data.date, '2026-01-01')),
        category: asString(data.category, 'General'),
        tags: asStringList(data.tags),
        published: data.published === true,
        pin: data.pin === true,
        lang,
        slug,
        Component: module.default,
      } satisfies BlogPost
    })
    .filter((post): post is BlogPost => Boolean(post))
    .sort(sortPosts)
}

const allPosts = buildPostList()

export function getAllPosts(): BlogPost[] {
  return allPosts.filter((post) => post.published)
}

export function getPublishedPostsByLang(lang: Language): BlogPost[] {
  return allPosts.filter((post) => post.lang === lang && post.published)
}

export function getPublishedPostBySlug(lang: Language, slug: string): BlogPost | undefined {
  return getPublishedPostsByLang(lang).find((post) => post.slug === slug)
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
