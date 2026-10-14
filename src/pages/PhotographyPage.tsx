import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotionPreference } from '../utils/useReducedMotionPreference'
import { fallbackToOriginalPhotographyImage } from '../utils/photographyImageFallback'
import { SEO } from '../components/common/SEO'
import { Section } from '../components/common/Section'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import {
  formatCoordinates,
  getGoogleMapsEmbedUrl,
  getPhotographyImageSrc,
  photographyItems,
} from '../data/photography'
import '../styles/photography-controls.css'
import { GalleryLights } from '../components/photography/GalleryLights'

function PhotographyTransition({ children, reducedMotion, direction }: { children: ReactNode; reducedMotion: boolean; direction: number }) {
  if (reducedMotion) return children
  return <AnimatePresence initial={false} custom={direction} mode="wait">{children}</AnimatePresence>
}

function PhotographyDialog({ children, onDismiss, returnFocusTo }: { children: ReactNode; onDismiss: () => void; returnFocusTo: HTMLElement | null }) {
  const reducedMotion = useReducedMotionPreference()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const opener = returnFocusTo ?? document.activeElement
    if (!dialog) return

    dialog.showModal()
    dialog.querySelector<HTMLButtonElement>('.photography-modal__close')?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [returnFocusTo])

  return (
    <motion.dialog
      ref={dialogRef}
      className="photography-modal"
      aria-labelledby="photography-modal-title"
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.22 }}
    >
      {children}
    </motion.dialog>
  )
}

function PhotographyGroupNavigation({ inline, previousLabel, nextLabel, onPrevious, onNext }: {
  inline: boolean
  previousLabel: string
  nextLabel: string
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div className={`photography-modal__group-controls photography-modal__group-controls--${inline ? 'inline' : 'floating'}`}>
      <button type="button" className="photography-modal__group-nav photography-modal__group-nav--previous" aria-label={previousLabel} onClick={onPrevious}>
        <FaChevronLeft aria-hidden="true" />
      </button>
      <button type="button" className="photography-modal__group-nav photography-modal__group-nav--next" aria-label={nextLabel} onClick={onNext}>
        <FaChevronRight aria-hidden="true" />
      </button>
    </div>
  )
}

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

function getWrappedIndex(currentIndex: number, direction: 1 | -1, length: number): number {
  return (currentIndex + direction + length) % length
}

const carouselTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
} as const

const carouselImageVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    scale: 0.985,
    filter: 'blur(8px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    scale: 0.985,
    filter: 'blur(8px)',
  }),
}

const carouselDetailsVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    y: 12,
    x: direction > 0 ? 16 : -16,
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0,
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    y: -8,
    x: direction > 0 ? -16 : 16,
  }),
}

export function PhotographyPage() {
  const galleryRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    const cards = Array.from(gallery.querySelectorAll<HTMLElement>('.photography-card'))
    const update = () => {
      const columns = getComputedStyle(gallery).gridTemplateColumns.split(' ').length
      const heights = Array<number>(columns).fill(0)
      for (const card of cards) {
        const frame = card.querySelector<HTMLElement>('.photography-card__image-frame')
        card.style.setProperty('--preview-height', `${frame?.offsetHeight ?? 244}px`)
        // Place successive works at the next lowest position without changing DOM order.
        const column = heights.indexOf(Math.min(...heights))
        const span = Math.ceil(card.offsetHeight + 28)
        card.style.gridColumnStart = `${column + 1}`
        card.style.gridRowStart = `${heights[column] + 1}`
        card.style.gridRowEnd = `span ${span}`
        heights[column] += span
      }
    }
    let frameRequest = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameRequest)
      frameRequest = requestAnimationFrame(update)
    })
    observer.observe(gallery)
    cards.forEach(card => observer.observe(card))
    update()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameRequest)
      cards.forEach(card => {
        card.style.removeProperty('grid-row-end')
        card.style.removeProperty('grid-row-start')
        card.style.removeProperty('grid-column-start')
        card.style.removeProperty('--preview-height')
      })
    }
  }, [])
  const reducedMotion = useReducedMotionPreference()
  const { lang } = useParams()
  const language = resolveLanguage(lang)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [dialogOpener, setDialogOpener] = useState<HTMLButtonElement | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselDirection, setCarouselDirection] = useState<1 | -1>(1)
  const [itemDirection, setItemDirection] = useState<1 | -1>(1)
  const [previewImageIndexes, setPreviewImageIndexes] = useState<Record<string, number>>({})
  const [previewDirections, setPreviewDirections] = useState<Record<string, 1 | -1>>({})
  const selectedItem = selectedIndex === null ? null : photographyItems[selectedIndex]
  const selectedImages = selectedItem?.images ?? []
  const selectedImage = selectedImages[selectedImageIndex] ?? selectedImages[0] ?? ''

  const pageText = useMemo(
    () =>
      language === 'zh'
        ? {
            title: '攝影',
            description: '穿梭於光影之間，漫步日常、城市、鄉村、旅遊。',
            openLabel: '開啟照片',
            datetimeLabel: '時',
            coordinatesLabel: '位',
            locationLabel: '地',
            thoughtLabel: '文',
            previousLabel: '上一張照片',
            nextLabel: '下一張照片',
            previousGroupLabel: '上一組作品',
            nextGroupLabel: '下一組作品',
            previousPreviewLabel: '上一張預覽照片',
            nextPreviewLabel: '下一張預覽照片',
            closeLabel: '關閉照片檢視',
            mapTitle: 'Google 地圖位置',
          }
        : {
            title: 'Photography',
            description:
              'Wandering through light and shadow, strolling in the everyday, the city, the countryside, and travel.',
            openLabel: 'Open photo',
            datetimeLabel: 'Date',
            coordinatesLabel: 'Coordinates',
            locationLabel: 'Location',
            thoughtLabel: 'Thought',
            previousLabel: 'Previous photo',
            nextLabel: 'Next photo',
            previousGroupLabel: 'Previous work',
            nextGroupLabel: 'Next work',
            previousPreviewLabel: 'Previous preview photo',
            nextPreviewLabel: 'Next preview photo',
            closeLabel: 'Close photo viewer',
            mapTitle: 'Google Maps location',
          },
    [language],
  )

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCarouselDirection(1)
        setSelectedImageIndex((index) =>
          selectedItem ? getWrappedIndex(index, 1, selectedItem.images.length) : index,
        )
      }

      if (event.key === 'ArrowLeft') {
        setCarouselDirection(-1)
        setSelectedImageIndex((index) =>
          selectedItem ? getWrappedIndex(index, -1, selectedItem.images.length) : index,
        )
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedIndex, selectedItem])

  const showPreviousImage = () => {
    if (!selectedItem) {
      return
    }
    setCarouselDirection(-1)
    setSelectedImageIndex((index) => getWrappedIndex(index, -1, selectedItem.images.length))
  }

  const showNextImage = () => {
    if (!selectedItem) {
      return
    }
    setCarouselDirection(1)
    setSelectedImageIndex((index) => getWrappedIndex(index, 1, selectedItem.images.length))
  }

  const showAdjacentItem = (direction: 1 | -1) => {
    setItemDirection(direction)
    setCarouselDirection(direction)
    setSelectedImageIndex(0)
    setSelectedIndex((index) =>
      index === null ? index : getWrappedIndex(index, direction, photographyItems.length),
    )
  }

  const openItem = (index: number, imageIndex: number, opener: HTMLButtonElement) => {
    setDialogOpener(opener)
    setCarouselDirection(1)
    setItemDirection(1)
    setSelectedImageIndex(imageIndex)
    setSelectedIndex(index)
  }

  const changePreviewImage = (itemId: string, imageCount: number, direction: 1 | -1) => {
    setPreviewDirections((current) => ({ ...current, [itemId]: direction }))
    setPreviewImageIndexes((current) => {
      const currentIndex = current[itemId] ?? 0
      return { ...current, [itemId]: getWrappedIndex(currentIndex, direction, imageCount) }
    })
  }

  const setPreviewImage = (itemId: string, nextIndex: number) => {
    const currentIndex = previewImageIndexes[itemId] ?? 0
    setPreviewDirections((directions) => ({
      ...directions,
      [itemId]: nextIndex >= currentIndex ? 1 : -1,
    }))
    setPreviewImageIndexes((current) => ({ ...current, [itemId]: nextIndex }))
  }

  return (
    <>
      <SEO
        title={pageText.title}
        description={pageText.description}
        path={`/${language}/photography`}
      />

      <Section title={pageText.title} description={pageText.description} className="section--spacious section--gallery-exhibition">
        <GalleryLights paused={selectedItem !== null} />
        <div ref={galleryRef} className="photography-grid photography-grid--proportional" aria-label={pageText.title}>
          {photographyItems.map((item, index) => {
            const previewIndex = Math.min(previewImageIndexes[item.id] ?? 0, item.images.length - 1)
            const previewDirection = previewDirections[item.id] ?? 1
            const previewImage = item.images[previewIndex] ?? item.images[0] ?? ''

            return (
              <motion.article
                key={item.id}
                className="photography-card photography-card--dots-paper"
                initial={reducedMotion ? false : { opacity: 0, y: 22, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
                animate={reducedMotion ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
                whileHover={reducedMotion ? undefined : { y: -6, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reducedMotion ? 0 : 0.36, delay: reducedMotion ? 0 : index * 0.025, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="photography-card__open"
                  onClick={event => openItem(index, previewIndex, event.currentTarget)}
                  aria-label={`${pageText.openLabel}: ${item.location[language]}`}
                >
                  <span className="photography-card__image-frame">
                    <PhotographyTransition reducedMotion={reducedMotion} direction={previewDirection}>
                      <motion.img
                        key={`${item.id}-${previewIndex}`}
                        src={getPhotographyImageSrc(previewImage)}
                        onError={event => fallbackToOriginalPhotographyImage(event, previewImage)}
                        alt={item.name[language]}
                        loading="lazy"
                        className="photography-card__image"
                        custom={previewDirection}
                        variants={carouselImageVariants}
                        initial={reducedMotion ? false : 'enter'}
                        animate="center"
                        exit={reducedMotion ? undefined : 'exit'}
                        transition={reducedMotion ? { duration: 0 } : carouselTransition}
                      />
                    </PhotographyTransition>
                  </span>
                  <span className="photography-card__meta">
                    <span className="photography-card__title">
                      <span>{item.name[language]}</span>
                    </span>
                    <span className="photography-card__datetime">
                      <time dateTime={item.datetime}>{item.datetime}</time>
                    </span>
                    <span className="photography-card__coordinates">{formatCoordinates(item)}</span>
                  </span>
                </button>

                {item.images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="photography-card__nav photography-card__nav--previous"
                      aria-label={`${pageText.previousPreviewLabel}: ${item.name[language]}`}
                      onClick={() => changePreviewImage(item.id, item.images.length, -1)}
                    >
                      <FaChevronLeft aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="photography-card__nav photography-card__nav--next"
                      aria-label={`${pageText.nextPreviewLabel}: ${item.name[language]}`}
                      onClick={() => changePreviewImage(item.id, item.images.length, 1)}
                    >
                      <FaChevronRight aria-hidden="true" />
                    </button>
                    <div className="photography-card__dots" aria-label={`${item.name[language]} photo set`}>
                      {item.images.map((image, imageIndex) => (
                        <button
                          key={`${item.id}-${image}-${imageIndex}`}
                          type="button"
                          className={`photography-card__dot ${
                            imageIndex === previewIndex ? 'photography-card__dot--active' : ''
                          }`.trim()}
                          aria-label={`${pageText.openLabel}: ${item.name[language]} ${imageIndex + 1}`}
                          aria-current={imageIndex === previewIndex ? 'true' : undefined}
                          onClick={() => setPreviewImage(item.id, imageIndex)}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </motion.article>
            )
          })}
        </div>
      </Section>

      <AnimatePresence>
        {selectedItem ? (
          <PhotographyDialog returnFocusTo={dialogOpener} onDismiss={() => setSelectedIndex(null)}>
            <motion.button
              type="button"
              className="photography-modal__backdrop"
              aria-label={pageText.closeLabel}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.22 }}
              onClick={() => setSelectedIndex(null)}
            />

            <PhotographyGroupNavigation
              inline={false}
              previousLabel={pageText.previousGroupLabel}
              nextLabel={pageText.nextGroupLabel}
              onPrevious={() => showAdjacentItem(-1)}
              onNext={() => showAdjacentItem(1)}
            />

            <motion.div
              className="photography-modal__content"
              initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className="photography-modal__close"
                aria-label={pageText.closeLabel}
                onClick={() => setSelectedIndex(null)}
              >
                <FaTimes aria-hidden="true" />
              </button>

              <div className="photography-modal__media">
                {selectedItem.images.length > 1 ? (
                  <button
                    type="button"
                    className="photography-modal__nav photography-modal__nav--previous"
                    aria-label={pageText.previousLabel}
                    onClick={showPreviousImage}
                  >
                    <FaChevronLeft aria-hidden="true" />
                  </button>
                ) : null}

                <div className="photography-modal__image-stage">
                  <PhotographyTransition reducedMotion={reducedMotion} direction={carouselDirection}>
                    <motion.img
                      key={`${selectedItem.id}-${selectedImageIndex}`}
                      src={getPhotographyImageSrc(selectedImage)}
                      onError={event => fallbackToOriginalPhotographyImage(event, selectedImage)}
                      alt={selectedItem.name[language]}
                      className="photography-modal__image"
                      custom={carouselDirection}
                      variants={carouselImageVariants}
                      initial={reducedMotion ? false : 'enter'}
                      animate="center"
                      exit={reducedMotion ? undefined : 'exit'}
                      transition={reducedMotion ? { duration: 0 } : carouselTransition}
                    />
                  </PhotographyTransition>
                  <div className="photography-modal__counter">
                    {selectedImageIndex + 1} / {selectedItem.images.length}
                  </div>
                </div>

                {selectedItem.images.length > 1 ? (
                  <button
                    type="button"
                    className="photography-modal__nav photography-modal__nav--next"
                    aria-label={pageText.nextLabel}
                    onClick={showNextImage}
                  >
                    <FaChevronRight aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <PhotographyGroupNavigation
                inline
                previousLabel={pageText.previousGroupLabel}
                nextLabel={pageText.nextGroupLabel}
                onPrevious={() => showAdjacentItem(-1)}
                onNext={() => showAdjacentItem(1)}
              />

              <aside className="photography-modal__details">
                <PhotographyTransition reducedMotion={reducedMotion} direction={carouselDirection}>
                  <motion.div
                    key={selectedItem.id}
                    className="photography-modal__details-inner"
                    custom={itemDirection}
                    variants={carouselDetailsVariants}
                    initial={reducedMotion ? false : 'enter'}
                    animate="center"
                    exit={reducedMotion ? undefined : 'exit'}
                    transition={reducedMotion ? { duration: 0 } : carouselTransition}
                  >
                    <p className="photography-modal__eyebrow">{pageText.locationLabel}</p>
                    <h2 id="photography-modal-title">{selectedItem.location[language]}</h2>

                    <dl className="photography-modal__facts">
                      <div>
                        <dt>{pageText.datetimeLabel}</dt>
                        <dd>
                          <time dateTime={selectedItem.datetime}>{selectedItem.datetime}</time>
                        </dd>
                      </div>
                      <div>
                        <dt>{pageText.coordinatesLabel}</dt>
                        <dd>{formatCoordinates(selectedItem)}</dd>
                      </div>
                    </dl>

                    <iframe
                      className="photography-modal__map"
                      title={`${pageText.mapTitle}: ${selectedItem.location[language]}`}
                      src={getGoogleMapsEmbedUrl(selectedItem)}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    <div className="photography-modal__thought">
                      <p className="photography-modal__eyebrow">{pageText.thoughtLabel}</p>
                      <p>{selectedItem.thought[language]}</p>
                    </div>
                  </motion.div>
                </PhotographyTransition>
              </aside>
            </motion.div>
          </PhotographyDialog>
        ) : null}
      </AnimatePresence>
    </>
  )
}
