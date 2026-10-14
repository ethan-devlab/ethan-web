import type { ButtonHTMLAttributes } from 'react'
import { ButtonLabel } from './ButtonLabel'
import { getButtonClass, type ButtonVariant } from '../../utils/button'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button className={`${getButtonClass(variant)} ${className ?? ''}`.trim()} {...props}>
      {typeof children === 'string' ? <ButtonLabel>{children}</ButtonLabel> : children}
    </button>
  )
}
