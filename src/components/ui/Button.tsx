import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClasses, type ButtonStyleProps } from './button-styles'

export function Button({ variant, size, className, ...props }: ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClasses({ variant, size, className })} {...props} />
}

export function ButtonLink({ variant, size, className, ...props }: ButtonStyleProps & LinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />
}

export function ButtonAnchor({ variant, size, className, ...props }: ButtonStyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClasses({ variant, size, className })} {...props} />
}
