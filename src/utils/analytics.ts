import ReactGA from 'react-ga4'

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
let analyticsReady = false

export type ButtonClickPayload = {
  label: string
  area: string
  target?: string
}

function canTrackAnalytics(): boolean {
  return Boolean(measurementId && analyticsReady && typeof window !== 'undefined')
}

export function initializeAnalytics(): void {
  if (!measurementId || typeof window === 'undefined' || analyticsReady) {
    return
  }

  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false,
    },
  })

  analyticsReady = true
}

export function trackPageView(path: string, title?: string): void {
  if (!canTrackAnalytics()) {
    return
  }

  ReactGA.send({
    hitType: 'pageview',
    page: path,
    location: window.location.origin + path,
    title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
  })
}

export function trackButtonClick({ label, area, target }: ButtonClickPayload): void {
  if (!canTrackAnalytics()) {
    return
  }

  ReactGA.event('button_click', {
    event_category: 'Button Clicks',
    button_label: label,
    button_area: area,
    page_path: window.location.pathname,
    ...(target ? { link_target: target } : {}),
  })
}
