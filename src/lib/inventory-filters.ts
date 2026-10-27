import type { Transmission, Vehicle } from '../types/vehicle'
import { TRANSMISSIONS } from '../types/vehicle'
import { formatPriceShort } from './format'
import { normalizeText } from './slug'

export const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
  { value: 'ano-desc', label: 'Ano: mais novo' },
  { value: 'ano-asc', label: 'Ano: mais antigo' },
] as const
export type SortKey = (typeof SORT_OPTIONS)[number]['value']

export interface InventoryFilters {
  q: string
  brand: string
  model: string
  yearMin: number | null
  yearMax: number | null
  transmission: Transmission | ''
  priceMin: number | null
  priceMax: number | null
  sort: SortKey
}

export const EMPTY_FILTERS: InventoryFilters = {
  q: '',
  brand: '',
  model: '',
  yearMin: null,
  yearMax: null,
  transmission: '',
  priceMin: null,
  priceMax: null,
  sort: 'recentes',
}

/** Nomes dos parâmetros na URL (em português, para URLs amigáveis) */
export const PARAM = {
  q: 'busca',
  brand: 'marca',
  model: 'modelo',
  yearMin: 'anoMin',
  yearMax: 'anoMax',
  transmission: 'cambio',
  priceMin: 'precoMin',
  priceMax: 'precoMax',
  sort: 'ordem',
  page: 'pagina',
} as const

const toInt = (value: string | null): number | null => {
  if (!value) return null
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export function parseFilters(params: URLSearchParams): InventoryFilters {
  const transmission = params.get(PARAM.transmission) ?? ''
  const sort = params.get(PARAM.sort) ?? ''
  return {
    q: params.get(PARAM.q)?.trim() ?? '',
    brand: params.get(PARAM.brand) ?? '',
    model: params.get(PARAM.model) ?? '',
    yearMin: toInt(params.get(PARAM.yearMin)),
    yearMax: toInt(params.get(PARAM.yearMax)),
    transmission: (TRANSMISSIONS as readonly string[]).includes(transmission) ? (transmission as Transmission) : '',
    priceMin: toInt(params.get(PARAM.priceMin)),
    priceMax: toInt(params.get(PARAM.priceMax)),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'recentes',
  }
}

export function filtersToParams(filters: Partial<InventoryFilters>): URLSearchParams {
  const params = new URLSearchParams()
  const set = (key: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined && value !== '') params.set(key, String(value))
  }
  set(PARAM.q, filters.q)
  set(PARAM.brand, filters.brand)
  set(PARAM.model, filters.model)
  set(PARAM.yearMin, filters.yearMin)
  set(PARAM.yearMax, filters.yearMax)
  set(PARAM.transmission, filters.transmission)
  set(PARAM.priceMin, filters.priceMin)
  set(PARAM.priceMax, filters.priceMax)
  if (filters.sort && filters.sort !== 'recentes') params.set(PARAM.sort, filters.sort)
  return params
}

export const countActiveFilters = (f: InventoryFilters): number =>
  [f.q, f.brand, f.model, f.yearMin, f.yearMax, f.transmission, f.priceMin, f.priceMax].filter(
    (v) => v !== '' && v !== null,
  ).length

/** Veículos visíveis no catálogo público (vendidos ficam fora da listagem). */
export const isListed = (v: Vehicle): boolean => v.published && v.status !== 'vendido'

const sameText = (a: string, b: string) => normalizeText(a) === normalizeText(b)

function matchesQuery(v: Vehicle, q: string): boolean {
  const tokens = normalizeText(q).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const haystack = normalizeText(
    [v.brand, v.model, v.version, v.yearManufacture, v.yearModel, v.color, v.fuel, v.transmission].join(' '),
  )
  return tokens.every((t) => haystack.includes(t))
}

const compareBy = (sort: SortKey) => (a: Vehicle, b: Vehicle): number => {
  // Preço "sob consulta" sempre ao final na ordenação por preço
  const price = (v: Vehicle, dir: 1 | -1) => (v.price == null ? Number.POSITIVE_INFINITY : v.price * dir)
  switch (sort) {
    case 'preco-asc':
      return price(a, 1) - price(b, 1)
    case 'preco-desc':
      return price(a, -1) - price(b, -1)
    case 'ano-desc':
      return b.yearModel - a.yearModel || a.mileage - b.mileage
    case 'ano-asc':
      return a.yearModel - b.yearModel || a.mileage - b.mileage
    case 'recentes':
    default:
      return b.createdAt.localeCompare(a.createdAt)
  }
}

export function applyFilters(vehicles: Vehicle[], f: InventoryFilters): Vehicle[] {
  return vehicles
    .filter((v) => {
      if (f.brand && !sameText(v.brand, f.brand)) return false
      if (f.model && !sameText(v.model, f.model)) return false
      if (f.yearMin !== null && v.yearModel < f.yearMin) return false
      if (f.yearMax !== null && v.yearModel > f.yearMax) return false
      if (f.transmission && v.transmission !== f.transmission) return false
      if (f.priceMin !== null && (v.price == null || v.price < f.priceMin)) return false
      if (f.priceMax !== null && (v.price == null || v.price > f.priceMax)) return false
      return matchesQuery(v, f.q)
    })
    .sort(compareBy(f.sort))
}

const uniqueSorted = <T extends string | number>(values: T[], numericDesc = false): T[] => {
  const unique = [...new Set(values)]
  return numericDesc
    ? unique.sort((a, b) => Number(b) - Number(a))
    : unique.sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'))
}

export interface FilterOptions {
  brands: string[]
  models: string[]
  years: number[]
  transmissions: Transmission[]
}

/** Opções derivadas dos veículos cadastrados. Modelos respeitam a marca escolhida. */
export function getFilterOptions(vehicles: Vehicle[], brand = ''): FilterOptions {
  return {
    brands: uniqueSorted(vehicles.map((v) => v.brand)),
    models: uniqueSorted(vehicles.filter((v) => !brand || sameText(v.brand, brand)).map((v) => v.model)),
    years: uniqueSorted(vehicles.map((v) => v.yearModel), true),
    transmissions: TRANSMISSIONS.filter((t) => vehicles.some((v) => v.transmission === t)),
  }
}

export interface PriceRange {
  id: string
  label: string
  min: number | null
  max: number | null
}

const PRICE_BREAKS = [50_000, 80_000, 120_000, 160_000, 200_000, 300_000]

/** Faixas de preço exibidas apenas quando há veículos dentro delas. */
export function getPriceRanges(vehicles: Vehicle[]): PriceRange[] {
  const prices = vehicles.map((v) => v.price).filter((p): p is number => p != null)
  const bounds: Array<[number | null, number | null]> = []
  PRICE_BREAKS.forEach((limit, i) => bounds.push([i === 0 ? null : PRICE_BREAKS[i - 1], limit]))
  bounds.push([PRICE_BREAKS[PRICE_BREAKS.length - 1], null])

  return bounds
    .filter(([min, max]) => prices.some((p) => (min === null || p >= min) && (max === null || p <= max)))
    .map(([min, max]) => ({
      id: `${min ?? 0}-${max ?? 'max'}`,
      min,
      max,
      label:
        min === null
          ? `Até ${formatPriceShort(max as number)}`
          : max === null
            ? `Acima de ${formatPriceShort(min)}`
            : `${formatPriceShort(min)} a ${formatPriceShort(max)}`,
    }))
}

/** Veículos relacionados: mesma categoria/marca e faixa de preço próxima. */
export function getRelatedVehicles(current: Vehicle, vehicles: Vehicle[], limit = 3): Vehicle[] {
  const score = (v: Vehicle) => {
    let s = 0
    if (v.bodyType === current.bodyType) s += 3
    if (v.brand === current.brand) s += 2
    if (v.price != null && current.price != null) {
      const diff = Math.abs(v.price - current.price) / current.price
      if (diff < 0.25) s += 2
      else if (diff < 0.5) s += 1
    }
    return s
  }
  return vehicles
    .filter((v) => v.id !== current.id && isListed(v))
    .map((v) => ({ v, s: score(v) }))
    .sort((a, b) => b.s - a.s || b.v.createdAt.localeCompare(a.v.createdAt))
    .slice(0, limit)
    .map(({ v }) => v)
}
