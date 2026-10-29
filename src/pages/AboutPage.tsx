import { content } from '@/config/content'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { BrandPanel } from '@/components/home/BrandPanel'
import { Differentials } from '@/components/home/Differentials'
import { LocationBlock } from '@/components/home/LocationContact'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default function AboutPage() {
  useSeo({ ...STATIC_PAGES['/sobre'], path: '/sobre' })
  const a = content.aboutPage
  const blocks = [a.history, a.purpose].filter((b): b is { title: string; text: string } => b !== null)
  return (
    <>
      <PageHeader title={a.title} description={a.intro} breadcrumb={[{ label: 'Sobre Nós' }]} />

      {/* História/propósito e galeria aparecem assim que o conteúdo oficial for cadastrado em content.ts */}
      {(blocks.length > 0 || a.gallery.length > 0) && (
        <section className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="flex flex-col justify-center space-y-12">
            {blocks.map((block) => (
              <SectionHeading key={block.title} title={block.title} description={block.text} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {a.gallery.length > 0 ? (
              a.gallery.map((img, i) => (
                <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className={`w-full rounded-[var(--radius-card)] object-cover ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`} />
              ))
            ) : (
              <BrandPanel className="col-span-2 aspect-[4/3]" />
            )}
          </div>
        </section>
      )}

      <Differentials />

      <section aria-labelledby="about-location" className="container-site py-16 lg:py-24">
        <SectionHeading id="about-location" title="Onde estamos" className="mb-10" />
        <LocationBlock trackingLocation="about_location" />
      </section>
    </>
  )
}
