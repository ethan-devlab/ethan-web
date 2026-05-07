import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import { SEO } from '../components/common/SEO'
import { Section } from '../components/common/Section'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import {
  formatCoordinates,
  getGoogleMapsEmbedUrl,
  getPhotographyImageSrc,
  photographyItems,
} from '../data/photography'

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
  const { lang } = useParams()
  const language = resolveLanguage(lang)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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
      if (event.key === 'Escape') {
        setSelectedIndex(null)
      }

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

  const openItem = (index: number, imageIndex: number) => {
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

      <Section title={pageText.title} description={pageText.description} className="section--spacious">
        <div className="photography-grid" aria-label={pageText.title}>
          {photographyItems.map((item, index) => {
            const previewIndex = Math.min(previewImageIndexes[item.id] ?? 0, item.images.length - 1)
            const previewDirection = previewDirections[item.id] ?? 1
            const previewImage = item.images[previewIndex] ?? item.images[0] ?? ''

            return (
              <motion.article
                key={item.id}
                className="photography-card"
                initial={{ opacity: 0, y: 22, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.36, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="photography-card__open"
                  onClick={() => openItem(index, previewIndex)}
                  aria-label={`${pageText.openLabel}: ${item.location[language]}`}
                >
                  <span className="photography-card__image-frame">
                    <AnimatePresence initial={false} custom={previewDirection} mode="wait">
                      <motion.img
                        key={`${item.id}-${previewIndex}`}
                        src={getPhotographyImageSrc(previewImage)}
                        alt={item.name[language]}
                        loading="lazy"
                        className="photography-card__image"
                        custom={previewDirection}
                        variants={carouselImageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={carouselTransition}
                      />
                    </AnimatePresence>
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
          <motion.div
            className="photography-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="photography-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.button
              type="button"
              className="photography-modal__backdrop"
              aria-label={pageText.closeLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedIndex(null)}
            />

            <button
              type="button"
              className="photography-modal__group-nav photography-modal__group-nav--previous"
              aria-label={pageText.previousGroupLabel}
              onClick={() => showAdjacentItem(-1)}
            >
              <FaChevronLeft aria-hidden="true" />
            </button>

            <button
              type="button"
              className="photography-modal__group-nav photography-modal__group-nav--next"
              aria-label={pageText.nextGroupLabel}
              onClick={() => showAdjacentItem(1)}
            >
              <FaChevronRight aria-hidden="true" />
            </button>

            <motion.div
              className="photography-modal__content"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
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
                <button
                  type="button"
                  className="photography-modal__nav photography-modal__nav--previous"
                  aria-label={pageText.previousLabel}
                  onClick={showPreviousImage}
                >
                  <FaChevronLeft aria-hidden="true" />
                </button>

                <div className="photography-modal__image-stage">
                  <AnimatePresence initial={false} custom={carouselDirection} mode="wait">
                    <motion.img
                      key={`${selectedItem.id}-${selectedImageIndex}`}
                      src={getPhotographyImageSrc(selectedImage)}
                      alt={selectedItem.name[language]}
                      className="photography-modal__image"
                      custom={carouselDirection}
                      variants={carouselImageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={carouselTransition}
                    />
                  </AnimatePresence>
                  <div className="photography-modal__counter">
                    {selectedImageIndex + 1} / {selectedItem.images.length}
                  </div>
                </div>

                <button
                  type="button"
                  className="photography-modal__nav photography-modal__nav--next"
                  aria-label={pageText.nextLabel}
                  onClick={showNextImage}
                >
                  <FaChevronRight aria-hidden="true" />
                </button>
              </div>

              <aside className="photography-modal__details">
                <AnimatePresence initial={false} custom={carouselDirection} mode="wait">
                  <motion.div
                    key={selectedItem.id}
                    className="photography-modal__details-inner"
                    custom={itemDirection}
                    variants={carouselDetailsVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={carouselTransition}
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
                </AnimatePresence>
              </aside>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
