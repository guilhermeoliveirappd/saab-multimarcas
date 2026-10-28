import { useVehicles } from '@/hooks/vehicles-context'

/** Faixa exibida enquanto o catálogo usa dados de demonstração. */
export function DemoBanner() {
  const { source } = useVehicles()
  if (source !== 'demo') return null
  return (
    <div className="relative z-50 bg-brand-soft px-4 py-2 text-center text-xs font-medium text-balance text-brand-hover sm:text-[13px]">
      <strong className="font-semibold">Catálogo de exemplo:</strong> veículos e fotos ilustrativos, fora do estoque da SAAB.
    </div>
  )
}
