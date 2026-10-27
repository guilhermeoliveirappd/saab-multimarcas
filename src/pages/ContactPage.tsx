import { content } from '@/config/content'
import { siteConfig } from '@/config/site'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { ContactDetails, LocationMap } from '@/components/home/LocationContact'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { ButtonAnchor } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { trackEvent } from '@/lib/analytics'

export default function ContactPage() {
  useSeo({ ...STATIC_PAGES['/contato'], path: '/contato' })
  return (
    <>
      <PageHeader title={content.contact.title} description={content.contact.description} breadcrumb={[{ label: 'Contato' }]}>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton location="contact_header" size="lg">
            Conversar no WhatsApp
          </WhatsAppButton>
          <ButtonAnchor
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'instagram', location: 'contact_header' } })}
          >
            <InstagramIcon size={18} /> Instagram
          </ButtonAnchor>
        </div>
      </PageHeader>
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-950">Canais de atendimento</h2>
          <div className="mt-4">
            <ContactDetails />
          </div>
        </div>
        <LocationMap className="min-h-[400px]" />
      </div>
    </>
  )
}
