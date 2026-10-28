import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { env } from '@/config/env'
import { legalNav, mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, generalMessage } from '@/lib/whatsapp'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { Logo } from './Logo'

/** Serviços exibidos conforme as flags de `siteConfig.services`. */
const services = [
  siteConfig.services.buy && { label: 'Compra de veículos', to: '/estoque' },
  siteConfig.services.sell && { label: 'Venda do seu veículo', to: '/venda-ou-troca?intencao=vender' },
  siteConfig.services.trade && { label: 'Troca na negociação', to: '/venda-ou-troca' },
  siteConfig.services.financing && { label: 'Financiamento', to: '/financiamento' },
].filter(Boolean) as { label: string; to: string }[]

/** Redes sociais: só entram as que têm link cadastrado. */
const socials = [
  { label: 'Instagram', href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: 'Facebook', href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: 'YouTube', href: siteConfig.social.youtube, icon: YouTubeIcon },
].flatMap((s) => (s.href ? [{ ...s, href: s.href }] : []))

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display text-sm font-semibold tracking-tight text-white">{title}</h2>
      <span className="mt-3 mb-5 h-0.5 w-6 rounded-full bg-brand-light/70" aria-hidden="true" />
      {children}
    </div>
  )
}

const linkClass = 'text-[15px] text-white/70 transition-colors duration-200 hover:text-white'

export function Footer() {
  const year = new Date().getFullYear()
  const { address, businessHours, phoneDisplay, email } = siteConfig
  const whatsappHref = buildWhatsAppUrl(generalMessage(), env.whatsappNumber)

  return (
    <footer className="relative isolate overflow-hidden bg-brand-deep text-center text-white/70">
      {/* Brilhos sutis de fundo */}
      <div className="absolute -top-40 left-1/2 -z-10 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-brand/40 blur-3xl" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />

      <div className="container-site pt-16 pb-12 lg:pt-20">
        {/* Marca */}
        <div className="flex flex-col items-center">
          <Link to="/" aria-label={`${siteConfig.name} — página inicial`} className="rounded-lg">
            <Logo tone="light" className="scale-110" />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-balance text-white/70">
            Revenda de veículos multimarcas em {siteConfig.city} ({siteConfig.state}).
          </p>
        </div>

        <div className="mx-auto mt-12 h-px max-w-5xl bg-white/10" aria-hidden="true" />

        {/* Colunas */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <Column title="Navegação">
            <nav aria-label="Rodapé">
              <ul className="space-y-3">
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Column>

          <Column title="Serviços">
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Contato">
            <ul className="flex flex-col items-center space-y-3 text-[15px]">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-brand-light" aria-hidden="true" />
                {address.confirmed ? `${address.street}, ${siteConfig.city}/${siteConfig.state}` : `${siteConfig.city} · ${siteConfig.state}`}
              </li>
              {phoneDisplay && (
                <li className="flex items-center gap-2">
                  <Phone size={15} className="shrink-0 text-brand-light" aria-hidden="true" />
                  {phoneDisplay}
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail size={15} className="shrink-0 text-brand-light" aria-hidden="true" />
                  <a href={`mailto:${email}`} className={linkClass}>
                    {email}
                  </a>
                </li>
              )}
              {businessHours?.map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <Clock size={15} className="shrink-0 text-brand-light" aria-hidden="true" />
                  {h.label}: {h.value}
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'footer' } })}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-soft"
                >
                  <WhatsAppIcon size={17} /> WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </Column>

          <Column title="Redes sociais">
            <ul className="flex flex-wrap justify-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => label === 'Instagram' && trackEvent({ name: 'contact_click', params: { channel: 'instagram', location: 'footer' } })}
                    className="group grid size-12 place-items-center rounded-2xl bg-white/[0.06] text-white ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-deep"
                    aria-label={`${label} (abre em nova aba)`}
                  >
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-1 ${linkClass}`}>
              {siteConfig.social.instagramHandle} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </Column>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10 bg-brand-night/60">
        <div className="container-site flex flex-col items-center gap-3 py-6 text-[13px] text-white/55">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            © {year} {siteConfig.name}
            {siteConfig.cnpj && ` · CNPJ ${siteConfig.cnpj}`}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/40">
            Desenvolvido por{' '}
            {siteConfig.agency.url ? (
              <a href={siteConfig.agency.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {siteConfig.agency.name}
              </a>
            ) : (
              siteConfig.agency.name
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
