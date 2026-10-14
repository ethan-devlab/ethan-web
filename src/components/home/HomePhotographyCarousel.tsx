import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import { getPhotographyImageSrc, photographyItems } from '../../data/photography'
import { fallbackToOriginalPhotographyImage } from '../../utils/photographyImageFallback'
import { navigationItems } from '../../data/navigation'
import type { Language } from '../../i18n/locales'
import { Section } from '../common/Section'
import '../../styles/home-photography.css'

type HomePhotographyCarouselProps = {
  lang: Language
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function getPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(reducedMotionQuery).matches
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia(reducedMotionQuery)
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

export function HomePhotographyCarousel({ lang }: HomePhotographyCarouselProps) {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPointerOver, setIsPointerOver] = useState(false)
  const [hasFocusWithin, setHasFocusWithin] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const canAdvance = photographyItems.length > 1
  const photographyTitle = navigationItems.find((item) => item.key === 'photography')
    ?.label[lang]

  useEffect(() => {
    if (!swiper) {
      return
    }

    if (prefersReducedMotion || isPointerOver || hasFocusWithin || !canAdvance) {
      if (swiper.autoplay.running) {
        swiper.autoplay.stop()
      }
      return
    }

    if (!swiper.autoplay.running) {
      swiper.autoplay.start()
    }
  }, [canAdvance, hasFocusWithin, isPointerOver, prefersReducedMotion, swiper])

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setHasFocusWithin(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
      || (event.target instanceof HTMLElement
        && (event.target.isContentEditable || /^(input|textarea|select)$/i.test(event.target.tagName)))
    ) {
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      swiperRef.current?.slidePrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      swiperRef.current?.slideNext()
    }
  }

  if (!photographyTitle || photographyItems.length === 0) {
    return null
  }

  return (
    <Section title={photographyTitle} className="section--spacious">
      <div
        className="hp-carousel"
        role="region"
        aria-label={photographyTitle}
        aria-live="off"
        tabIndex={0}
        onMouseEnter={() => setIsPointerOver(true)}
        onMouseLeave={() => setIsPointerOver(false)}
        onFocusCapture={() => setHasFocusWithin(true)}
        onBlurCapture={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <Swiper
          modules={[Autoplay]}
          className="hp-carousel__swiper"
          slidesPerView={1}
          loop={canAdvance}
          speed={prefersReducedMotion ? 0 : 420}
          autoplay={canAdvance && !prefersReducedMotion
            ? {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }
            : false}
          onSwiper={(instance) => {
            swiperRef.current = instance
            setActiveIndex(instance.realIndex)
            setSwiper(instance)
          }}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        >
          {photographyItems.map((item) => (
            <SwiperSlide
              key={item.id}
              className="hp-carousel__slide"
              role="group"
            >
              <img
                className="hp-carousel__image"
                src={getPhotographyImageSrc(item.images[0] ?? '')}
                onError={event => fallbackToOriginalPhotographyImage(event, item.images[0] ?? '')}
                alt={item.name[lang]}
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hp-carousel__details">
          <div className="hp-carousel__caption">
            <h3 className="hp-carousel__name">
              {photographyItems[activeIndex]?.name[lang]}
            </h3>
            <p className="hp-carousel__metadata">
              <span>{photographyItems[activeIndex]?.datetime}</span>
              <span aria-hidden="true">·</span>
              <span>{photographyItems[activeIndex]?.location[lang]}</span>
            </p>
          </div>

          {canAdvance ? (
            <div className="hp-carousel__controls">
              <button
                className="hp-carousel__button"
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label={lang === 'zh' ? '上一張照片' : 'Previous photo'}
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <button
                className="hp-carousel__button"
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label={lang === 'zh' ? '下一張照片' : 'Next photo'}
              >
                <FaChevronRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
