import type { Language } from './locales'

export type TranslationTree = {
  brandName: string
  nav: {
    home: string
    experience: string
    blog: string
    contact: string
  }
  common: {
    languageSwitcher: string
    themeDark: string
    themeLight: string
    readArticle: string
    noData: string
  }
  home: {
    ctaExperience: string
    ctaContact: string
    ctaAboutMe: string
  }
}

export const translations: Record<Language, TranslationTree> = {
  zh: {
    brandName: 'Ethan Chan 曾嘉誠',
    nav: {
      home: '首頁',
      experience: '經歷',
      blog: '部落格',
      contact: '聯絡',
    },
    common: {
      languageSwitcher: '中 / EN',
      themeDark: 'Dark',
      themeLight: 'Light',
      readArticle: '閱讀文章',
      noData: '目前沒有符合條件的文章。',
    },
    home: {
      ctaExperience: '查看經歷',
      ctaContact: '聯絡我',
      ctaAboutMe: '關於我',
    },
  },
  en: {
    brandName: 'Ethan Chan',
    nav: {
      home: 'Home',
      experience: 'Experience',
      blog: 'Blog',
      contact: 'Contact',
    },
    common: {
      languageSwitcher: '中 / EN',
      themeDark: 'Dark',
      themeLight: 'Light',
      readArticle: 'Read Article',
      noData: 'No posts matched your filters.',
    },
    home: {
      ctaExperience: 'View Experience',
      ctaContact: 'Contact Me',
      ctaAboutMe: 'About Me',
    },
  },
}
