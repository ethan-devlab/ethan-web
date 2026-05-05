export const SITE_NAME = 'Ethan Chan'
export const SITE_URL = 'https://ethan-devlab.github.io/ethan-web/'

export function getCanonicalUrl(path: string): string {
  if (!path.startsWith('/')) {
    return `${SITE_URL}/${path}`
  }
  return `${SITE_URL}${path}`
}
