import { demoVehicles } from '@/data/demo-vehicles'
import type { VehicleRepository } from './types'

/** Fonte somente-leitura com veículos fictícios (sem persistência). */
export const demoRepository: VehicleRepository = {
  source: 'demo',
  async listPublished() {
    return demoVehicles.filter((v) => v.published)
  },
  async getBySlug(slug) {
    return demoVehicles.find((v) => v.slug === slug && v.published) ?? null
  },
}
