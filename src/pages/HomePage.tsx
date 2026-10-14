import { Link, useParams, useSearchParams } from 'react-router-dom'
import { HeroSection } from '../components/home/HeroSection'
import { SkillTree } from '../components/home/SkillTree'
import { HomeProjectList } from '../components/home/HomeProjectList'
import { DeferredHomePhotography } from '../components/home/DeferredHomePhotography'
import { ClosingCta } from '../components/home/ClosingCta'
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
  const [searchParams] = useSearchParams()
  const heroLayout = searchParams.get('hero') === 'original' ? 'original' : 'split'
  const heroReview = (layout: 'split' | 'original') => {
    const params = new URLSearchParams(searchParams)
    params.set('hero', layout)
    return `?${params.toString()}`
  }
  const language = resolveLanguage(lang)
  const description =
    language === 'zh'
      ? 'Ethan Chan 曾嘉誠的個人技術品牌網站，記錄做過的專案、學過的技能、攝影集和部落格寫作。'
      : 'Ethan Chan\'s personal tech brand website, documenting projects, skills learned, and blog writing.'

  return (
    <>
      <SEO title={language === 'zh' ? '首頁' : 'Home'} description={description} path={`/${language}/`} />
      {searchParams.has('hero') ? <nav className="container hero-review" aria-label="首頁構圖比較">
        <Link to={heroReview('split')} aria-current={heroLayout === 'split' ? 'true' : undefined}>
          1 · 左右構圖
        </Link>
        <Link to={heroReview('original')} aria-current={heroLayout === 'original' ? 'true' : undefined}>
          2 · 原版構圖
        </Link>
      </nav> : null}
      <div className="home-page">
      <HeroSection lang={language} layout={heroLayout} />
      <HomeProjectList lang={language} />
      <DeferredHomePhotography lang={language} />
      <SkillTree lang={language} />
      <ClosingCta lang={language} />
      </div>
    </>
  )
}
