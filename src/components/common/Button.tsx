import type { ButtonHTMLAttributes } from 'react'
import { getButtonClass, type ButtonVariant } from '../../utils/button'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={`${getButtonClass(variant)} ${className ?? ''}`.trim()} {...props} />
}
