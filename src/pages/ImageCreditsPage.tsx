import { ExternalLink } from 'lucide-react'
import { content } from '@/config/content'
import { useVehicles } from '@/hooks/vehicles-context'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import type { VehicleImage } from '@/types/vehicle'
import { PageHeader } from '@/components/ui/PageHeader'

/** Atribuição das fotos de terceiros (exigida pelas licenças Creative Commons). */
export default function ImageCreditsPage() {
  useSeo({ ...STATIC_PAGES['/creditos-de-imagens'], path: '/creditos-de-imagens' })
  const { vehicles } = useVehicles()
  const items: { label: string; image: VehicleImage }[] = [
    { label: 'Banner principal', image: content.hero.image },
    ...(content.hero.image.alternates ?? []).map((image) => ({ label: 'Banner principal (alternativa)', image })),
    ...vehicles.flatMap((v) => v.images.map((image) => ({ label: `${v.brand} ${v.model}`, image }))),
  ].filter((i) => i.image.credit)

  return (
    <>
      <PageHeader title="Créditos das imagens" description="Fotografias de terceiros usadas sob licenças livres." breadcrumb={[{ label: 'Créditos das imagens' }]} />
      <div className="container-site max-w-3xl py-12 lg:py-16">
        {items.length === 0 ? (
          <p className="text-center text-ink-500">Todas as imagens do site são próprias.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map(({ label, image }) => (
              <li key={image.url} className="flex flex-col items-center rounded-2xl bg-white p-5 text-center ring-1 ring-ink-100">
                <p className="font-semibold text-ink-950">{label}</p>
                <p className="mt-1 text-sm text-ink-500">
                  {image.credit!.author ?? 'Autor indicado na origem'} · {image.credit!.license ?? 'licença indicada na origem'}
                </p>
                <a href={image.credit!.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  Wikimedia Commons <ExternalLink size={13} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
