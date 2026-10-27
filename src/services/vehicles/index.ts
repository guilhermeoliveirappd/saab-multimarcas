import { isSupabaseConfigured } from '@/config/env'
import type { VehicleRepository } from './types'

export type { VehicleRepository } from './types'

/**
 * Seleciona a fonte de dados: Supabase quando configurado, senão demonstração.
 * O import dinâmico evita carregar o SDK do Supabase no modo demonstração.
 */
let repoPromise: Promise<VehicleRepository> | null = null

export function getVehicleRepository(): Promise<VehicleRepository> {
  repoPromise ??= isSupabaseConfigured
    ? import('./supabase-repository').then((m) => m.supabaseRepository)
    : import('./demo-repository').then((m) => m.demoRepository)
  return repoPromise
}

export const dataSource: VehicleRepository['source'] = isSupabaseConfigured ? 'supabase' : 'demo'
