import type { Language } from '../i18n/locales'
import { DEFAULT_LANGUAGE, isLanguage } from '../i18n/locales'

const languagePrefix = /^\/(zh|en)(\/|$)/

export function getLanguageFromPath(pathname: string): Language {
  const match = pathname.match(languagePrefix)
  if (!match) {
    return DEFAULT_LANGUAGE
  }
  const candidate = match[1]
  return isLanguage(candidate) ? candidate : DEFAULT_LANGUAGE
}

export function switchLanguagePath(pathname: string, target: Language): string {
  if (languagePrefix.test(pathname)) {
    return pathname.replace(languagePrefix, `/${target}$2`)
  }
  return `/${target}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export function withLanguageBase(lang: Language, segment: string): string {
  return segment ? `/${lang}/${segment}` : `/${lang}/`
}
