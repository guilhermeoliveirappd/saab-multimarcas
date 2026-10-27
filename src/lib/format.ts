import type { Fuel, Transmission, Vehicle, VehicleStatus } from '../types/vehicle'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const integer = new Intl.NumberFormat('pt-BR')

export const formatPrice = (price: number | null): string => (price == null ? 'Sob consulta' : currency.format(price))

export const formatMileage = (km: number): string => (km === 0 ? '0 km' : `${integer.format(km)} km`)

export const formatYears = (v: Pick<Vehicle, 'yearManufacture' | 'yearModel'>): string =>
  `${v.yearManufacture}/${v.yearModel}`

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  manual: 'Manual',
  automatico: 'Automático',
  cvt: 'CVT',
  automatizado: 'Automatizado',
}

export const FUEL_LABELS: Record<Fuel, string> = {
  flex: 'Flex',
  gasolina: 'Gasolina',
  etanol: 'Etanol',
  diesel: 'Diesel',
  hibrido: 'Híbrido',
  eletrico: 'Elétrico',
}

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

export const vehicleTitle = (v: Pick<Vehicle, 'brand' | 'model'>): string => `${v.brand} ${v.model}`

export const vehicleFullName = (v: Pick<Vehicle, 'brand' | 'model' | 'version' | 'yearManufacture' | 'yearModel'>): string =>
  `${v.brand} ${v.model} ${v.version} ${formatYears(v)}`

/** Formata números compactos para rótulos de faixa de preço (ex.: R$ 80 mil) */
export const formatPriceShort = (value: number): string => {
  if (value >= 1_000_000) return `R$ ${integer.format(Math.round(value / 100_000) / 10)} mi`
  return `R$ ${integer.format(Math.round(value / 1000))} mil`
}
