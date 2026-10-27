import type { ReactNode } from 'react'
import { AlertCircle, SearchX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-ink-100', className)} aria-hidden="true" />
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-ink-200 bg-ink-50 px-6 py-16 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-full bg-white text-ink-500 shadow-[var(--shadow-card)]">{icon ?? <SearchX size={24} />}</div>
      <h3 className="font-display text-xl font-bold text-ink-950">{title}</h3>
      {description && <p className="mt-2 max-w-md text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string | null; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-6 py-14 text-center">
      <AlertCircle className="mb-4 text-accent" size={28} />
      <h3 className="font-display text-xl font-bold text-ink-950">Não foi possível carregar os veículos</h3>
      <p className="mt-2 max-w-md text-ink-600">{message ?? 'Tente novamente em instantes.'}</p>
      {onRetry && (
        <Button variant="dark" className="mt-6" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
