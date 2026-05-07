import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Theme } from '../../utils/theme'
import type { Language } from '../../i18n/locales'
import { translations } from '../../i18n/translations'
import { navigationItems } from '../../data/navigation'
import { trackButtonClick } from '../../utils/analytics'
import { withLanguageBase } from '../../utils/language'
import { ThemeToggle } from '../common/ThemeToggle'
import { LanguageSwitcher } from '../common/LanguageSwitcher'

type HeaderProps = {
  lang: Language
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ lang, theme, onToggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = translations[lang]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const homePath = withLanguageBase(lang, '')

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`.trim()}>
      <div className="container header__inner">
        <Link
          to={homePath}
          className="header__brand"
          onClick={() => trackButtonClick({ label: 'brand_home', area: 'header_navigation', target: homePath })}
        >
          Ethan Chan 曾嘉誠
        </Link>

        <button
          type="button"
          className="header__menu-button"
          aria-expanded={isMenuOpen}
          onClick={() => {
            trackButtonClick({ label: isMenuOpen ? 'close_menu' : 'open_menu', area: 'header' })
            setIsMenuOpen((open) => !open)
          }}
        >
          Menu
        </button>

        <motion.div
          className={`header__panel ${isMenuOpen ? 'header__panel--open' : ''}`.trim()}
          initial={false}
          animate={{ opacity: isMenuOpen ? 1 : 0.98, y: isMenuOpen ? 0 : -2 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="header__nav">
            {navigationItems.map((item) => {
              const itemPath = withLanguageBase(lang, item.segment)

              return (
                <NavLink
                  key={item.key}
                  to={itemPath}
                  end={item.segment === ''}
                  className={({ isActive }) =>
                    `header__link ${isActive ? 'header__link--active' : ''}`.trim()
                  }
                  onClick={() => {
                    trackButtonClick({
                      label: `nav_${item.key}`,
                      area: 'header_navigation',
                      target: itemPath,
                    })
                    setIsMenuOpen(false)
                  }}
                >
                  {item.label[lang] ?? t.nav[item.key]}
                </NavLink>
              )
            })}
          </nav>

          <div className="header__actions">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </motion.div>
      </div>
    </header>
  )
}
