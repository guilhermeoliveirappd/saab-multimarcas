import { getSupabase } from '@/lib/supabase'
import { VEHICLE_COLUMNS, fromRow, type VehicleRow } from './mapper'
import type { VehicleRepository } from './types'

/** Leitura pública via Supabase. A RLS só expõe veículos `published = true`. */
export const supabaseRepository: VehicleRepository = {
  source: 'supabase',
  async listPublished() {
    const { data, error } = await getSupabase()
      .from('vehicles')
      .select(VEHICLE_COLUMNS)
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Falha ao carregar veículos: ${error.message}`)
    return (data as VehicleRow[]).map(fromRow)
  },
  async getBySlug(slug) {
    const { data, error } = await getSupabase()
      .from('vehicles')
      .select(VEHICLE_COLUMNS)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (error) throw new Error(`Falha ao carregar veículo: ${error.message}`)
    return data ? fromRow(data as VehicleRow) : null
  },
}
