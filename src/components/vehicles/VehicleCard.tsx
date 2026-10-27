import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Calendar, Cog, Gauge } from 'lucide-react'
import type { Vehicle } from '@/types/vehicle'
import { TRANSMISSION_LABELS, formatMileage, formatPrice, formatYears } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui/States'
import { DemoTag, StatusBadge } from './StatusBadge'

interface Props {
  vehicle: Vehicle
  /** Prioriza carregamento da imagem (cards acima da dobra) */
  priority?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function VehicleCard({ vehicle: v, priority = false, headingLevel: Heading = 'h3' }: Props) {
  const cover = v.images[0]
  const href = `/veiculos/${v.slug}`
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] ring-1 ring-ink-100 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {cover ? (
          <img
            src={cover.url}
            alt={cover.alt ?? `${v.brand} ${v.model}`}
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

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-ink-400">{v.brand}</p>
        <Heading className="mt-1.5 font-display text-xl leading-tight font-bold text-ink-950">
          {/* Link cobre todo o card (padrão de card clicável acessível) */}
          <Link to={href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {v.model}
          </Link>
        </Heading>
        <p className="mt-1 line-clamp-1 text-sm text-ink-500">{v.version}</p>

        <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-ink-100 py-4 text-[13px] text-ink-600">
          <div className="flex flex-col gap-1">
            <dt className="flex items-center gap-1 text-ink-400">
              <Calendar size={13} aria-hidden="true" /> <span>Ano</span>
            </dt>
            <dd className="font-semibold text-ink-900">{formatYears(v)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="flex items-center gap-1 text-ink-400">
              <Gauge size={13} aria-hidden="true" /> <span>KM</span>
            </dt>
            <dd className="font-semibold text-ink-900">{formatMileage(v.mileage)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="flex items-center gap-1 text-ink-400">
              <Cog size={13} aria-hidden="true" /> <span>Câmbio</span>
            </dt>
            <dd className="font-semibold text-ink-900">{TRANSMISSION_LABELS[v.transmission]}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-ink-400">Preço</p>
            <p className={cn('font-display text-2xl font-bold tracking-tight', v.status === 'vendido' ? 'text-ink-400 line-through' : 'text-ink-950')}>
              {formatPrice(v.price)}
            </p>
          </div>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink-950 px-4 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-accent" aria-hidden="true">
            Ver detalhes <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink-100" aria-hidden="true">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  )
}

export function VehicleGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{children}</div>
}
