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

const linkClass = 'text-[15px] leading-6 text-white/70 transition-colors duration-200 hover:text-white'

/** Coluna com título alinhado à esquerda; todas compartilham o mesmo topo. */
function Column({ title, className = '', children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h2 className="font-display text-xs font-semibold tracking-[0.16em] text-white uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

/** Linha de contato: ícone em coluna fixa de 18px, legenda alinhada ao primeiro traço de texto. */
function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[18px_1fr] items-start gap-3">
      <span className="mt-[3px] flex size-[18px] items-center justify-center text-brand-light">{icon}</span>
      <div className="min-w-0">{children}</div>
    </li>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const { address, phones, email, social } = siteConfig
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <footer className="relative isolate overflow-hidden bg-brand-deep text-white/70">
      <div className="absolute -top-48 right-0 -z-10 h-96 w-[40rem] max-w-full rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />

      <div className="container-site grid grid-cols-1 gap-x-12 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)_minmax(0,0.95fr)_minmax(0,1.35fr)] lg:gap-x-14 lg:py-20">
        {/* Marca */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label={`${siteConfig.name} — página inicial`} className="inline-block rounded-lg">
            <Logo tone="light" />
          </Link>
          <p lang="pt-BR" className="mt-6 max-w-[17.5rem] text-justify text-[15px] leading-7 text-white/70 [text-justify:inter-word]">
            Revenda de veículos em {siteConfig.city} ({siteConfig.state}).
          </p>
        </div>

        <Column title="Navegação">
          <nav aria-label="Rodapé">
            <ul className="space-y-2.5">
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
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className={linkClass}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        {/* Contato: somente canais e dados confirmados */}
        <Column title="Contato" className="sm:col-span-2 lg:col-span-1">
          <ul className="space-y-3.5">
            <ContactItem icon={<MapPin size={17} aria-hidden="true" />}>
              {address.confirmed ? (
                <address className="text-[15px] leading-6 not-italic">
                  {address.street}
                  <br />
                  {[address.district, siteConfig.city, siteConfig.state].filter(Boolean).join(' — ')}
                </address>
              ) : (
                <span className="text-[15px] leading-6">
                  {siteConfig.city} — {siteConfig.state}
                </span>
              )}
            </ContactItem>
            <ContactItem icon={<WhatsAppIcon size={17} />}>
              <a
                href={buildWhatsAppUrl(generalMessage(), env.whatsappNumber)}
                {...external}
                className={linkClass}
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'footer' } })}
              >
                WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </ContactItem>
            <ContactItem icon={<InstagramIcon size={17} />}>
              <a
                href={social.instagram}
                {...external}
                className={linkClass}
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'instagram', location: 'footer' } })}
              >
                {social.instagramHandle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </ContactItem>
            {social.facebook && (
              <ContactItem icon={<FacebookIcon size={17} />}>
                <a href={social.facebook} {...external} className={linkClass}>
                  Facebook
                </a>
              </ContactItem>
            )}
            {social.youtube && (
              <ContactItem icon={<YouTubeIcon size={17} />}>
                <a href={social.youtube} {...external} className={linkClass}>
                  YouTube
                </a>
              </ContactItem>
            )}
            {phones.map((phone) => (
              <ContactItem key={phone.e164} icon={<Phone size={16} aria-hidden="true" />}>
                <a href={`tel:${phone.e164}`} className={linkClass} aria-label={`${phone.label}: ${phone.display}`}>
                  {phone.display}
                </a>
              </ContactItem>
            ))}
            {email && (
              <ContactItem icon={<Mail size={16} aria-hidden="true" />}>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </ContactItem>
            )}
          </ul>
        </Column>
      </div>

      {/* Faixa inferior */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-[13px] text-white/55 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}
            {siteConfig.cnpj && ` · CNPJ ${siteConfig.cnpj}`}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/politica-de-privacidade" className="transition-colors hover:text-white">
              Política de Privacidade
            </Link>
            {/* Avisos legais (inclui atribuições exigidas por licenças de imagens) */}
            <Link to="/informacoes-legais" className="transition-colors hover:text-white">
              Informações legais
            </Link>
          </p>
          <p className="text-white/40">
            Desenvolvido por{' '}
            {siteConfig.agency.url ? (
              <a href={siteConfig.agency.url} {...external} className="hover:text-white">
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
