import type { VehicleStatus } from '@/types/vehicle'
import { STATUS_LABELS } from '@/lib/format'
import { cn } from '@/lib/cn'

const styles: Record<VehicleStatus, string> = {
  disponivel: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  reservado: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  vendido: 'bg-ink-100 text-ink-600 ring-ink-400/30',
}

export function StatusBadge({ status, className }: { status: VehicleStatus; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', styles[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink-950 uppercase', className)}>
      Demonstração
    </span>
  )
}
