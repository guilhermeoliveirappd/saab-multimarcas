import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { useVehicles } from '@/hooks/vehicles-context'
import { isListed } from '@/lib/inventory-filters'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { VehicleCard, VehicleCardSkeleton, VehicleGrid } from '@/components/vehicles/VehicleCard'

const MAX_FEATURED = 6

export function FeaturedVehicles() {
  const { vehicles, status, error, reload } = useVehicles()
  const featured = useMemo(() => vehicles.filter((v) => v.featured && isListed(v)).slice(0, MAX_FEATURED), [vehicles])
  const { featured: copy } = content

  return (
    <section aria-labelledby="featured-title" className="py-20 lg:py-28">
      <div className="container-site">
        <SectionHeading
          id="featured-title"
          title={copy.title}
          description={copy.description}
          action={
            <ButtonLink to="/estoque" variant="outline">
              {copy.cta} <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          }
          className="mb-12"
        />
        {status === 'error' ? (
          <ErrorState message={error} onRetry={reload} />
        ) : status === 'loading' ? (
          <VehicleGrid>
            {Array.from({ length: 3 }, (_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </VehicleGrid>
        ) : featured.length === 0 ? (
          <EmptyState title="Nenhum destaque no momento" description="Confira o estoque completo para ver todos os veículos disponíveis." />
        ) : (
          <VehicleGrid>
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </VehicleGrid>
        )}
      </div>
    </section>
  )
}
