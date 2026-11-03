import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { env } from '@/config/env'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
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
  // Link direto do WhatsApp (sem mensagem pré-preenchida), conforme solicitado
  const socialLinks = [
    { label: 'WhatsApp', href: `https://wa.me/${env.whatsappNumber}`, icon: WhatsAppIcon, channel: 'whatsapp' as const },
    { label: 'Instagram', href: social.instagram, icon: InstagramIcon, channel: 'instagram' as const },
    ...(social.facebook ? [{ label: 'Facebook', href: social.facebook, icon: FacebookIcon, channel: null }] : []),
    ...(social.youtube ? [{ label: 'YouTube', href: social.youtube, icon: YouTubeIcon, channel: null }] : []),
  ]

  return (
    // Fundo sólido, sem gradientes/brilhos: o vermelho aparece só em detalhes
    <footer className="bg-footer text-white/70">

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
                  {[address.district, `${siteConfig.city}/${siteConfig.state}`].filter(Boolean).join(' — ')}
                </address>
              ) : (
                <span className="text-[15px] leading-6">
                  {siteConfig.city} — {siteConfig.state}
                </span>
              )}
            </ContactItem>
            {/* Apenas o telefone fixo é exibido; o celular é usado só no link do WhatsApp */}
            {phones
              .filter((phone) => phone.label === 'Telefone')
              .map((phone) => (
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
          {/* Redes: ícones lado a lado, clicáveis */}
          <ul className="mt-6 flex items-center gap-3" aria-label="Redes e mensagens">
            {socialLinks.map(({ label, href, icon: Icon, channel }) => (
              <li key={label}>
                <a
                  href={href}
                  {...external}
                  aria-label={`${label} (abre em nova aba)`}
                  title={label}
                  onClick={() => channel && trackEvent({ name: 'contact_click', params: { channel, location: 'footer' } })}
                  className="grid size-10 place-items-center rounded-full bg-white/[0.06] text-white/80 ring-1 ring-white/10 transition-colors duration-200 hover:bg-brand hover:text-white hover:ring-brand"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
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
              <a
                href={siteConfig.agency.url}
                {...external}
                className="text-white/65 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
              >
                {siteConfig.agency.name}
                <span className="sr-only"> (abre em nova aba)</span>
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
