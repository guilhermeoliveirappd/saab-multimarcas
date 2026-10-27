import { createContext, useContext } from 'react'
import type { Vehicle } from '@/types/vehicle'

export interface VehiclesState {
  status: 'loading' | 'ready' | 'error'
  vehicles: Vehicle[]
  error: string | null
  source: 'demo' | 'supabase'
  reload: () => void
}

export const VehiclesContext = createContext<VehiclesState | null>(null)

export function useVehicles(): VehiclesState {
  const ctx = useContext(VehiclesContext)
  if (!ctx) throw new Error('useVehicles deve ser usado dentro de <VehiclesProvider>')
  return ctx
}
