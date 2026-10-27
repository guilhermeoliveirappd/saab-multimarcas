import { useId } from 'react'
import type { Transmission } from '@/types/vehicle'
import { TRANSMISSION_LABELS, formatPriceShort } from '@/lib/format'
import type { FilterOptions, InventoryFilters } from '@/lib/inventory-filters'

const PRICE_STEPS = [30_000, 40_000, 50_000, 60_000, 70_000, 80_000, 100_000, 120_000, 140_000, 160_000, 180_000, 200_000, 250_000, 300_000, 400_000, 500_000]

interface Props {
  filters: InventoryFilters
  options: FilterOptions
  onChange: (patch: Partial<InventoryFilters>) => void
}

const withCurrent = (steps: number[], current: number | null) =>
  current !== null && !steps.includes(current) ? [...steps, current].sort((a, b) => a - b) : steps

export function FilterPanel({ filters, options, onChange }: Props) {
  const id = useId()
  const f = filters
  const num = (value: string) => (value === '' ? null : Number(value))

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${id}-brand`} className="field-label">
          Marca
        </label>
        <select id={`${id}-brand`} className="field" value={f.brand} onChange={(e) => onChange({ brand: e.target.value, model: '' })}>
          <option value="">Todas</option>
          {options.brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-model`} className="field-label">
          Modelo
        </label>
        <select id={`${id}-model`} className="field" value={f.model} onChange={(e) => onChange({ model: e.target.value })}>
          <option value="">Todos</option>
          {options.models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="field-label">Ano do modelo</legend>
        <div className="grid grid-cols-2 gap-2">
          <select aria-label="Ano mínimo" className="field" value={f.yearMin ?? ''} onChange={(e) => onChange({ yearMin: num(e.target.value) })}>
            <option value="">De</option>
            {[...options.years].reverse().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select aria-label="Ano máximo" className="field" value={f.yearMax ?? ''} onChange={(e) => onChange({ yearMax: num(e.target.value) })}>
            <option value="">Até</option>
            {options.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Câmbio</legend>
        <div className="flex flex-wrap gap-2">
          {(['', ...options.transmissions] as Array<Transmission | ''>).map((t) => {
            const active = f.transmission === t
            return (
              <button
                key={t || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ transmission: t })}
                className={`h-10 rounded-full px-4 text-sm font-medium ring-1 transition-colors ${
                  active ? 'bg-ink-950 text-white ring-ink-950' : 'bg-white text-ink-700 ring-ink-200 hover:ring-ink-400'
                }`}
              >
                {t ? TRANSMISSION_LABELS[t] : 'Todos'}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Faixa de preço</legend>
        <div className="grid grid-cols-2 gap-2">
          <select aria-label="Preço mínimo" className="field" value={f.priceMin ?? ''} onChange={(e) => onChange({ priceMin: num(e.target.value) })}>
            <option value="">Mínimo</option>
            {withCurrent(PRICE_STEPS, f.priceMin).map((p) => (
              <option key={p} value={p}>
                {formatPriceShort(p)}
              </option>
            ))}
          </select>
          <select aria-label="Preço máximo" className="field" value={f.priceMax ?? ''} onChange={(e) => onChange({ priceMax: num(e.target.value) })}>
            <option value="">Máximo</option>
            {withCurrent(PRICE_STEPS, f.priceMax).map((p) => (
              <option key={p} value={p}>
                {formatPriceShort(p)}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
    </div>
  )
}
