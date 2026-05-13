import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'
import type { IconType } from 'react-icons'
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit3,
  FiFlag,
  FiInfo,
  FiXOctagon,
  FiZap,
} from 'react-icons/fi'

type PreProps = PropsWithChildren<ComponentPropsWithoutRef<'pre'>>
type CodeProps = PropsWithChildren<ComponentPropsWithoutRef<'code'>>
type CalloutProps = PropsWithChildren<{
  type?: string
  title?: string
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

const CALLOUT_ICONS: Record<string, IconType> = {
  caution: FiAlertCircle,
  danger: FiXOctagon,
  important: FiFlag,
  info: FiInfo,
  note: FiEdit3,
  success: FiCheckCircle,
  tip: FiZap,
  warning: FiAlertTriangle,
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

export function Callout({ children, type, title }: CalloutProps) {
  const normalizedType = resolveCalloutType(type)
  const normalizedTitle = title?.trim()
  const Icon = CALLOUT_ICONS[normalizedType]

  return (
    <aside className="blog-callout" data-callout-type={normalizedType}>
      <div className="blog-callout__header">
        <span className="blog-callout__label" role="img" aria-label={CALLOUT_LABELS[normalizedType]}>
          <Icon aria-hidden="true" focusable="false" />
        </span>
        {normalizedTitle ? <span className="blog-callout__title">{normalizedTitle}</span> : null}
      </div>
      <div className="blog-callout__body">{children}</div>
    </aside>
  )
}
