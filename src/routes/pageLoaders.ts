export const pageLoaders = {
  experience: () => import('../pages/ExperiencePage').then(module => ({ default: module.ExperiencePage })),
  resume: () => import('../pages/ResumePage').then(module => ({ default: module.ResumePage })),
  photography: () => import('../pages/PhotographyPage').then(module => ({ default: module.PhotographyPage })),
  blog: () => import('../pages/BlogListPage').then(module => ({ default: module.BlogListPage })),
  blogPost: () => import('../pages/BlogPostPage').then(module => ({ default: module.BlogPostPage })),
  contact: () => import('../pages/ContactPage').then(module => ({ default: module.ContactPage })),
}

export function preloadNavigationPage(segment: string) {
  if (!Object.prototype.hasOwnProperty.call(pageLoaders, segment)) return
  return pageLoaders[segment as keyof typeof pageLoaders]().then(() => undefined).catch(() => undefined)
}

export function preloadRoutePage(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (base && !pathname.startsWith(`${base}/`)) return
  const match = pathname.slice(base.length).match(/^\/(zh|en)\/(experience|resume|photography|blog|contact)(?:\/([^/]+))?\/?$/)
  if (!match || (match[3] && match[2] !== 'blog')) return
  if (match[2] === 'blog' && match[3]) {
    return preloadNavigationPage('blogPost')?.then(async () => {
      const { preloadBlogPost } = await import('../utils/blog')
      await preloadBlogPost(match[3], match[1] as 'zh' | 'en')
    }).catch(() => undefined)
  }
  return preloadNavigationPage(match[2])
}
