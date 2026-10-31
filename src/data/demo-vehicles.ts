import type { BodyType, Vehicle } from '../types/vehicle'
import { STOCK_GALLERIES, commonsImage, galleryFiles } from './stock-photos'

/**
 * ⚠️ VEÍCULOS DE EXEMPLO — NÃO SÃO O ESTOQUE DA ROBCAR.
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
    slug: 'bmw-320i-m-sport-2023',
    brand: 'BMW',
    model: '320i',
    version: 'M Sport 2.0 Turbo',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 18200,
    transmission: 'automatico',
    fuel: 'flex',
    color: 'Azul',
    bodyType: 'sedan',
    price: 289900,
    options: ['Bancos em couro', 'Painel digital', 'Faróis em LED', 'Modos de condução', 'Câmera de ré'],
    featured: true,
  },
  {
    slug: 'kia-sportage-signature-2023',
    brand: 'Kia',
    model: 'Sportage',
    version: 'Signature 1.6 Turbo',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 24600,
    transmission: 'automatizado',
    fuel: 'gasolina',
    color: 'Branco',
    bodyType: 'suv',
    price: 199900,
    options: ['Teto solar panorâmico', 'Painel curvo duplo', 'Bancos com ventilação', 'Câmera 360°', 'Piloto automático adaptativo'],
    featured: true,
  },
  {
    slug: 'tesla-model-y-long-range-2025',
    brand: 'Tesla',
    model: 'Model Y',
    version: 'Long Range AWD',
    yearManufacture: 2025,
    yearModel: 2025,
    mileage: 6400,
    transmission: 'automatico',
    fuel: 'eletrico',
    color: 'Cinza',
    bodyType: 'suv',
    price: 389900,
    options: ['Tração integral', 'Teto de vidro', 'Central de 15,4"', 'Câmeras 360°', 'Porta-malas elétrico'],
    featured: true,
  },
  {
    slug: 'mercedes-benz-c300-amg-line-2023',
    brand: 'Mercedes-Benz',
    model: 'C 300',
    version: 'AMG Line 2.0 Turbo',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 21500,
    transmission: 'automatico',
    fuel: 'gasolina',
    color: 'Preto',
    bodyType: 'sedan',
    price: 329900,
    options: ['Bancos em couro', 'Teto solar', 'Som Burmester', 'Iluminação ambiente', 'Faróis Digital Light'],
    featured: true,
  },
  {
    slug: 'hyundai-elantra-2-0-2022',
    brand: 'Hyundai',
    model: 'Elantra',
    version: '2.0 Smartstream',
    yearManufacture: 2022,
    yearModel: 2022,
    mileage: 38900,
    transmission: 'cvt',
    fuel: 'gasolina',
    color: 'Branco',
    bodyType: 'sedan',
    price: 139900,
    options: ['Painel digital', 'Central multimídia', 'Câmera de ré', 'Alerta de ponto cego'],
    featured: true,
  },
  {
    slug: 'kia-carnival-hi-limousine-2023',
    brand: 'Kia',
    model: 'Carnival',
    version: 'Hi-Limousine 3.5 V6',
    yearManufacture: 2023,
    yearModel: 2023,
    mileage: 15700,
    transmission: 'automatico',
    fuel: 'gasolina',
    color: 'Bege',
    bodyType: 'outro',
    price: 449900,
    options: ['Teto elevado', 'Poltronas reclináveis', 'Tela traseira', 'Portas laterais elétricas', 'Iluminação ambiente'],
    featured: true,
  },
  {
    slug: 'hyundai-tucson-inspiration-2023',
    brand: 'Hyundai',
    model: 'Tucson',
    version: 'Inspiration 1.6 Turbo',
    yearManufacture: 2022,
    yearModel: 2023,
    mileage: 29800,
    transmission: 'automatizado',
    fuel: 'gasolina',
    color: 'Cinza',
    bodyType: 'suv',
    price: 179900,
    options: ['Teto solar panorâmico', 'Painel digital', 'Câmera de ré', 'Bancos em couro'],
    status: 'reservado',
  },
]



/** Galeria do veículo: só fotos do mesmo carro (ver stock-photos.ts). */
function galleryFor(slug: string, name: string) {
  const fallbackUrl = `/demo/vehicles/${slug}-1.svg`
  const set = STOCK_GALLERIES[slug]
  if (!set) return [{ url: fallbackUrl, alt: name }]
  return galleryFiles(set).map((file, i) =>
    commonsImage(file, { author: set.author, license: set.license }, { alt: `${name} — foto ${i + 1} de ${set.numbers.length}`, fallbackUrl }),
  )
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
    images: galleryFor(seed.slug, name),
    status: seed.status ?? 'disponivel',
    featured: seed.featured ?? false,
    published: true,
    isDemo: true,
    createdAt: new Date(Date.UTC(2026, 9, 20 - index)).toISOString(),
  }
})

/** Usado pelo gerador de imagens de demonstração. */
export const demoImageSpecs = seeds.map((s) => ({ slug: s.slug, bodyType: s.bodyType, color: s.color }))
