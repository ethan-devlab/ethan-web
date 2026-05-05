import type { ReactNode } from 'react'
import type { Language } from '../../i18n/locales'
import { Section } from '../common/Section'

type BlogLayoutProps = {
  lang: Language
  children: ReactNode
}

export function BlogLayout({ lang, children }: BlogLayoutProps) {
  return (
    <Section
      title={lang === 'zh' ? '部落格' : 'Blog'}
      description={
        lang === 'zh'
          ? 'Ethan 的寫作空間，會分享一些實做心得、技術分析和專案回顧'
          : 'Ethan’s writing space, where I share practical insights, technical analysis, and project retrospectives'
      }
      className="section--spacious"
    >
      {children}
    </Section>
  )
}
