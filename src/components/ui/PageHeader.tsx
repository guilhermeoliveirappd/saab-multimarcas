import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

interface Props {
  title: string
  description?: ReactNode
  breadcrumb?: { label: string; to?: string }[]
  children?: ReactNode
  badge?: ReactNode
}

/** Cabeçalho centralizado das páginas internas, com trilha de navegação. */
export function PageHeader({ title, description, breadcrumb = [], children, badge }: Props) {
  const trail = [{ label: 'Início', to: '/' }, ...breadcrumb]
  return (
    <section className="border-b border-ink-100 bg-ink-50">
      <div className="container-site flex flex-col items-center py-10 text-center lg:py-14">
        <nav aria-label="Trilha de navegação">
          <ol className="flex flex-wrap items-center justify-center gap-1 text-xs text-ink-500">
            {trail.map((item, i) => (
              <li key={item.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                {item.to && i < trail.length - 1 ? (
                  <Link to={item.to} className="hover:text-ink-950">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-700">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {badge && <div className="mt-6">{badge}</div>}
        <h1 className="mt-4 max-w-3xl font-display text-[1.9rem] leading-[1.08] font-bold text-balance text-ink-950 sm:text-5xl">{title}</h1>
        <span className="mt-5 h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
        {description && <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-balance text-ink-500 sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  )
}
