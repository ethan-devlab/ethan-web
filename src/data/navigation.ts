import type { LocalizedText } from './types'

export type NavigationItem = {
  key: 'home' | 'experience' | 'blog' | 'contact'
  segment: '' | 'experience' | 'blog' | 'contact'
  label: LocalizedText
}

export const navigationItems: NavigationItem[] = [
  {
    key: 'home',
    segment: '',
    label: { zh: '首頁', en: 'Home' },
  },
  {
    key: 'experience',
    segment: 'experience',
    label: { zh: '經歷', en: 'Experience' },
  },
  {
    key: 'blog',
    segment: 'blog',
    label: { zh: '部落格', en: 'Blog' },
  },
  {
    key: 'contact',
    segment: 'contact',
    label: { zh: '聯絡', en: 'Contact' },
  },
]
