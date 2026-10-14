import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { photographyItems, getPhotographyImageSrc } from '../../data/photography'
import { fallbackToOriginalPhotographyImage } from '../../utils/photographyImageFallback'
import { navigationItems } from '../../data/navigation'
import type { Language } from '../../i18n/locales'
import { Section } from '../common/Section'
import { ContentErrorBoundary } from '../common/ContentErrorBoundary'
import '../../styles/home-photography.css'

const Carousel = lazy(() => import('./HomePhotographyCarousel').then(module => ({ default: module.HomePhotographyCarousel })))

function PhotographyPlaceholder({ lang }: { lang: Language }) {
  const item = photographyItems[0]
  const title = navigationItems.find(item => item.key === 'photography')?.label[lang]
  if (!item || !title) return null
  return (
    <Section title={title} className="section--spacious">
      <div className="hp-carousel">
        <div className="hp-carousel__placeholder">
          <img className="hp-carousel__image" src={getPhotographyImageSrc(item.images[0] ?? '')} onError={event => fallbackToOriginalPhotographyImage(event, item.images[0] ?? '')} alt={item.name[lang]} loading="lazy" decoding="async" />
        </div>
        <div className="hp-carousel__details">
          <div className="hp-carousel__caption">
            <h3 className="hp-carousel__name">{item.name[lang]}</h3>
            <p className="hp-carousel__metadata"><span>{item.datetime}</span><span>·</span><span>{item.location[lang]}</span></p>
          </div>
          <div className="hp-carousel__controls" aria-hidden="true">
            <span className="hp-carousel__button hp-carousel__button--disabled"><FaChevronLeft /></span>
            <span className="hp-carousel__button hp-carousel__button--disabled"><FaChevronRight /></span>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function DeferredHomePhotography({ lang }: { lang: Language }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setIsNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: `${window.innerHeight}px 0px` })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  const placeholder = <PhotographyPlaceholder lang={lang} />
  return (
    <div ref={sectionRef} className="home-photography-deferred">
      {isNearViewport ? (
        <ContentErrorBoundary fallback={placeholder}>
          <Suspense fallback={placeholder}><Carousel lang={lang} /></Suspense>
        </ContentErrorBoundary>
      ) : placeholder}
    </div>
  )
}
