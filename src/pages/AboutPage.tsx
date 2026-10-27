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

export default function AboutPage() {
  useSeo({ ...STATIC_PAGES['/sobre'], path: '/sobre' })
  const a = content.aboutPage
  return (
    <>
      <PageHeader title={a.title} description={a.intro} breadcrumb={[{ label: 'Sobre Nós' }]} badge={a.provisional && <ProvisionalBadge />} />

      <section className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className="space-y-12">
          {[a.history, a.purpose].map((block) => (
            <div key={block.title}>
              <h2 className="font-display text-3xl font-bold text-ink-950">{block.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-500">{block.text}</p>
            </div>
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

      <section aria-labelledby="about-location" className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="about-location" className="font-display text-3xl font-bold text-ink-950">Onde estamos</h2>
            <ProvisionalBadge label="Endereço a confirmar" />
          </div>
          <div className="mt-6">
            <ContactDetails />
          </div>
          <ButtonLink to="/estoque" size="lg" variant="dark" className="mt-8">
            Conheça nosso estoque <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
        </div>
        <LocationMap className="min-h-[360px]" />
      </section>
    </>
  )
}
