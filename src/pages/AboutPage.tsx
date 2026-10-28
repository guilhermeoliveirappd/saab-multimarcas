import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { PhotoPlaceholder } from '@/components/home/AboutPreview'
import { Differentials } from '@/components/home/Differentials'
import { ContactDetails, LocationMap } from '@/components/home/LocationContact'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProvisionalBadge } from '@/components/ui/ProvisionalBadge'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default function AboutPage() {
  useSeo({ ...STATIC_PAGES['/sobre'], path: '/sobre' })
  const a = content.aboutPage
  return (
    <>
      <PageHeader title={a.title} description={a.intro} breadcrumb={[{ label: 'Sobre Nós' }]} badge={a.provisional && <ProvisionalBadge />} />

      <section className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className="flex flex-col justify-center space-y-12">
          {[a.history, a.purpose].map((block) => (
            <SectionHeading key={block.title} title={block.title} description={block.text} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {a.gallery.length > 0 ? (
            a.gallery.map((img, i) => (
              <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className={`w-full rounded-[var(--radius-card)] object-cover ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`} />
            ))
          ) : (
            <>
              <PhotoPlaceholder label="Foto da loja — a receber" className="col-span-2 aspect-[16/9]" />
              <PhotoPlaceholder label="Foto da equipe" className="aspect-square" />
              <PhotoPlaceholder label="Foto do showroom" className="aspect-square" />
            </>
          )}
        </div>
      </section>

      <Differentials />

      <section aria-labelledby="about-location" className="container-site py-16 lg:py-24">
        <SectionHeading id="about-location" title="Onde estamos" badge={<ProvisionalBadge label="Endereço a confirmar" />} className="mb-10" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-center">
            <ContactDetails />
            <ButtonLink to="/estoque" size="lg" variant="primary" className="mt-6">
              Conheça nosso estoque <ArrowRight size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
          <LocationMap className="min-h-[360px]" />
        </div>
      </section>
    </>
  )
}
