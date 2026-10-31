import { demoVehicles } from '@/data/demo-vehicles'
import { fromStock, robcarStock } from '@/data/robcar-stock'
import type { Vehicle } from '@/types/vehicle'
import type { VehicleRepository } from './types'

/**
 * Fonte local (sem Supabase): o ESTOQUE REAL da Robcar (src/data/robcar-stock.ts)
 * quando houver ao menos um veículo cadastrado; caso contrário, os veículos de
 * exemplo da apresentação privada. Nunca mistura os dois.
 */
export const localVehicles: Vehicle[] = robcarStock.length > 0 ? robcarStock.map(fromStock) : demoVehicles

export const demoRepository: VehicleRepository = {
  source: 'demo',
  async listPublished() {
    return localVehicles.filter((v) => v.published)
  },
  async getBySlug(slug) {
    return localVehicles.find((v) => v.slug === slug && v.published) ?? null
  },
}
