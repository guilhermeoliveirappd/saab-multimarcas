import type { Vehicle } from '@/types/vehicle'

/** Contrato da fonte de dados pública do catálogo. */
export interface VehicleRepository {
  readonly source: 'demo' | 'supabase'
  /** Veículos publicados (inclui vendidos — a listagem decide o que exibir) */
  listPublished(): Promise<Vehicle[]>
  getBySlug(slug: string): Promise<Vehicle | null>
}
