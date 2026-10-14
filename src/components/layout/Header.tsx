import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import type { Theme } from '../../utils/theme'
import type { Language } from '../../i18n/locales'
import { navigationItems } from '../../data/navigation'
import { trackButtonClick } from '../../utils/analytics'
import { withLanguageBase } from '../../utils/language'
import { useReducedMotionPreference } from '../../utils/useReducedMotionPreference'
import { preloadNavigationPage } from '../../routes/pageLoaders'
import { ThemeToggle } from '../common/ThemeToggle'
import { LanguageSwitcher } from '../common/LanguageSwitcher'

type HeaderProps = {
  lang: Language
  theme: Theme
  onToggleTheme: () => void
  isPageLoading?: boolean
}

export function Header({ lang, theme, onToggleTheme, isPageLoading = false }: HeaderProps) {
  const reducedMotion = useReducedMotionPreference()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        document.getElementById('navigation-menu-button')?.focus()
      }
    }
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.button !== 0 || !(event.target instanceof Node)) return
      const panel = menuPanelRef.current
      const button = menuButtonRef.current
      const path = event.composedPath()
      if ((panel && path.includes(panel)) || (button && path.includes(button))) return
      if (panel?.contains(document.activeElement)) button?.focus({ preventScroll: true })
      setIsMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('click', closeOnOutsideClick)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('click', closeOnOutsideClick)
    }
  }, [isMenuOpen])
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
          id="navigation-menu-button"
          ref={menuButtonRef}
          className="header__menu-button"
          aria-controls="navigation-panel"
          aria-expanded={isMenuOpen}
          aria-label="Menu"
          onClick={() => {
            trackButtonClick({ label: isMenuOpen ? 'close_menu' : 'open_menu', area: 'header' })
            setIsMenuOpen((open) => !open)
          }}
        >
          {isMenuOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
        </button>

        <motion.div
          id="navigation-panel"
          ref={menuPanelRef}
          className={`header__panel ${isMenuOpen ? 'header__panel--open' : ''}`.trim()}
          initial={false}
          animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: isMenuOpen ? 1 : 0.98, y: isMenuOpen ? 0 : -2 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <nav className="header__nav">
            {navigationItems.map((item) => {
              const itemPath = withLanguageBase(lang, item.segment)

              return (
                <NavLink
                  key={item.key}
                  to={itemPath}
                  onMouseEnter={() => preloadNavigationPage(item.segment)}
                  onFocus={() => preloadNavigationPage(item.segment)}
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
                  {item.label[lang]}
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
      {isPageLoading ? <div className="header__loading" aria-hidden="true"><span /></div> : null}
    </header>
  )
}
