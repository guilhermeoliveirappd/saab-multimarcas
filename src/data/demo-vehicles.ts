import type { BodyType, Vehicle } from '../types/vehicle'
import { STOCK_PHOTOS, commonsImage } from './stock-photos'

/**
 * ⚠️ VEÍCULOS DE EXEMPLO — NÃO SÃO O ESTOQUE DA SAAB.
 *
 * Servem apenas para demonstrar o catálogo enquanto o Supabase/estoque oficial
 * não estiver disponível. Preços, quilometragens e opcionais são ilustrativos.
 * Fotos: imagens reais de referência do modelo (Wikimedia Commons, ver
 * `stock-photos.ts`), com ilustração local como fallback.
 */

interface DemoSeed {
  slug: string
  brand: string
  model: string
  version: string
  yearManufacture: number
  yearModel: number
  mileage: number
  transmission: Vehicle['transmission']
  fuel: Vehicle['fuel']
  color: string
  bodyType: BodyType
  price: number | null
  options: string[]
  status?: Vehicle['status']
  featured?: boolean
}

const seeds: DemoSeed[] = [
  {
    slug: 'honda-civic-exl-2021',
    brand: 'Honda',
    model: 'Civic',
    version: 'EXL 2.0 CVT',
    yearManufacture: 2020,
    yearModel: 2021,
    mileage: 38500,
    transmission: 'cvt',
    fuel: 'flex',
    color: 'Cinza',
    bodyType: 'sedan',
    price: 129900,
    options: ['Ar-condicionado digital', 'Bancos em couro', 'Central multimídia', 'Câmera de ré', 'Piloto automático', 'Rodas de liga leve'],
    featured: true,
  },
  {
    slug: 'toyota-corolla-xei-2022',
    brand: 'Toyota',
    model: 'Corolla',
    version: 'XEi 2.0 Dynamic Force',
    yearManufacture: 2022,
    yearModel: 2022,
    mileage: 27100,
    transmission: 'cvt',
    fuel: 'flex',
    color: 'Branco',
    bodyType: 'sedan',
    price: 142900,
    options: ['Ar-condicionado digital', 'Central multimídia', 'Sensor de estacionamento', 'Controle de estabilidade', 'Faróis em LED'],
    featured: true,
  },
  {
    slug: 'jeep-compass-longitude-2021',
    brand: 'Jeep',
    model: 'Compass',
    version: 'Longitude 1.3 T270',
    yearManufacture: 2021,
    yearModel: 2021,
    mileage: 46200,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Preto',
    bodyType: 'suv',
    price: 134500,
    options: ['Teto solar', 'Bancos em couro', 'Partida sem chave', 'Central multimídia', 'Câmera de ré', 'Rodas de liga leve'],
    featured: true,
  },
  {
    slug: 'volkswagen-t-cross-highline-2023',
    brand: 'Volkswagen',
    model: 'T-Cross',
    version: 'Highline 1.4 TSI',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 15800,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Azul',
    bodyType: 'suv',
    price: 149900,
    options: ['Painel digital', 'Teto solar panorâmico', 'Carregador por indução', 'Faróis em LED', 'Piloto automático adaptativo'],
    featured: true,
  },
  {
    slug: 'hyundai-hb20-platinum-2023',
    brand: 'Hyundai',
    model: 'HB20',
    version: 'Platinum 1.0 TGDI',
    yearManufacture: 2022,
    yearModel: 2023,
    mileage: 21400,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Vermelho',
    bodyType: 'hatch',
    price: 92900,
    options: ['Central multimídia', 'Câmera de ré', 'Partida sem chave', 'Rodas de liga leve'],
    featured: true,
  },
  {
    slug: 'chevrolet-onix-premier-2022',
    brand: 'Chevrolet',
    model: 'Onix',
    version: 'Premier 1.0 Turbo',
    yearManufacture: 2022,
    yearModel: 2022,
    mileage: 33900,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Prata',
    bodyType: 'hatch',
    price: 86500,
    options: ['Wi-Fi nativo', 'Central multimídia', 'Ar-condicionado digital', 'Sensor de estacionamento'],
  },
  {
    slug: 'toyota-hilux-srv-2020',
    brand: 'Toyota',
    model: 'Hilux',
    version: 'SRV 2.8 4x4 Diesel',
    yearManufacture: 2020,
    yearModel: 2020,
    mileage: 88700,
    transmission: 'automatico',
    fuel: 'diesel',
    color: 'Prata',
    bodyType: 'picape',
    price: 219900,
    options: ['Tração 4x4', 'Bancos em couro', 'Central multimídia', 'Câmera de ré', 'Controle de descida'],
    featured: true,
  },
  {
    slug: 'fiat-toro-volcano-2022',
    brand: 'Fiat',
    model: 'Toro',
    version: 'Volcano 2.0 4x4 Diesel',
    yearManufacture: 2021,
    yearModel: 2022,
    mileage: 54300,
    transmission: 'automatico',
    fuel: 'diesel',
    color: 'Branco',
    bodyType: 'picape',
    price: 154900,
    options: ['Tração 4x4', 'Central multimídia', 'Bancos em couro', 'Sensor de estacionamento'],
  },
  {
    slug: 'volkswagen-nivus-highline-2022',
    brand: 'Volkswagen',
    model: 'Nivus',
    version: 'Highline 1.0 TSI',
    yearManufacture: 2022,
    yearModel: 2022,
    mileage: 29800,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Cinza',
    bodyType: 'suv',
    price: 118900,
    options: ['Painel digital', 'Central multimídia', 'Faróis em LED', 'Piloto automático adaptativo'],
  },
  {
    slug: 'hyundai-creta-limited-2023',
    brand: 'Hyundai',
    model: 'Creta',
    version: 'Limited 1.0 TGDI',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 12600,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Preto',
    bodyType: 'suv',
    price: 136900,
    options: ['Câmera de ré', 'Central multimídia', 'Partida sem chave', 'Rodas de liga leve'],
    status: 'reservado',
  },
  {
    slug: 'bmw-320i-m-sport-2020',
    brand: 'BMW',
    model: '320i',
    version: 'M Sport 2.0 Turbo',
    yearManufacture: 2019,
    yearModel: 2020,
    mileage: 61200,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Azul',
    bodyType: 'sedan',
    price: 189900,
    options: ['Bancos em couro', 'Teto solar', 'Painel digital', 'Faróis em LED', 'Modos de condução'],
  },
  {
    slug: 'fiat-argo-drive-2021',
    brand: 'Fiat',
    model: 'Argo',
    version: 'Drive 1.0',
    yearManufacture: 2021,
    yearModel: 2021,
    mileage: 52300,
    transmission: 'manual',
    fuel: 'flex',
    color: 'Branco',
    bodyType: 'hatch',
    price: 62900,
    options: ['Central multimídia', 'Ar-condicionado', 'Direção elétrica'],
  },
  {
    slug: 'chevrolet-tracker-premier-2022',
    brand: 'Chevrolet',
    model: 'Tracker',
    version: 'Premier 1.2 Turbo',
    yearManufacture: 2022,
    yearModel: 2022,
    mileage: 31000,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Vermelho',
    bodyType: 'suv',
    price: 124900,
    options: ['Teto solar panorâmico', 'Wi-Fi nativo', 'Central multimídia'],
    status: 'vendido',
  },
]

function photoFor(slug: string, name: string) {
  const fallbackUrl = `/demo/vehicles/${slug}-1.svg`
  const ref = STOCK_PHOTOS[slug]
  if (!ref) return { url: fallbackUrl, alt: `Ilustração ${name}` }
  return commonsImage(ref.file, { author: ref.author, license: ref.license }, { alt: `${name}`, fallbackUrl })
}

export const demoVehicles: Vehicle[] = seeds.map((seed, index) => {
  const name = `${seed.brand} ${seed.model} ${seed.version}`
  return {
    id: `demo-${index + 1}`,
    slug: seed.slug,
    brand: seed.brand,
    model: seed.model,
    version: seed.version,
    yearManufacture: seed.yearManufacture,
    yearModel: seed.yearModel,
    mileage: seed.mileage,
    transmission: seed.transmission,
    fuel: seed.fuel,
    color: seed.color,
    bodyType: seed.bodyType,
    price: seed.price,
    description: `${name} ${seed.yearManufacture}/${seed.yearModel}, cor ${seed.color.toLowerCase()}, com ${seed.options.length} opcionais listados.`,
    options: seed.options,
    images: [photoFor(seed.slug, name)],
    status: seed.status ?? 'disponivel',
    featured: seed.featured ?? false,
    published: true,
    isDemo: true,
    createdAt: new Date(Date.UTC(2026, 9, 20 - index)).toISOString(),
  }
})

/** Usado pelo gerador de imagens de demonstração. */
export const demoImageSpecs = seeds.map((s) => ({ slug: s.slug, bodyType: s.bodyType, color: s.color }))
