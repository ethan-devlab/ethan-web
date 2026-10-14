import { motion } from 'framer-motion'
import { useReducedMotionPreference } from '../../utils/useReducedMotionPreference'
import type { Language } from '../../i18n/locales'
import avatarImage from '../../assets/me.jpg'
import avatarWebp from '../../assets/me.webp'
import '../../styles/hero-review.css'

type HeroSectionProps = {
  lang: Language
  layout?: 'original' | 'split'
}

function setPortraitFallback(image: HTMLImageElement | null) {
  // WebKit can request a detached img before its picture source is attached.
  if (image) image.src = avatarImage
}

// const heroDescription = {
//   zh: '喜歡 coding 和研究新科技，對 AI、資安、IoT 和軟體工程都有興趣。目前專注在無人機影像處理、無人機導航算法、地端 AI 應用開發、自動化應用開發、網站開發和系統架構分析與設計。',
//   en: 'Passionate about coding and exploring new technologies, with interests spanning AI, information security, IoT, and software engineering. Currently focused on drone image processing, drone navigation algorithms, ground-based AI application development, automation application development, web development, and system architecture analysis and design.',
// }

export function HeroSection({ lang, layout = 'original' }: HeroSectionProps) {
  const reducedMotion = useReducedMotionPreference()
  return (
    <section
      className={`section hero-section${layout === 'split' ? ' hero-section--split' : ''}`}
      lang={lang === 'zh' ? 'zh-Hant' : 'en'}
    >
      <div className="container">
        <div className="hero__intro">
          <motion.h1
            className="hero__name"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
          >
            Ethan Chan <span className="hero__chinese-name">曾嘉誠</span>
          </motion.h1>
          <motion.div
            className="hero__avatarFrame"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.06 }}
          >
            <picture>
              <source srcSet={avatarWebp} type="image/webp" />
              <img ref={setPortraitFallback} alt="Ethan Chan portrait" className="hero__avatar" />
            </picture>
          </motion.div>
        </div>
        <motion.p
          className="hero__role"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.08 }}
        >
          <span className='hero__role-text'><b>Developer</b></span>
          <br />
          <strong>Based in Malaysia, anak 🇲🇾. Currently studying in Taiwan.</strong>
        </motion.p>
        {/* <motion.p
          className="hero__description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          {heroDescription[lang]}
        </motion.p> */}
        {/* <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        > */}
          {/* <Link
            className={getButtonClass('primary')}
            to={`/${lang}/experience`}
            onClick={() =>
              trackButtonClick({ label: 'hero_experience', area: 'hero', target: `/${lang}/experience` })
            }
          >
            {t.home.ctaExperience}
          </Link> */}
          {/* <Link
            className={getButtonClass('secondary')}
            to={`/${lang}/contact`}
            onClick={() => trackButtonClick({ label: 'hero_contact', area: 'hero', target: `/${lang}/contact` })}
          >
            {t.home.ctaContact}
          </Link>
          <Link
            className={getButtonClass('tertiary')}
            to={aboutMePath}
            onClick={() => trackButtonClick({ label: 'hero_about_me', area: 'hero', target: aboutMePath })}
          >
            {t.home.ctaAboutMe}
          </Link> */}
        {/* </motion.div> */}
      </div>
    </section>
  )
}
