declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
let analyticsReady = false

export function initializeAnalytics(): void {
  if (
    !measurementId ||
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    analyticsReady
  ) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  analyticsReady = true
}

export function trackPageView(path: string, title?: string): void {
  if (
    !measurementId ||
    !analyticsReady ||
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof window.gtag !== 'function'
  ) {
    return
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  })
}