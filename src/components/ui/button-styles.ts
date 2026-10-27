import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'outline-light' | 'ghost'
export type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover shadow-[0_8px_24px_-12px_var(--color-accent)]',
  dark: 'bg-ink-900 text-white hover:bg-ink-700',
  light: 'bg-white text-ink-900 hover:bg-ink-100',
  outline: 'border border-ink-200 bg-white text-ink-900 hover:border-ink-900',
  'outline-light': 'border border-white/25 text-white hover:border-white hover:bg-white/5',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export interface ButtonStyleProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export const buttonClasses = ({ variant = 'primary', size = 'md', className }: Omit<ButtonStyleProps, 'children'>) =>
  cn(base, variants[variant], sizes[size], className)

