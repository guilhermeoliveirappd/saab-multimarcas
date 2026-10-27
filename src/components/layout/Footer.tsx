import { Link } from 'react-router'
import { MapPin } from 'lucide-react'
import { legalNav, mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()
  const { address } = siteConfig
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <Logo tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Revenda de veículos em {siteConfig.city} ({siteConfig.state}).
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white transition-colors hover:border-white/40"
              aria-label={`Instagram ${siteConfig.social.instagramHandle} (abre em nova aba)`}
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="eyebrow mb-5 text-white">Navegação</h2>
          <ul className="space-y-3 text-sm">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-5 text-white">Institucional</h2>
          <ul className="space-y-3 text-sm">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            {siteConfig.legalName && <li>{siteConfig.legalName}</li>}
            {siteConfig.cnpj && <li>CNPJ {siteConfig.cnpj}</li>}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-5 text-white">Atendimento</h2>
          <p className="flex gap-2 text-sm leading-relaxed">
            <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            {address.confirmed ? (
              <span>
                {address.street}
                {address.district && ` — ${address.district}`}
                <br />
                {siteConfig.city} — {siteConfig.state}
              </span>
            ) : (
              <span>
                {siteConfig.city} — {siteConfig.state}
                <br />
                <span className="text-ink-400">Endereço a confirmar</span>
              </span>
            )}
          </p>
          <WhatsAppButton location="footer" variant="light" className="mt-6" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por{' '}
            {siteConfig.agency.url ? (
              <a href={siteConfig.agency.url} target="_blank" rel="noopener noreferrer" className="text-ink-300 hover:text-white">
                {siteConfig.agency.name}
              </a>
            ) : (
              <span className="text-ink-300">{siteConfig.agency.name}</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
