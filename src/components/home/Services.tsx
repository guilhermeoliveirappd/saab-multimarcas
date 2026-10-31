import { ArrowRight, CarFront, KeyRound, Repeat } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '@/config/content'
import { env } from '@/config/env'
import { siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { SectionHeading } from '@/components/ui/SectionHeading'

const cardClass =
  'group relative flex h-full flex-col items-center text-center rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-ink-100 shadow-[var(--shadow-card)] transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] lg:p-8'

export function Services() {
  const s = content.services
  const flags = siteConfig.services
  const cards = [
    flags.buy && { key: 'buy', icon: CarFront, ...s.buy, to: '/estoque' },
    flags.sell && { key: 'sell', icon: KeyRound, ...s.sell, to: '/venda-ou-troca?intencao=vender' },
    flags.trade && {
      key: 'trade',
      icon: Repeat,
      ...s.trade,
      href: buildWhatsAppUrl(`Olá! Vim pelo site da ${siteConfig.name} e gostaria de usar meu veículo na troca por outro do estoque.`, env.whatsappNumber),
    },
  ].filter(Boolean) as Array<{ key: string; icon: typeof CarFront; title: string; text: string; cta: string; to?: string; href?: string }>

  // O título "Compre, venda ou troque" só faz sentido com venda/troca confirmadas
  if (cards.length === 0 || (!flags.sell && !flags.trade)) return null

  return (
    <section aria-labelledby="services-title" className="bg-ink-50 py-20 lg:py-28">
      <div className="container-site">
        <SectionHeading id="services-title" title={s.title} className="mb-12" />
        <ul className={`mx-auto grid max-w-md gap-6 lg:max-w-none ${cards.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {cards.map(({ key, icon: Icon, title, text, cta, to, href }) => {
            const inner = (
              <>
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-white transition-colors duration-500 group-hover:bg-accent-hover">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink-950">{title}</h3>
                <p className="mt-3 max-w-[17rem] flex-1 leading-relaxed text-balance text-ink-500">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {cta}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </>
            )
            return (
              <li key={key}>
                {to ? (
                  <Link to={to} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                    onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: `services_${key}` } })}
                  >
                    {inner}
                    <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
