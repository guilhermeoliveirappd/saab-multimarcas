import type { Vehicle } from '@/types/vehicle'

/** Veículos fixos para testar a lógica de filtros, independentes do catálogo. */
const base = (o: Partial<Vehicle> & Pick<Vehicle, 'id' | 'slug' | 'brand' | 'model'>): Vehicle => ({
  version: 'Base',
  yearManufacture: 2021,
  yearModel: 2021,
  mileage: 30000,
  transmission: 'automatico',
  fuel: 'flex',
  color: 'Prata',
  bodyType: 'sedan',
  price: 100000,
  description: '',
  options: [],
  images: [],
  status: 'disponivel',
  featured: false,
  published: true,
  isDemo: true,
  createdAt: '2026-10-01T00:00:00.000Z',
  ...o,
})

export const fixtureVehicles: Vehicle[] = [
  base({ id: '1', slug: 'honda-civic-exl-2021', brand: 'Honda', model: 'Civic', version: 'EXL 2.0 CVT', transmission: 'cvt', price: 129900, createdAt: '2026-10-10T00:00:00.000Z' }),
  base({ id: '2', slug: 'toyota-corolla-xei-2022', brand: 'Toyota', model: 'Corolla', version: 'XEi', yearModel: 2022, price: 142900, createdAt: '2026-10-09T00:00:00.000Z' }),
  base({ id: '3', slug: 'toyota-hilux-srv-2020', brand: 'Toyota', model: 'Hilux', version: 'SRV', yearModel: 2020, price: 219900, bodyType: 'picape', fuel: 'diesel' }),
  base({ id: '4', slug: 'fiat-argo-drive-2021', brand: 'Fiat', model: 'Argo', version: 'Drive', transmission: 'manual', price: 62900, bodyType: 'hatch' }),
  base({ id: '5', slug: 'volkswagen-t-cross-2023', brand: 'Volkswagen', model: 'T-Cross', yearModel: 2023, price: 149900, bodyType: 'suv' }),
  base({ id: '6', slug: 'volkswagen-nivus-2022', brand: 'Volkswagen', model: 'Nivus', yearModel: 2022, price: 118900, bodyType: 'suv' }),
  base({ id: '7', slug: 'hyundai-hb20-2023', brand: 'Hyundai', model: 'HB20', yearModel: 2023, price: 92900, bodyType: 'hatch' }),
  base({ id: '8', slug: 'honda-city-2022', brand: 'Honda', model: 'City', yearModel: 2022, price: 109900, status: 'reservado' }),
  base({ id: '9', slug: 'chevrolet-tracker-2021', brand: 'Chevrolet', model: 'Tracker', price: 124900, status: 'vendido', bodyType: 'suv' }),
  base({ id: '10', slug: 'jeep-renegade-2020', brand: 'Jeep', model: 'Renegade', yearModel: 2020, price: 89900, published: false, bodyType: 'suv' }),
]
