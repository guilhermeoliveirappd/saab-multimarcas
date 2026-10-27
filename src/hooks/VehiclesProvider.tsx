import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dataSource, getVehicleRepository } from '@/services/vehicles'
import type { Vehicle } from '@/types/vehicle'
import { VehiclesContext, type VehiclesState } from './vehicles-context'

/** Carrega o catálogo publicado uma única vez e compartilha entre as páginas. */
export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [status, setStatus] = useState<VehiclesState['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    getVehicleRepository()
      .then((repo) => repo.listPublished())
      .then((list) => {
        if (cancelled) return
        setVehicles(list)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        console.error(err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar veículos.')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setStatus('loading')
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo<VehiclesState>(
    () => ({ status, vehicles, error, source: dataSource, reload }),
    [status, vehicles, error, reload],
  )
  return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>
}
