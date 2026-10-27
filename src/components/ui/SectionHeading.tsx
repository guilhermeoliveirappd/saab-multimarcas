import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  action?: ReactNode
  badge?: ReactNode
  as?: 'h1' | 'h2'
  /** id do título, para aria-labelledby da seção */
  id?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', tone = 'light', action, badge, as: Tag = 'h2', className, id }: Props) {
  const dark = tone === 'dark'
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', align === 'center' && 'items-center text-center md:flex-col md:items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {(eyebrow || badge) && (
          <div className={cn('mb-4 flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
            {eyebrow && (
              <p className={cn('eyebrow flex items-center gap-2', dark ? 'text-ink-300' : 'text-ink-500')}>
                <span className="h-px w-6 bg-accent" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            {badge}
          </div>
        )}
        <Tag id={id} className={cn('font-display text-3xl leading-[1.05] font-bold text-balance sm:text-4xl lg:text-[2.75rem]', dark ? 'text-white' : 'text-ink-950')}>
          {title}
        </Tag>
        {description && <p className={cn('mt-4 text-base leading-relaxed text-pretty sm:text-lg', dark ? 'text-ink-300' : 'text-ink-500')}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
