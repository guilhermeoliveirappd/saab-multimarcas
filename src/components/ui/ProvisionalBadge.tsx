import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/** Selo para conteúdos que ainda dependem de validação do cliente. */
export function ProvisionalBadge({ className, label = 'Conteúdo provisório', tone = 'light' }: { className?: string; label?: string; tone?: 'light' | 'dark' }) {
  if (!siteConfig.showProvisionalMarkers) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase',
        tone === 'light' ? 'border-warning/50 bg-amber-50 text-warning' : 'border-amber-300/50 bg-amber-300/10 text-amber-200',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  )
}
