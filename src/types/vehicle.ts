export const TRANSMISSIONS = ['manual', 'automatico', 'cvt', 'automatizado'] as const
export type Transmission = (typeof TRANSMISSIONS)[number]

export const FUELS = ['flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico'] as const
export type Fuel = (typeof FUELS)[number]

export const VEHICLE_STATUSES = ['disponivel', 'reservado', 'vendido'] as const
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number]

export const BODY_TYPES = ['hatch', 'sedan', 'suv', 'picape', 'outro'] as const
export type BodyType = (typeof BODY_TYPES)[number]

/** Créditos exigidos por licenças Creative Commons (fotos de terceiros). */
export interface ImageCredit {
  author: string | null
  license: string | null
  /** Página de origem com autor e licença completos */
  sourceUrl: string
}

export interface VehicleImage {
  url: string
  alt?: string
  /** Versões responsivas (atributo srcset) */
  srcSet?: string
  /** Fotos alternativas tentadas em ordem se `url` falhar (ex.: banner) */
  alternates?: VehicleImage[]
  /** Imagem local exibida se `url` (e alternativas) falharem ao carregar */
  fallbackUrl?: string
  credit?: ImageCredit
}

export interface Vehicle {
  id: string
  slug: string
  brand: string
  model: string
  version: string
  yearManufacture: number
  yearModel: number
  mileage: number
  transmission: Transmission
  fuel: Fuel
  color: string
  bodyType: BodyType
  /** `null` = preço sob consulta */
  price: number | null
  description: string
  options: string[]
  images: VehicleImage[]
  status: VehicleStatus
  featured: boolean
  published: boolean
  /** Verdadeiro para dados fictícios de demonstração */
  isDemo: boolean
  createdAt: string
}

/** Dados editáveis pelo painel administrativo */
export type VehicleInput = Omit<Vehicle, 'id' | 'isDemo' | 'createdAt'>
