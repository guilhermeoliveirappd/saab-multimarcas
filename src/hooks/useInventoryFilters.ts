import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { trackEvent } from '@/lib/analytics'
import { EMPTY_FILTERS, PARAM, filtersToParams, parseFilters, type InventoryFilters } from '@/lib/inventory-filters'

/** Estado dos filtros do estoque sincronizado com a URL (?marca=...&ordem=...). */
export function useInventoryFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])
  const page = Math.max(1, Number.parseInt(params.get(PARAM.page) ?? '1', 10) || 1)

  const update = useCallback(
    (patch: Partial<InventoryFilters>) => {
      const next = { ...parseFilters(params), ...patch }
      for (const [key, value] of Object.entries(patch)) {
        trackEvent({ name: 'inventory_filter', params: { filter: key, value: value === null ? '' : String(value) } })
      }
      // Qualquer alteração de filtro volta para a primeira página
      setParams(filtersToParams(next), { replace: true, preventScrollReset: true })
    },
    [params, setParams],
  )

  const clear = useCallback(() => {
    trackEvent({ name: 'inventory_filter', params: { filter: 'clear', value: '' } })
    setParams(filtersToParams({ ...EMPTY_FILTERS, sort: parseFilters(params).sort }), { replace: true, preventScrollReset: true })
  }, [params, setParams])

  const setPage = useCallback(
    (n: number) => {
      const next = new URLSearchParams(params)
      if (n <= 1) next.delete(PARAM.page)
      else next.set(PARAM.page, String(n))
      setParams(next, { replace: true, preventScrollReset: true })
    },
    [params, setParams],
  )

  return { filters, page, update, clear, setPage }
}
