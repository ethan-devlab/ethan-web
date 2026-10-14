import type { SyntheticEvent } from 'react'
import { getOriginalPhotographyImageSrc } from '../data/photography'

export function fallbackToOriginalPhotographyImage(event: SyntheticEvent<HTMLImageElement>, image: string) {
  const element = event.currentTarget
  const original = getOriginalPhotographyImageSrc(image)
  if (element.getAttribute('src') !== original) element.setAttribute('src', original)
}
