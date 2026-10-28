import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { env } from '@/config/env'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, generalMessage } from '@/lib/whatsapp'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { Logo } from './Logo'

/** Serviços conforme as flags de `siteConfig.services` (só o que é oferecido). */
const services = [
  siteConfig.services.buy && { label: 'Compra de veículos', to: '/estoque' },
  siteConfig.services.sell && { label: 'Venda do seu veículo', to: '/venda-ou-troca?intencao=vender' },
  siteConfig.services.trade && { label: 'Troca na negociação', to: '/venda-ou-troca' },
  siteConfig.services.financing && { label: 'Financiamento', to: '/financiamento' },
].filter(Boolean) as { label: string; to: string }[]

const linkClass = 'text-[15px] text-white/70 transition-colors duration-200 hover:text-white'

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display text-[13px] font-semibold tracking-[0.14em] text-white uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

/** Item de contato com ícone, alinhado ao centro. */
function ContactLink({ href, icon, children, external, onClick }: { href?: string; icon: ReactNode; children: ReactNode; external?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <span className="text-brand-light">{icon}</span>
      {children}
    </>
  )
  const cls = 'inline-flex items-center justify-center gap-2.5'
  return href ? (
    <a href={href} className={`${cls} ${linkClass}`} onClick={onClick} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {inner}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  ) : (
    <span className={`${cls} text-[15px] text-white/70`}>{inner}</span>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const { address, phoneDisplay, email, social } = siteConfig

  return (
    <footer className="relative isolate overflow-hidden bg-brand-deep text-center text-white/70">
      <div className="absolute -top-48 left-1/2 -z-10 h-96 w-[56rem] max-w-full -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />

      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10 lg:py-20">
        {/* 1. Marca */}
        <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label={`${siteConfig.name} — página inicial`} className="rounded-lg">
            <Logo tone="light" />
          </Link>
          <p className="mt-5 max-w-[17rem] text-[15px] leading-relaxed text-balance">
            Revenda de veículos multimarcas em {siteConfig.city} ({siteConfig.state}).
          </p>
        </div>

        {/* 2. Navegação */}
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

        {/* 3. Serviços */}
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

        {/* 4. Contato e redes sociais (somente canais cadastrados) */}
        <Column title="Contato">
          <ul className="space-y-3">
            <li>
              <ContactLink
                href={buildWhatsAppUrl(generalMessage(), env.whatsappNumber)}
                external
                icon={<WhatsAppIcon size={17} />}
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'footer' } })}
              >
                WhatsApp
              </ContactLink>
            </li>
            <li>
              <ContactLink
                href={social.instagram}
                external
                icon={<InstagramIcon size={17} />}
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'instagram', location: 'footer' } })}
              >
                {social.instagramHandle}
              </ContactLink>
            </li>
            {social.facebook && (
              <li>
                <ContactLink href={social.facebook} external icon={<FacebookIcon size={17} />}>
                  Facebook
                </ContactLink>
              </li>
            )}
            {social.youtube && (
              <li>
                <ContactLink href={social.youtube} external icon={<YouTubeIcon size={17} />}>
                  YouTube
                </ContactLink>
              </li>
            )}
            {phoneDisplay && (
              <li>
                <ContactLink href={`tel:+${phoneDisplay.replace(/\D/g, '')}`} icon={<Phone size={16} />}>
                  {phoneDisplay}
                </ContactLink>
              </li>
            )}
            {email && (
              <li>
                <ContactLink href={`mailto:${email}`} icon={<Mail size={16} />}>
                  {email}
                </ContactLink>
              </li>
            )}
            <li>
              <ContactLink icon={<MapPin size={16} />}>
                {address.confirmed ? `${address.street}, ${siteConfig.city}/${siteConfig.state}` : `${siteConfig.city} · ${siteConfig.state}`}
              </ContactLink>
            </li>
          </ul>
        </Column>
      </div>

      {/* Faixa inferior */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center gap-3 py-6 text-[13px] text-white/55 lg:flex-row lg:justify-between">
          <p>
            © {year} {siteConfig.name}
            {siteConfig.cnpj && ` · CNPJ ${siteConfig.cnpj}`}
          </p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link to="/politica-de-privacidade" className="transition-colors hover:text-white">
              Política de Privacidade
            </Link>
            <Link to="/creditos-de-imagens" className="transition-colors hover:text-white">
              Créditos das imagens
            </Link>
          </p>
          <p className="text-white/40">
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
