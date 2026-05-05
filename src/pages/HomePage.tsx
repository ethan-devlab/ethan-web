import { useParams } from 'react-router-dom'
import { HeroSection } from '../components/home/HeroSection'
import { SkillTree } from '../components/home/SkillTree'
import { ProjectCarousel } from '../components/home/ProjectCarousel'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { SEO } from '../components/common/SEO'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function HomePage() {
  const { lang } = useParams()
  const language = resolveLanguage(lang)
  const description =
    language === 'zh'
      ? 'Ethan Chan 曾嘉誠的個人技術品牌網站，記錄做過的專案、學過的技能和部落格寫作。'
      : 'Ethan Chan\'s personal tech brand website, documenting projects, skills learned, and blog writing.'

  return (
    <>
      <SEO title={language === 'zh' ? '首頁' : 'Home'} description={description} path={`/${language}/`} />
      <HeroSection lang={language} />
      <SkillTree lang={language} />
      <ProjectCarousel lang={language} />
    </>
  )
}
