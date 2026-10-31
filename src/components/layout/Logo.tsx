import { brand } from '@/config/brand'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * Marca no header/rodapé. Usa o arquivo oficial se configurado em
 * `siteConfig.logo`; caso contrário, o WORDMARK TIPOGRÁFICO PROVISÓRIO
 * "ROBCAR VEÍCULOS" (a Robcar não possui logotipo oficial — este wordmark não
 * deve ser apresentado como tal).
 */
export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const src = tone === 'light' ? (siteConfig.logo.srcOnDark ?? siteConfig.logo.src) : siteConfig.logo.src
  if (src) return <img src={src} alt={siteConfig.name} className={cn('h-9 w-auto', className)} />

  const light = tone === 'light'
  return (
    <span className={cn('inline-flex flex-col leading-none', light ? 'text-white' : 'text-ink-950', className)}>
      <span className="flex items-center gap-2">
        <span className="h-5 w-1.5 -skew-x-12 rounded-[1px] bg-brand" aria-hidden="true" />
        <span className="font-display text-[1.45rem] font-extrabold tracking-[0.04em]" aria-hidden="true">
          {brand.wordmark.primary}
        </span>
      </span>
      <span className={cn('mt-1 pl-3.5 text-[0.58rem] font-semibold tracking-[0.5em]', light ? 'text-ink-300' : 'text-ink-500')} aria-hidden="true">
        {brand.wordmark.secondary}
      </span>
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  )
}
