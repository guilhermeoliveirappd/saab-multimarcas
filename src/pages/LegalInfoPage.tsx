import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '@/config/content'
import { siteConfig } from '@/config/site'
import { useVehicles } from '@/hooks/vehicles-context'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import type { VehicleImage } from '@/types/vehicle'
import { PageHeader } from '@/components/ui/PageHeader'

/**
 * Informações legais. Inclui a atribuição exigida pelas licenças Creative
 * Commons (CC BY / CC BY-SA) das fotografias de terceiros — a licença admite
 * cumprir a atribuição por link para uma página com essas informações, por
 * isso não há rótulos de crédito sobre as fotos. Imagens sob licenças que
 * dispensam atribuição (ex.: Pexels) não são listadas.
 */
export default function LegalInfoPage() {
  useSeo({ ...STATIC_PAGES['/informacoes-legais'], path: '/informacoes-legais' })
  const { vehicles } = useVehicles()
  const all: { label: string; image: VehicleImage }[] = [
    { label: 'Banner principal', image: content.hero.image },
    ...(content.hero.image.alternates ?? []).map((image) => ({ label: 'Banner principal', image })),
    ...vehicles.flatMap((v) => v.images.map((image) => ({ label: `${v.brand} ${v.model}`, image }))),
  ]
  const attributions = all.filter((i) => i.image.credit && /^CC/.test(i.image.credit.license ?? 'CC'))

  return (
    <>
      <PageHeader title="Informações legais" breadcrumb={[{ label: 'Informações legais' }]} />
      <div className="container-site max-w-3xl space-y-12 py-12 lg:py-16">
        <section aria-labelledby="legal-site">
          <h2 id="legal-site" className="font-display text-xl font-bold text-ink-950">
            Sobre este site
          </h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Site da {siteConfig.name}. O tratamento de dados pessoais está descrito na{' '}
            <Link to="/politica-de-privacidade" className="font-medium text-accent underline-offset-2 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        {attributions.length > 0 && (
          <section aria-labelledby="legal-images">
            <h2 id="legal-images" className="font-display text-xl font-bold text-ink-950">
              Licenças de imagens
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Algumas fotografias são de terceiros e usadas sob licenças Creative Commons, conforme a atribuição abaixo. As obras podem ter sido
              redimensionadas ou recortadas para exibição.
            </p>
            <ul className="mt-6 divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-100">
              {attributions.map(({ label, image }) => (
                <li key={image.url} className="flex flex-col gap-1 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-ink-900">{label}</span>
                  <span className="text-ink-500">
                    {image.credit!.author ?? 'Autor indicado na origem'} · {image.credit!.license ?? 'licença indicada na origem'} ·{' '}
                    <a href={image.credit!.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      origem <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
