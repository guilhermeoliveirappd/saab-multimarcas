import { ArrowRight, Clock, MapPin, MapPinned, Navigation, Phone } from 'lucide-react'
import { env } from '@/config/env'
import { formatAddress, mapsLinks, siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, generalMessage } from '@/lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { BrandPanel } from './BrandPanel'
import { content } from '@/config/content'
import { SectionHeading } from '@/components/ui/SectionHeading'

function formatWhatsApp(digits: string): string {
  const m = digits.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits
}

/** Lista de canais e informações de contato (reutilizada na home e em /contato). */
export function ContactDetails() {
  const { address, businessHours, social, phoneDisplay } = siteConfig
  // Só exibe dados confirmados em src/config/site.ts — nada de "a confirmar" na interface
  const rows = [
    {
      icon: MapPin,
      label: address.confirmed ? 'Endereço' : 'Localização',
      value: address.confirmed ? (
        <>
          {address.street}
          <br />
          {[address.district, siteConfig.city, siteConfig.state].filter(Boolean).join(' — ')}
        </>
      ) : (
        formatAddress()
      ),
    },
    ...(businessHours
      ? [
          {
            icon: Clock,
            label: 'Horário de funcionamento',
            value: (
              <ul>
                {businessHours.map((h) => (
                  <li key={h.label}>
                    {h.label}: {h.value}
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: (
        <a
          href={buildWhatsAppUrl(generalMessage(), env.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950"
          onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'contact_details' } })}
        >
          {env.whatsappNumber ? formatWhatsApp(env.whatsappNumber) : 'Iniciar conversa'}
        </a>
      ),
    },
    ...(phoneDisplay ? [{ icon: Phone, label: 'Telefone', value: phoneDisplay }] : []),
    {
      icon: InstagramIcon,
      label: 'Instagram',
      value: (
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950"
          onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'instagram', location: 'contact_details' } })}
        >
          {social.instagramHandle}
        </a>
      ),
    },
  ]
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(({ icon: Icon, label, value }, i) => (
        <div
          key={label}
          className={`flex flex-col items-center rounded-2xl bg-white p-5 text-center ring-1 ring-ink-100 ${i === 0 || (rows.length % 2 === 0 && i === rows.length - 1) ? 'sm:col-span-2' : ''}`}
        >
          <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
            <Icon size={20} aria-hidden="true" />
          </span>
          <dt className="mt-3 text-xs font-semibold tracking-wide text-ink-400 uppercase">{label}</dt>
          <dd className="mt-1 text-[15px] font-medium text-balance text-ink-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Mapa incorporado somente com localização validada; caso contrário, placeholder. */
export function LocationMap({ className = '' }: { className?: string }) {
  const { address } = siteConfig
  if (address.confirmed) {
    return (
      <div className={`overflow-hidden rounded-[var(--radius-card)] ring-1 ring-ink-100 ${className}`}>
        <iframe
          title={`Mapa com a localização da ${siteConfig.name}`}
          src={mapsLinks.embed}
          className="size-full min-h-[320px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }
  return (
    <div className={`relative grid min-h-[320px] place-items-center overflow-hidden rounded-[var(--radius-card)] bg-brand-deep text-center ${className}`}>
      <div
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]"
        aria-hidden="true"
      />
      <div className="relative px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-white">
          <MapPinned size={24} aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-xl font-bold text-white">{siteConfig.city} · {siteConfig.state}</p>
      </div>
    </div>
  )
}

/**
 * Bloco de localização (home e "Onde estamos"): só dados de localização.
 * Com endereço confirmado: endereço, horário, botão de rota e mapa.
 * Sem confirmação: apenas o painel com a cidade — nada inventado.
 */
export function LocationBlock({ trackingLocation }: { trackingLocation: string }) {
  const { address, businessHours } = siteConfig
  if (!address.confirmed) return <LocationMap className="mx-auto min-h-[280px] max-w-4xl sm:min-h-[320px]" />

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] bg-white p-8 text-center ring-1 ring-ink-100">
        <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <MapPin size={22} aria-hidden="true" />
        </span>
        <p className="mt-4 text-lg font-semibold text-balance text-ink-950">{address.street}</p>
        <p className="mt-1 text-balance text-ink-500">
          {[address.district, siteConfig.city, siteConfig.state].filter(Boolean).join(' — ')}
          {address.zip && ` · CEP ${address.zip}`}
        </p>
        {businessHours && (
          <ul className="mt-4 space-y-1 text-sm text-ink-600">
            {businessHours.map((h) => (
              <li key={h.label}>
                {h.label}: {h.value}
              </li>
            ))}
          </ul>
        )}
        <ButtonAnchor
            href={mapsLinks.route}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="mt-6"
            onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'maps', location: trackingLocation } })}
          >
            <Navigation size={17} aria-hidden="true" /> Como chegar
          </ButtonAnchor>
      </div>
      <LocationMap className="min-h-[360px]" />
    </div>
  )
}

/**
 * Home — "Venha conhecer a SAAB": conteúdo (endereço e ações) ao lado da foto
 * real da fachada. Sem foto cadastrada, exibe o painel com a marca.
 */
export function LocationContact() {
  const { address } = siteConfig
  const { title, aboutCta, facade } = content.location
  return (
    <section aria-labelledby="location-title" className="bg-white py-20 lg:py-28">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col items-center text-center">
          <SectionHeading id="location-title" title={title} />
          {address.confirmed && (
            <address className="mt-6 flex flex-col items-center not-italic">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <span className="mt-3 text-lg font-semibold text-ink-950">{address.street}</span>
              <span className="mt-0.5 text-ink-500">{[address.district, siteConfig.city, siteConfig.state].filter(Boolean).join(' — ')}</span>
            </address>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {address.confirmed && (
              <ButtonAnchor
                href={mapsLinks.route}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'maps', location: 'home_location' } })}
              >
                <Navigation size={17} aria-hidden="true" /> Como chegar
              </ButtonAnchor>
            )}
            <ButtonLink to="/sobre" variant="outline" size="lg">
              {aboutCta} <ArrowRight size={17} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        {facade ? (
          // Proporção original preservada (sem recorte): fachada e logotipo inteiros
          <img
            src={facade.src}
            srcSet={facade.srcSet}
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
            width={facade.width}
            height={facade.height}
            alt={facade.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] ring-1 ring-ink-100"
          />
        ) : (
          <BrandPanel className="aspect-[4/3]" />
        )}
      </div>
    </section>
  )
}
