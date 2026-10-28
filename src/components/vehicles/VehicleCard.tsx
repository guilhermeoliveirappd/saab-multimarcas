import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Vehicle } from '@/types/vehicle'
import { TRANSMISSION_LABELS, formatMileage, formatPrice, formatYears } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Photo } from '@/components/ui/Photo'
import { Skeleton } from '@/components/ui/States'
import { DemoTag, StatusBadge } from './StatusBadge'

interface Props {
  vehicle: Vehicle
  /** Prioriza carregamento da imagem (cards acima da dobra) */
  priority?: boolean
  headingLevel?: 'h2' | 'h3'
}

const CARD_SIZES = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw'

export function VehicleCard({ vehicle: v, priority = false, headingLevel: Heading = 'h3' }: Props) {
  const cover = v.images[0]
  const href = `/veiculos/${v.slug}`
  const specs = [formatYears(v), formatMileage(v.mileage), TRANSMISSION_LABELS[v.transmission]]
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white text-center shadow-[var(--shadow-card)] ring-1 ring-ink-100 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {cover ? (
          <Photo
            image={cover}
            sizes={CARD_SIZES}
            width={960}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center text-sm text-ink-400">Sem foto</div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {v.status !== 'disponivel' && <StatusBadge status={v.status} className="bg-white/95" />}
          {v.isDemo && <DemoTag />}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pt-5 pb-6">
        <p className="eyebrow text-ink-400">{v.brand}</p>
        <Heading className="mt-1 font-display text-xl leading-tight font-bold text-ink-950">
          {/* Link cobre todo o card (padrão de card clicável acessível) */}
          <Link to={href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {v.model}
          </Link>
        </Heading>
        <p className="mt-1 text-sm text-balance text-ink-500">{v.version}</p>

        <ul className="mt-4 flex flex-wrap justify-center gap-1.5" aria-label="Ano, quilometragem e câmbio">
          {specs.map((s) => (
            <li key={s} className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold whitespace-nowrap text-ink-700 ring-1 ring-ink-100">
              {s}
            </li>
          ))}
        </ul>

        <p className={cn('mt-5 font-display text-2xl font-bold tracking-tight', v.status === 'vendido' ? 'text-ink-400 line-through' : 'text-ink-950')}>
          {formatPrice(v.price)}
        </p>
        <span
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-accent-hover"
          aria-hidden="true"
        >
          Ver detalhes <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  )
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink-100" aria-hidden="true">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="flex flex-col items-center space-y-3 p-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-7 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  )
}

export function VehicleGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{children}</div>
}
