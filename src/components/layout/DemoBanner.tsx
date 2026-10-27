import { useVehicles } from '@/hooks/vehicles-context'

/** Faixa exibida enquanto o catálogo usa dados de demonstração. */
export function DemoBanner() {
  const { source } = useVehicles()
  if (source !== 'demo') return null
  return (
    <div className="relative z-50 bg-amber-300 px-4 py-2 text-center text-xs font-medium text-ink-950 sm:text-[13px]">
      <strong className="font-semibold">Versão de demonstração.</strong> Os veículos exibidos são fictícios e não representam o estoque real da SAAB
      Multimarcas.
    </div>
  )
}
