import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../../i18n/locales'
import { getInitialTheme, setTheme, type Theme } from '../../utils/theme'
import { trackPageView } from '../../utils/analytics'

function resolveLanguage(raw: string | undefined): Language {
  if (!raw || !isLanguage(raw)) {
    return DEFAULT_LANGUAGE
  }
  return raw
}

export function Layout() {
  const params = useParams()
  const location = useLocation()
  const lang = useMemo(() => resolveLanguage(params.lang), [params.lang])
  const [themeState, setThemeState] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    setTheme(themeState)
  }, [themeState])

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  const toggleTheme = () => {
    setThemeState((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-shell">
      <Header lang={lang} theme={themeState} onToggleTheme={toggleTheme} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
