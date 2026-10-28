import { fixtureVehicles as demoVehicles } from '@/test/fixtures'
import {
  EMPTY_FILTERS,
  applyFilters,
  countActiveFilters,
  filtersToParams,
  getFilterOptions,
  getPriceRanges,
  getRelatedVehicles,
  isListed,
  parseFilters,
} from './inventory-filters'

const listed = demoVehicles.filter(isListed)
const run = (patch: Partial<typeof EMPTY_FILTERS>) => applyFilters(listed, { ...EMPTY_FILTERS, ...patch })

describe('inventory filters', () => {
  it('hides sold and unpublished vehicles from the listing', () => {
    expect(demoVehicles.some((v) => v.status === 'vendido')).toBe(true)
    expect(listed.every((v) => v.status !== 'vendido' && v.published)).toBe(true)
  })

  it('filters by brand (case and accent insensitive) and model', () => {
    expect(run({ brand: 'toyota' }).map((v) => v.model).sort()).toEqual(['Corolla', 'Hilux'])
    expect(run({ brand: 'Toyota', model: 'Hilux' })).toHaveLength(1)
  })

  it('filters by year range, transmission and price range (inclusive)', () => {
    expect(run({ yearMin: 2023 }).every((v) => v.yearModel >= 2023)).toBe(true)
    expect(run({ yearMax: 2020 }).every((v) => v.yearModel <= 2020)).toBe(true)
    expect(run({ transmission: 'manual' }).map((v) => v.slug)).toEqual(['fiat-argo-drive-2021'])
    const mid = run({ priceMin: 90_000, priceMax: 130_000 })
    expect(mid.length).toBeGreaterThan(0)
    expect(mid.every((v) => v.price! >= 90_000 && v.price! <= 130_000)).toBe(true)
  })

  it('performs multi-token text search across brand, model, version and year', () => {
    expect(run({ q: 'civic 2021' }).map((v) => v.slug)).toEqual(['honda-civic-exl-2021'])
    expect(run({ q: 'híbrido inexistente' })).toHaveLength(0)
  })

  it('sorts by price and year', () => {
    const asc = run({ sort: 'preco-asc' }).map((v) => v.price!)
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    const desc = run({ sort: 'ano-desc' }).map((v) => v.yearModel)
    expect(desc).toEqual([...desc].sort((a, b) => b - a))
  })

  it('round-trips filters through URL params and ignores invalid values', () => {
    const f = { ...EMPTY_FILTERS, brand: 'Jeep', yearMin: 2020, priceMax: 150_000, transmission: 'automatico' as const, sort: 'preco-desc' as const }
    expect(parseFilters(filtersToParams(f))).toEqual(f)
    const bad = parseFilters(new URLSearchParams('cambio=foguete&ordem=x&anoMin=abc'))
    expect(bad).toEqual(EMPTY_FILTERS)
    expect(countActiveFilters(f)).toBe(4)
  })

  it('derives options from data, with models scoped to the brand', () => {
    const opts = getFilterOptions(listed, 'Volkswagen')
    expect(opts.brands).toContain('Volkswagen')
    expect(opts.models.sort()).toEqual(['Nivus', 'T-Cross'])
    expect(opts.years[0]).toBeGreaterThanOrEqual(opts.years[opts.years.length - 1])
  })

  it('only offers price ranges that contain vehicles', () => {
    const ranges = getPriceRanges(listed)
    expect(ranges.length).toBeGreaterThan(0)
    for (const r of ranges) {
      expect(listed.some((v) => v.price != null && (r.min === null || v.price >= r.min) && (r.max === null || v.price <= r.max))).toBe(true)
    }
  })

  it('returns related vehicles excluding the current one', () => {
    const civic = listed.find((v) => v.slug === 'honda-civic-exl-2021')!
    const related = getRelatedVehicles(civic, demoVehicles)
    expect(related).toHaveLength(3)
    expect(related.some((v) => v.id === civic.id)).toBe(false)
    expect(related.every(isListed)).toBe(true)
  })
})
