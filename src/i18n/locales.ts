export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'

export function isLanguage(value: string | undefined): value is Language {
  return value === 'zh' || value === 'en'
}
