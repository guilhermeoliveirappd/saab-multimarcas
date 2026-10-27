import { Clock, MapPin, MapPinned, Phone } from 'lucide-react'
import { env } from '@/config/env'
import { siteConfig } from '@/config/site'
import { trackEvent } from '@/lib/analytics'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonAnchor } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const Pending = () => <span className="text-ink-400 italic">a confirmar</span>

function formatWhatsApp(digits: string): string {
  const m = digits.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits
}

/** Lista de canais e informações de contato (reutilizada na home e em /contato). */
export function ContactDetails() {
  const { address, businessHours, social, phoneDisplay } = siteConfig
  const rows = [
    {
      icon: MapPin,
      label: 'Endereço',
      value: address.confirmed ? (
        <>
          {address.street}
          {address.district && `, ${address.district}`} — {siteConfig.city}/{siteConfig.state}
          {address.zip && ` · CEP ${address.zip}`}
        </>
      ) : (
        <>
          {siteConfig.city}/{siteConfig.state} · endereço <Pending />
        </>
      ),
    },
    {
      icon: Clock,
      label: 'Horário de funcionamento',
      value: businessHours ? (
        <ul>
          {businessHours.map((h) => (
            <li key={h.label}>
              {h.label}: {h.value}
            </li>
          ))}
        </ul>
      ) : (
        <Pending />
      ),
    },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: env.whatsappNumber ? formatWhatsApp(env.whatsappNumber) : <Pending />,
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
    <dl className="divide-y divide-ink-100">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex gap-4 py-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink-50 text-ink-900 ring-1 ring-ink-100">
            <Icon size={20} aria-hidden="true" />
          </span>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-400 uppercase">{label}</dt>
            <dd className="mt-1 font-medium text-ink-900">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

/** Mapa incorporado somente com localização validada; caso contrário, placeholder. */
export function LocationMap({ className = '' }: { className?: string }) {
  const { address } = siteConfig
  if (address.confirmed && address.mapsEmbedUrl) {
    return (
      <div className={`overflow-hidden rounded-[var(--radius-card)] ring-1 ring-ink-100 ${className}`}>
        <iframe
          title={`Mapa com a localização da ${siteConfig.name}`}
          src={address.mapsEmbedUrl}
          className="size-full min-h-[320px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }
  return (
    <div className={`relative grid min-h-[320px] place-items-center overflow-hidden rounded-[var(--radius-card)] bg-ink-950 text-center ${className}`}>
      <div
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]"
        aria-hidden="true"
      />
      <div className="relative px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-white">
          <MapPinned size={24} aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-xl font-bold text-white">{siteConfig.city} · {siteConfig.state}</p>
        <p className="mt-2 text-sm text-ink-300">O mapa será exibido após a confirmação do endereço.</p>
      </div>
    </div>
  )
}

export function LocationContact() {
  const { address } = siteConfig
  return (
    <section aria-labelledby="location-title" className="py-20 lg:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading id="location-title" eyebrow="Localização e contato" title="Venha conhecer a SAAB" description="Fale com a equipe e agende sua visita." />
          <div className="mt-8">
            <ContactDetails />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton location="home_location" size="lg" />
            {address.confirmed && address.mapsLink && (
              <ButtonAnchor
                href={address.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'maps', location: 'home_location' } })}
              >
                Como chegar
              </ButtonAnchor>
            )}
          </div>
        </div>
        <LocationMap className="min-h-[360px] lg:min-h-full" />
      </div>
    </section>
  )
}
