import { Link, Outlet, useLocation, useNavigationType, useParams } from 'react-router-dom'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoadingState } from '../common/PageLoadingState'
import { ContentErrorBoundary } from '../common/ContentErrorBoundary'
import { ButtonLabel } from '../common/ButtonLabel'
import { Section } from '../common/Section'
import { preloadRoutePage } from '../../routes/pageLoaders'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../../i18n/locales'
import { getLanguageFromPath } from '../../utils/language'
import { getInitialTheme, setTheme, type Theme } from '../../utils/theme'
import { trackPageView } from '../../utils/analytics'
import { recoverObsoleteVersion } from '../../utils/versionRecovery'
import { MotionConfig } from 'framer-motion'
import '../../styles/functional-accent.css'
import '../../styles/button-review.css'

function resolveLanguage(raw: string | undefined): Language {
  if (!raw || !isLanguage(raw)) {
    return DEFAULT_LANGUAGE
  }
  return raw
}

export function Layout() {
  const params = useParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const compactMobileSpacing = /^\/(zh|en)\/(experience|blog|contact|resume)\/?$/.test(location.pathname)
  const lang = useMemo(() => resolveLanguage(params.lang ?? getLanguageFromPath(location.pathname)), [params.lang, location.pathname])
  const [themeState, setThemeState] = useState<Theme>(() => getInitialTheme())
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isNavigationLoading, setIsNavigationLoading] = useState(false)
  const isLoading = isPageLoading || isNavigationLoading
  const navigationRequestRef = useRef(0)
  const navigationIntentRef = useRef<{ pathname: string; focusContent: boolean } | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  const displayedEntryRef = useRef(location.key)
  const scrollPositionsRef = useRef(new Map<string, { top: number; left: number }>())
  const isScrollTransitionRef = useRef(false)
  const saveScrollPosition = useCallback(() => {
    scrollPositionsRef.current.set(displayedEntryRef.current, { top: window.scrollY, left: window.scrollX })
  }, [])
  const trackNavigationLoad = useCallback((pathname: string) => {
    const pending = preloadRoutePage(pathname)
    const requestId = ++navigationRequestRef.current
    setIsNavigationLoading(Boolean(pending))
    void pending?.finally(() => {
      if (navigationRequestRef.current === requestId) setIsNavigationLoading(false)
    })
  }, [])

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const onScroll = () => {
      if (!isScrollTransitionRef.current) saveScrollPosition()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('scroll', onScroll)
    }
  }, [saveScrollPosition])

  useEffect(() => {
    const onHistoryNavigation = () => {
      saveScrollPosition()
      isScrollTransitionRef.current = true
      navigationIntentRef.current = null
      trackNavigationLoad(window.location.pathname)
    }
    window.addEventListener('popstate', onHistoryNavigation)
    return () => window.removeEventListener('popstate', onHistoryNavigation)
  }, [trackNavigationLoad, saveScrollPosition])

  useEffect(() => {
    const intent = navigationIntentRef.current
    if (isLoading || displayedEntryRef.current === location.key) return
    if (intent && intent.pathname !== location.pathname) return
    if (navigationType === 'POP') {
      const position = scrollPositionsRef.current.get(location.key)
      window.scrollTo({ top: position?.top ?? 0, left: position?.left ?? 0, behavior: 'instant' })
    } else if (intent) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (intent.focusContent) mainRef.current?.focus({ preventScroll: true })
    }
    navigationIntentRef.current = null
    displayedEntryRef.current = location.key
    isScrollTransitionRef.current = false
    saveScrollPosition()
  }, [location.pathname, location.key, navigationType, isLoading, saveScrollPosition])

  useEffect(() => {
    setTheme(themeState)
  }, [themeState])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en'
  }, [lang])

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  const toggleTheme = () => {
    setThemeState((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="app-shell" data-photo-controls="contour" data-button-system="contour" data-mobile-spacing={compactMobileSpacing ? 'compact' : undefined} data-accent-review="forest" lang={lang === 'zh' ? 'zh-Hant' : 'en'} onClickCapture={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      const link = event.target instanceof Element ? event.target.closest('a') : null
      if (!(link instanceof HTMLAnchorElement) || link.origin !== window.location.origin || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      if (link.pathname !== window.location.pathname) {
        saveScrollPosition()
        isScrollTransitionRef.current = true
        navigationIntentRef.current = { pathname: link.pathname, focusContent: event.detail === 0 }
        trackNavigationLoad(link.pathname)
      }
    }}>
      <a className="skip-link" href="#main-content">{lang === 'zh' ? '跳至主要內容' : 'Skip to content'}</a>
      <Header key={lang} lang={lang} theme={themeState} onToggleTheme={toggleTheme} isPageLoading={isLoading} />
      <main ref={mainRef} className="main-content" id="main-content" tabIndex={-1} aria-busy={isLoading}>
        <ContentErrorBoundary resetKey={location.pathname} onError={recoverObsoleteVersion} fallback={
          <Section className="page-load-error">
            <Link className="btn btn--primary" to={`/${lang}/`}>
              <ButtonLabel>{lang === 'zh' ? '返回首頁' : 'Back to Home'}</ButtonLabel>
            </Link>
          </Section>
        }>
          <Suspense fallback={<PageLoadingState onLoadingChange={setIsPageLoading} />}><Outlet /></Suspense>
        </ContentErrorBoundary>
      </main>
      <Footer />
    </div>
    </MotionConfig>
  )
}
