export type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'ethan-theme'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }
  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (value === 'dark' || value === 'light') {
    return value
  }
  return null
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.setAttribute('data-theme', theme)
}

export function setTheme(theme: Theme): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }
  applyTheme(theme)
}

export function initializeTheme(): Theme {
  const theme = getInitialTheme()
  applyTheme(theme)
  return theme
}
