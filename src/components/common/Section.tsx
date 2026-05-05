import type { ReactNode } from 'react'

type SectionProps = {
  title?: string
  description?: string
  className?: string
  children: ReactNode
}

export function Section({ title, description, className, children }: SectionProps) {
  return (
    <section className={`section ${className ?? ''}`.trim()}>
      <div className="container">
        {title ? <h2 className="section__title">{title}</h2> : null}
        {description ? <p className="section__description">{description}</p> : null}
        {children}
      </div>
    </section>
  )
}
