import type { Vehicle, VehicleInput } from '../../types/vehicle'

/** Linha da tabela `public.vehicles` (snake_case). */
export interface VehicleRow {
  id: string
  slug: string
  brand: string
  model: string
  version: string
  year_manufacture: number
  year_model: number
  mileage: number
  transmission: Vehicle['transmission']
  fuel: Vehicle['fuel']
  color: string
  body_type: Vehicle['bodyType']
  price: number | string | null
  description: string
  options: string[] | null
  images: Vehicle['images'] | null
  status: Vehicle['status']
  featured: boolean
  published: boolean
  created_at: string
}

export const VEHICLE_COLUMNS =
  'id,slug,brand,model,version,year_manufacture,year_model,mileage,transmission,fuel,color,body_type,price,description,options,images,status,featured,published,created_at'

export function fromRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    version: row.version,
    yearManufacture: row.year_manufacture,
    yearModel: row.year_model,
    mileage: row.mileage,
    transmission: row.transmission,
    fuel: row.fuel,
    color: row.color,
    bodyType: row.body_type,
    price: row.price == null ? null : Number(row.price),
    description: row.description ?? '',
    options: row.options ?? [],
    images: row.images ?? [],
    status: row.status,
    featured: row.featured,
    published: row.published,
    isDemo: false,
    createdAt: row.created_at,
  }
}

export function toRow(v: VehicleInput): Omit<VehicleRow, 'id' | 'created_at'> {
  return {
    slug: v.slug,
    brand: v.brand.trim(),
    model: v.model.trim(),
    version: v.version.trim(),
    year_manufacture: v.yearManufacture,
    year_model: v.yearModel,
    mileage: v.mileage,
    transmission: v.transmission,
    fuel: v.fuel,
    color: v.color.trim(),
    body_type: v.bodyType,
    price: v.price,
    description: v.description.trim(),
    options: v.options.map((o) => o.trim()).filter(Boolean),
    images: v.images,
    status: v.status,
    featured: v.featured,
    published: v.published,
  }
}
