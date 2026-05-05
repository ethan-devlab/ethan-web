export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

export function getButtonClass(variant: ButtonVariant = 'primary'): string {
  return `btn btn--${variant}`
}
