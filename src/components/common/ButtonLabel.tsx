type ButtonLabelProps = {
  children: string
}

export function ButtonLabel({ children }: ButtonLabelProps) {
  return <span className="btn__label-original">{children}</span>
}
