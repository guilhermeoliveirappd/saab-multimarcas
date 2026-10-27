import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * Logotipo. Usa o arquivo oficial se configurado em `siteConfig.logo`;
 * caso contrário, exibe um logotipo tipográfico provisório.
 */
export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const src = tone === 'light' ? (siteConfig.logo.srcOnDark ?? siteConfig.logo.src) : siteConfig.logo.src
  if (src) return <img src={src} alt={siteConfig.name} className={cn('h-9 w-auto', className)} />

  return (
    <span className={cn('inline-flex items-center gap-2.5 leading-none', tone === 'light' ? 'text-white' : 'text-ink-950', className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-current" aria-hidden="true">
        <span className={cn('font-display text-lg font-black', tone === 'light' ? 'text-ink-950' : 'text-white')}>S</span>
        <span className="absolute right-1.5 bottom-1.5 h-1 w-2.5 -skew-x-12 rounded-[1px] bg-accent" />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-[1.35rem] font-extrabold tracking-[0.06em]">SAAB</span>
        <span className={cn('mt-0.5 text-[0.56rem] font-semibold tracking-[0.42em]', tone === 'light' ? 'text-ink-300' : 'text-ink-500')}>MULTIMARCAS</span>
      </span>
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  )
}
