import { useId, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { content } from '@/config/content'
import { useVehicles } from '@/hooks/vehicles-context'
import { trackEvent } from '@/lib/analytics'
import { filtersToParams, getFilterOptions, getPriceRanges, isListed } from '@/lib/inventory-filters'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

/** Busca rápida da home: opções derivadas do estoque, envia para /estoque com filtros. */
export function QuickSearch({ className }: { className?: string }) {
  const { vehicles, status } = useVehicles()
  const navigate = useNavigate()
  const id = useId()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [rangeId, setRangeId] = useState('')

  const listed = useMemo(() => vehicles.filter(isListed), [vehicles])
  const options = useMemo(() => getFilterOptions(listed, brand), [listed, brand])
  const ranges = useMemo(() => getPriceRanges(listed), [listed])
  const loading = status === 'loading'

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const range = ranges.find((r) => r.id === rangeId)
    trackEvent({ name: 'quick_search', params: { brand: brand || undefined, model: model || undefined, price_range: range?.label } })
    const params = filtersToParams({ brand, model, priceMin: range?.min ?? null, priceMax: range?.max ?? null })
    navigate({ pathname: '/estoque', search: params.toString() })
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Busca rápida de veículos"
      className={cn('rounded-[1.5rem] bg-white p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,.45)] ring-1 ring-ink-100 sm:p-5 lg:p-6', className)}
    >
      <div className="mb-5 flex flex-col items-center gap-1 text-center">
        <h2 className="font-display text-lg font-bold text-ink-950">{content.quickSearch.title}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor={`${id}-brand`} className="field-label text-center">
            Marca
          </label>
          <select
            id={`${id}-brand`}
            className="field"
            value={brand}
            disabled={loading}
            onChange={(e) => {
              setBrand(e.target.value)
              setModel('')
            }}
          >
            <option value="">Todas as marcas</option>
            {options.brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-model`} className="field-label text-center">
            Modelo
          </label>
          <select id={`${id}-model`} className="field" value={model} disabled={loading} onChange={(e) => setModel(e.target.value)}>
            <option value="">Todos os modelos</option>
            {options.models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-price`} className="field-label text-center">
            Faixa de preço
          </label>
          <select id={`${id}-price`} className="field" value={rangeId} disabled={loading} onChange={(e) => setRangeId(e.target.value)}>
            <option value="">Qualquer valor</option>
            {ranges.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary" size="lg" className="h-12 w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
          <Search size={18} aria-hidden="true" />
          {content.quickSearch.button}
        </Button>
      </div>
    </form>
  )
}
