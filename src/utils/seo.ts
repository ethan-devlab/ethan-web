export const SITE_NAME = 'Ethan Chan'
export const SITE_URL = 'https://example.com'

export function getCanonicalUrl(path: string): string {
  if (!path.startsWith('/')) {
    return `${SITE_URL}/${path}`
  }
  return `${SITE_URL}${path}`
}
