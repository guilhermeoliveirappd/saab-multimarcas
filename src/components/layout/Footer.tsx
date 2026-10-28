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
    <footer className="bg-ink-950 text-center text-ink-300">
      <div className="container-site flex flex-col items-center py-16 lg:py-20">
        <Logo tone="light" />
        <p className="mt-5 flex items-center gap-1.5 text-sm">
          <MapPin size={15} className="shrink-0 text-brand-light" aria-hidden="true" />
          {address.confirmed ? `${address.street} · ${siteConfig.city}/${siteConfig.state}` : `${siteConfig.city}/${siteConfig.state} · endereço a confirmar`}
        </p>

        <nav aria-label="Rodapé" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <WhatsAppButton location="footer" variant="primary" />
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-white/50"
            aria-label={`Instagram ${siteConfig.social.instagramHandle} (abre em nova aba)`}
          >
            <InstagramIcon size={18} />
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-400">
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

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center gap-1.5 py-6 text-xs text-ink-400">
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
