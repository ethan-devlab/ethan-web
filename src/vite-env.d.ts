/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType, ElementType } from 'react'

  type MDXComponentProps = {
    components?: Record<string, ElementType>
  }

  const MDXComponent: ComponentType<MDXComponentProps>
  export default MDXComponent
}

declare module 'swiper/css'
