const importFailures = new WeakSet<object>()
let pendingRecovery: Promise<void> | undefined
let currentEntry: string | undefined

export function initializeVersionRecovery() {
  const script = document.querySelector<HTMLScriptElement>('script[type="module"][src]')
  currentEntry = script?.src
  window.addEventListener('vite:preloadError', event => {
    const error = (event as Event & { payload?: unknown }).payload
    if (error && typeof error === 'object') importFailures.add(error)
  })
}

export function recoverObsoleteVersion(error: unknown) {
  if (!error || typeof error !== 'object' || !importFailures.has(error) || !currentEntry) return
  if (pendingRecovery) return
  const entry = currentEntry
  const destination = window.location.href
  pendingRecovery = (async () => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 5000)
    try {
      const [oldEntry, index] = await Promise.all([
        fetch(entry, { method: 'HEAD', headers: { Accept: 'text/javascript' }, cache: 'no-store', signal: controller.signal }),
        fetch(import.meta.env.BASE_URL, { cache: 'no-store', signal: controller.signal }),
      ])
      if (oldEntry.status !== 404 || !index.ok || !index.headers.get('content-type')?.includes('text/html')) return
      const manifest = new DOMParser().parseFromString(await index.text(), 'text/html')
      const source = manifest.querySelector('script[type="module"][src]')?.getAttribute('src')
      if (!source) return
      const nextEntry = new URL(source, index.url || new URL(import.meta.env.BASE_URL, destination))
      if (nextEntry.origin !== window.location.origin || nextEntry.href === entry || window.location.href !== destination) return
      // Record the target before reload so an inconsistent server cannot cause a loop.
      const key = 'portfolio-version-recovery'
      if (sessionStorage.getItem(key) === nextEntry.href) return
      sessionStorage.setItem(key, nextEntry.href)
      window.location.reload()
    } catch {
      // Network or storage failure keeps the existing content fallback.
    } finally {
      window.clearTimeout(timeout)
    }
  })().finally(() => { pendingRecovery = undefined })
}
