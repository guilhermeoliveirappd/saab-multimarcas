import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  title: string
  description?: ReactNode
  tone?: 'light' | 'dark'
  action?: ReactNode
  badge?: ReactNode
  as?: 'h1' | 'h2'
  /** id do título, para aria-labelledby da seção */
  id?: string
  className?: string
}

/** Título de seção centralizado: título e descrição com no máximo duas linhas cada. */
export function SectionHeading({ title, description, tone = 'light', action, badge, as: Tag = 'h2', className, id }: Props) {
  const dark = tone === 'dark'
  return (
    <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', className)}>
      {badge && <div className="mb-4">{badge}</div>}
      <Tag id={id} className={cn('font-display text-[1.6rem] leading-[1.1] font-bold text-balance sm:text-4xl lg:text-[2.6rem]', dark ? 'text-white' : 'text-ink-950')}>
        {title}
      </Tag>
      <span className="mt-5 h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
      {description && (
        <p className={cn('mt-5 max-w-xl text-[15px] leading-relaxed text-balance sm:text-lg', dark ? 'text-ink-300' : 'text-ink-500')}>{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
