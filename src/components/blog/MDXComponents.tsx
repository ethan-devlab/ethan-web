import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'

type PreProps = PropsWithChildren<ComponentPropsWithoutRef<'pre'>>
type CodeProps = PropsWithChildren<ComponentPropsWithoutRef<'code'>>
type CalloutProps = PropsWithChildren<{
  type?: string
}>

const CALLOUT_LABELS: Record<string, string> = {
  caution: 'Caution',
  danger: 'Danger',
  important: 'Important',
  info: 'Info',
  note: 'Note',
  success: 'Success',
  tip: 'Tip',
  warning: 'Warning',
}

function resolveCalloutType(type: string | undefined): string {
  if (!type) {
    return 'note'
  }

  const normalizedType = type.trim().toLowerCase()
  return CALLOUT_LABELS[normalizedType] ? normalizedType : 'note'
}

export function MdxCodeBlock({ children, ...props }: PreProps) {
  return <pre {...props}>{children}</pre>
}

export function MdxInlineCode({ children, ...props }: CodeProps) {
  return <code {...props}>{children}</code>
}

export function Callout({ children, type }: CalloutProps) {
  const normalizedType = resolveCalloutType(type)

  return (
    <aside className="blog-callout" data-callout-type={normalizedType}>
      <div className="blog-callout__header">
        <span className="blog-callout__label">{CALLOUT_LABELS[normalizedType]}</span>
      </div>
      <div className="blog-callout__body">{children}</div>
    </aside>
  )
}
