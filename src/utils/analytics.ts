declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
let analyticsReady = false

export function initializeAnalytics(): void {
  if (!measurementId || typeof document === 'undefined' || analyticsReady) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  analyticsReady = true
}

export function trackPageView(path: string, title?: string): void {
  if (!measurementId || !analyticsReady || typeof window.gtag !== 'function') {
    return
  }
  window.gtag('config', measurementId, {
    page_path: path,
    page_title: title,
  })
}
