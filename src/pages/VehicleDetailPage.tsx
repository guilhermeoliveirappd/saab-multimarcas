import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Calendar, Check, Cog, Fuel, Gauge, Info, Landmark, Palette, Share2 } from 'lucide-react'
import { env } from '@/config/env'
import { siteConfig } from '@/config/site'
import { useVehicles } from '@/hooks/vehicles-context'
import { trackEvent } from '@/lib/analytics'
import { FUEL_LABELS, TRANSMISSION_LABELS, formatMileage, formatPrice, formatYears, vehicleFullName } from '@/lib/format'
import { getRelatedVehicles } from '@/lib/inventory-filters'
import { useSeo } from '@/lib/seo'
import { vehicleJsonLd, vehicleMeta } from '@/lib/seo-meta'
import { vehicleInterestMessage } from '@/lib/whatsapp'
import { Button, ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { StatusBadge } from '@/components/vehicles/StatusBadge'
import { VehicleCard, VehicleGrid } from '@/components/vehicles/VehicleCard'
import { VehicleGallery } from '@/components/vehicles/VehicleGallery'

function ShareButton({ vehicleId, title }: { vehicleId: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const onShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        trackEvent({ name: 'share_click', params: { vehicle_id: vehicleId, method: 'native' } })
      } catch {
        /* compartilhamento cancelado pelo usuário */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      trackEvent({ name: 'share_click', params: { vehicle_id: vehicleId, method: 'clipboard' } })
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copie o link do anúncio:', url)
    }
  }
  return (
    <Button variant="outline" size="lg" onClick={onShare} className="w-full">
      {copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
      {copied ? 'Link copiado' : 'Compartilhar'}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link do anúncio copiado para a área de transferência' : ''}
      </span>
    </Button>
  )
}

export default function VehicleDetailPage() {
  const { slug = '' } = useParams()
  const { vehicles, status, error, reload } = useVehicles()
  const vehicle = useMemo(() => vehicles.find((v) => v.slug === slug) ?? null, [vehicles, slug])
  const related = useMemo(() => (vehicle ? getRelatedVehicles(vehicle, vehicles) : []), [vehicle, vehicles])
  const siteUrl = env.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')

  useSeo(
    vehicle
      ? { ...vehicleMeta(vehicle), path: `/veiculos/${vehicle.slug}`, noindex: vehicle.isDemo, jsonLd: vehicleJsonLd(vehicle, siteUrl) }
      : { title: status === 'loading' ? 'Carregando veículo' : 'Veículo não encontrado', path: `/veiculos/${slug}`, noindex: true },
  )

  useEffect(() => {
    if (!vehicle) return
    trackEvent({
      name: 'vehicle_view',
      params: { vehicle_id: vehicle.id, vehicle_name: vehicleFullName(vehicle), price: vehicle.price, is_demo: vehicle.isDemo },
    })
  }, [vehicle])

  if (status === 'loading') {
    return (
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]" aria-busy="true">
        <Skeleton className="aspect-[16/10] rounded-[var(--radius-card)]" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="container-site py-16">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )
  }
  if (!vehicle) {
    return (
      <>
        <PageHeader title="Veículo não encontrado" breadcrumb={[{ label: 'Estoque', to: '/estoque' }, { label: 'Não encontrado' }]} />
        <div className="container-site py-16">
          <EmptyState
            title="Este anúncio não está disponível"
            description="O veículo pode ter sido removido ou o endereço está incorreto. Veja os veículos disponíveis no estoque."
            action={<ButtonLink to="/estoque" variant="dark">Ver estoque</ButtonLink>}
          />
        </div>
      </>
    )
  }

  const v = vehicle
  const name = vehicleFullName(v)
  const message = vehicleInterestMessage(v)
  const sold = v.status === 'vendido'
  const specs = [
    { icon: Calendar, label: 'Ano fab./modelo', value: formatYears(v) },
    { icon: Gauge, label: 'Quilometragem', value: formatMileage(v.mileage) },
    { icon: Cog, label: 'Câmbio', value: TRANSMISSION_LABELS[v.transmission] },
    { icon: Fuel, label: 'Combustível', value: FUEL_LABELS[v.fuel] },
    { icon: Palette, label: 'Cor', value: v.color },
  ]

  return (
    <>
      <div className="border-b border-ink-100 bg-ink-50">
        <nav aria-label="Trilha de navegação" className="container-site py-4">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-ink-500">
            <li>
              <Link to="/" className="hover:text-ink-950">Início</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/estoque" className="hover:text-ink-950">Estoque</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-700">
              {v.brand} {v.model}
            </li>
          </ol>
        </nav>
      </div>

      <article className="container-site py-10 pb-32 lg:py-14 lg:pb-14">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <VehicleGallery images={v.images} title={name} />
          </div>

          <aside className="text-center lg:sticky lg:top-28 lg:self-start">
            {/* Só sinaliza situações que mudam a negociação (reservado/vendido) */}
            {v.status !== 'disponivel' && (
              <div className="mb-5 flex justify-center">
                <StatusBadge status={v.status} />
              </div>
            )}
            <p className="eyebrow text-ink-400">{v.brand}</p>
            <h1 className="mt-2 font-display text-3xl leading-[1.05] font-extrabold text-ink-950 sm:text-4xl">
              {v.model} <span className="block text-xl font-bold text-ink-500 sm:text-2xl">{v.version}</span>
            </h1>

            <div className="mt-6 rounded-[var(--radius-card)] bg-ink-950 p-6 text-white">
              <p className="text-xs tracking-wide text-ink-400 uppercase">Preço</p>
              <p className={`mt-1 font-display text-4xl font-extrabold tracking-tight ${sold ? 'text-ink-500 line-through' : ''}`}>{formatPrice(v.price)}</p>
              <div className="mt-6 space-y-3">
                {sold ? (
                  <p className="flex items-center justify-center gap-2 rounded-xl bg-white/5 p-4 text-sm text-ink-300">
                    <Info size={18} className="shrink-0" aria-hidden="true" /> Veículo vendido. Veja opções semelhantes abaixo.
                  </p>
                ) : (
                  <>
                    <WhatsAppButton location="vehicle_detail" message={message} vehicle={{ id: v.id, name }} size="lg" className="w-full">
                      Tenho interesse
                    </WhatsAppButton>
                    {siteConfig.services.financing && (
                      <ButtonLink
                        to={`/financiamento?veiculo=${encodeURIComponent(v.slug)}`}
                        variant="outline-light"
                        size="lg"
                        className="w-full"
                        onClick={() => trackEvent({ name: 'financing_cta', params: { vehicle_id: v.id } })}
                      >
                        <Landmark size={18} aria-hidden="true" /> Solicitar financiamento
                      </ButtonLink>
                    )}
                  </>
                )}
                <ShareButton vehicleId={v.id} title={name} />
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-ink-100 ring-1 ring-ink-100">
              {specs.map(({ icon: Icon, label, value }, i) => (
                <div key={label} className={`bg-white p-4 ${i === specs.length - 1 && specs.length % 2 === 1 ? 'col-span-2' : ''}`}>
                  <dt className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
                    <Icon size={14} aria-hidden="true" /> {label}
                  </dt>
                  <dd className="mt-1 font-semibold text-ink-950">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Descrição e opcionais: lado a lado no desktop, empilhados no mobile */}
        <div className={`mt-12 grid gap-6 lg:mt-14 lg:gap-8 ${v.options.length > 0 ? 'lg:grid-cols-2' : ''}`}>
          <section aria-labelledby="desc-title" className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink-100 sm:p-8">
            <h2 id="desc-title" className="font-display text-xl font-bold text-ink-950 sm:text-2xl">Descrição</h2>
            <span className="mt-3 block h-1 w-8 rounded-full bg-accent" aria-hidden="true" />
            <p className="mt-5 leading-relaxed whitespace-pre-line text-ink-600">{v.description || 'Descrição em breve.'}</p>
          </section>
          {v.options.length > 0 && (
            <section aria-labelledby="options-title" className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink-100 sm:p-8">
              <h2 id="options-title" className="font-display text-xl font-bold text-ink-950 sm:text-2xl">Opcionais</h2>
              <span className="mt-3 block h-1 w-8 rounded-full bg-accent" aria-hidden="true" />
              <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {v.options.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink-700">
                    <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Check size={12} aria-hidden="true" />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="mt-10 text-center">
          <Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ink-950">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar ao estoque
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-ink-100 bg-ink-50 py-16 lg:py-20">
          <div className="container-site">
            <SectionHeading id="related-title" title="Veículos relacionados" className="mb-10" />
            <VehicleGrid>
              {related.map((r) => (
                <VehicleCard key={r.id} vehicle={r} />
              ))}
            </VehicleGrid>
          </div>
        </section>
      )}

      {/* Barra fixa de conversão no mobile */}
      {!sold && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs text-ink-500">
                {v.brand} {v.model}
              </p>
              <p className="font-display text-lg font-bold text-ink-950">{formatPrice(v.price)}</p>
            </div>
            <WhatsAppButton location="vehicle_detail_sticky" message={message} vehicle={{ id: v.id, name }}>
              Tenho interesse
            </WhatsAppButton>
          </div>
        </div>
      )}
    </>
  )
}
