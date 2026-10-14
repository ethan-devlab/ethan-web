import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotionPreference } from '../../utils/useReducedMotionPreference'
import type { IlluminationInput } from './galleryIllumination'
import type { createGalleryLightsScene } from './galleryThreeScene'
import '../../styles/gallery-lights.css'

export function GalleryLights({ paused }: { paused: boolean }) {
  const reducedMotion = useReducedMotionPreference()
  const sceneRef = useRef<HTMLDivElement>(null)
  const bulbRef = useRef<HTMLCanvasElement>(null)
  const illuminationRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<ReturnType<typeof createGalleryLightsScene> | null>(null)
  const visibleRef = useRef(false)
  const reducedRef = useRef(reducedMotion)
  const pausedRef = useRef(paused)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

  useLayoutEffect(() => {
    reducedRef.current = reducedMotion
    pausedRef.current = paused
    controllerRef.current?.setVisible(visibleRef.current && !paused)
    controllerRef.current?.setReduced(reducedMotion)
  }, [paused, reducedMotion])

  useLayoutEffect(() => {
    const root = sceneRef.current
    if (!root) return
    const resize = () => root.style.setProperty('--gallery-viewport-width', `${document.documentElement.clientWidth}px`)
    const observer = new ResizeObserver(resize)
    observer.observe(document.documentElement)
    resize()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = sceneRef.current
    if (!root) return
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); preload.disconnect() }
    }, { rootMargin: `${innerHeight}px 0px` })
    const visibility = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      controllerRef.current?.setVisible(entry.isIntersecting && !pausedRef.current)
    })
    preload.observe(root)
    visibility.observe(root)
    const themeObserver = new MutationObserver(() => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { preload.disconnect(); visibility.disconnect(); themeObserver.disconnect() }
  }, [])

  useEffect(() => {
    const root = sceneRef.current
    const canvas = bulbRef.current
    if (!active || failed || !root || !canvas) return
    let cancelled = false
    let controller: ReturnType<typeof createGalleryLightsScene> | undefined
    const observer = new ResizeObserver(() => controller?.resize(root.clientWidth, root.clientHeight))
    import('./galleryThreeScene').then(({ createGalleryLightsScene }) => {
      if (cancelled) return
      controller = createGalleryLightsScene(canvas, theme === 'light', () => { if (!cancelled) setFailed(true) })
      controllerRef.current = controller
      controller.setReduced(reducedRef.current)
      controller.resize(root.clientWidth, root.clientHeight)
      controller.setVisible(visibleRef.current && !pausedRef.current)
      observer.observe(root)
      setReady(true)
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true; observer.disconnect(); controller?.dispose(); controllerRef.current = null }
  }, [active, failed, theme])

  useEffect(() => {
    const canvas = illuminationRef.current
    const scene = sceneRef.current
    if (!canvas || !scene || !ready || failed || paused) return
    const context = canvas.getContext('2d')
    if (!context) return
    const swatch = document.createElement('canvas').getContext('2d')!
    swatch.fillStyle = 'oklch(83% 0.12 75)'
    swatch.fillRect(0, 0, 1, 1)
    const rgb = swatch.getImageData(0, 0, 1, 1).data
    let timer = 0
    let visible = true
    let busy = false
    let queued = false
    let worker: Worker
    try { worker = new Worker(new URL('./galleryIllumination.worker.ts', import.meta.url), { type: 'module' }) } catch { queueMicrotask(() => setFailed(true)); return }
    worker.onerror = (event) => { event.preventDefault(); setFailed(true) }
    const paint = (pixels: Uint8ClampedArray<ArrayBuffer>, width: number, height: number) => {
      if (!visible || document.hidden) return
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
      context.putImageData(new ImageData(pixels, width, height), 0, 0)
    }
    worker.onmessage = ({ data }) => {
      busy = false
      const width = Math.min(384, scene.clientWidth)
      if (data.width === width && data.height === Math.ceil(1400 * width / scene.clientWidth)) paint(data.pixels, data.width, data.height)
      if (queued) { queued = false; draw(); return }
    }
    const draw = () => {
      if (!visible || document.hidden) return
      if (busy) { queued = true; return }
      const width = Math.min(384, scene.clientWidth)
      const input: IlluminationInput = {
        width, height: Math.ceil(1400 * width / scene.clientWidth), viewportWidth: scene.clientWidth,
        seconds: reducedMotion ? 0 : performance.now() / 1000, reduced: reducedMotion,
        density: 0.00018,
        wallDistance: 45,
        exposure: theme === 'light' ? 0.6 : 0.9, rgb: Array.from(rgb).slice(0, 3),
      }
      busy = true
      worker.postMessage(input)
    }
    const resize = new ResizeObserver(draw)
    resize.observe(scene)
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) draw() })
    visibility.observe(canvas)
    document.addEventListener('visibilitychange', draw)
    draw()
    if (!reducedMotion) timer = window.setInterval(draw, 250)
    return () => { resize.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', draw); window.clearInterval(timer); worker.terminate() }
  }, [ready, failed, paused, reducedMotion, theme])

  if (failed) return null
  return (
    <div ref={sceneRef} className="gallery-lights" aria-hidden="true">
      <canvas ref={illuminationRef} className="gallery-lights__physical-field" />
      <canvas key={theme} ref={bulbRef} className="gallery-lights__scene" />
    </div>
  )
}
