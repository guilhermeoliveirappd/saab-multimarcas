import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useInventoryFilters } from '@/hooks/useInventoryFilters'
import { useVehicles } from '@/hooks/vehicles-context'
import { TRANSMISSION_LABELS, formatPriceShort } from '@/lib/format'
import { SORT_OPTIONS, applyFilters, countActiveFilters, getFilterOptions, isListed, type InventoryFilters, type SortKey } from '@/lib/inventory-filters'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { useSeo } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { FilterPanel } from '@/components/vehicles/FilterPanel'
import { VehicleCard, VehicleCardSkeleton, VehicleGrid } from '@/components/vehicles/VehicleCard'

const PAGE_SIZE = siteConfig.inventory.pageSize

function activeChips(f: InventoryFilters): { key: keyof InventoryFilters | 'year' | 'price'; label: string; patch: Partial<InventoryFilters> }[] {
  const chips: ReturnType<typeof activeChips> = []
  if (f.q) chips.push({ key: 'q', label: `“${f.q}”`, patch: { q: '' } })
  if (f.brand) chips.push({ key: 'brand', label: f.brand, patch: { brand: '', model: '' } })
  if (f.model) chips.push({ key: 'model', label: f.model, patch: { model: '' } })
  if (f.yearMin !== null || f.yearMax !== null)
    chips.push({ key: 'year', label: `Ano ${f.yearMin ?? '…'}–${f.yearMax ?? '…'}`, patch: { yearMin: null, yearMax: null } })
  if (f.transmission) chips.push({ key: 'transmission', label: TRANSMISSION_LABELS[f.transmission], patch: { transmission: '' } })
  if (f.priceMin !== null || f.priceMax !== null)
    chips.push({
      key: 'price',
      label: `${f.priceMin !== null ? formatPriceShort(f.priceMin) : 'R$ 0'} – ${f.priceMax !== null ? formatPriceShort(f.priceMax) : 'sem limite'}`,
      patch: { priceMin: null, priceMax: null },
    })
  return chips
}

export default function InventoryPage() {
  useSeo({ ...STATIC_PAGES['/estoque'], path: '/estoque' })
  const { vehicles, status, error, reload } = useVehicles()
  const { filters, page, update, clear, setPage } = useInventoryFilters()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Busca textual com debounce, mantendo a URL como fonte da verdade
  const [query, setQuery] = useState(filters.q)
  const [urlQuery, setUrlQuery] = useState(filters.q)
  if (urlQuery !== filters.q) {
    setUrlQuery(filters.q)
    setQuery(filters.q)
  }
  useEffect(() => {
    if (query.trim() === filters.q) return
    const t = window.setTimeout(() => update({ q: query.trim() }), 350)
    return () => window.clearTimeout(t)
  }, [query, filters.q, update])

  const listed = useMemo(() => vehicles.filter(isListed), [vehicles])
  const options = useMemo(() => getFilterOptions(listed, filters.brand), [listed, filters.brand])
  const results = useMemo(() => applyFilters(listed, filters), [listed, filters])
  const visible = results.slice(0, page * PAGE_SIZE)
  const remaining = results.length - visible.length
  const activeCount = countActiveFilters(filters)
  const chips = activeChips(filters)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || typeof dialog.showModal !== 'function') return
    if (drawerOpen && !dialog.open) dialog.showModal()
    if (!drawerOpen && dialog.open) dialog.close()
  }, [drawerOpen])

  const clearAll = () => {
    setQuery('')
    clear()
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        breadcrumb={[{ label: 'Estoque' }]}
        description="Filtre por marca, modelo, ano, câmbio e preço."
      />

      <div className="container-site py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Filtros — desktop */}
          <aside className="hidden lg:block" aria-label="Filtros">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Filtros</h2>
                {activeCount > 0 && (
                  <button type="button" onClick={clearAll} className="text-sm font-medium text-ink-500 underline-offset-4 hover:text-ink-950 hover:underline">
                    Limpar
                  </button>
                )}
              </div>
              <FilterPanel filters={filters} options={options} onChange={update} />
            </div>
          </aside>

          <div>
            {/* Barra de busca e ordenação */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <label htmlFor="inventory-search" className="sr-only">
                  Buscar veículo
                </label>
                <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  id="inventory-search"
                  type="search"
                  className="field pl-11"
                  placeholder="Buscar por marca, modelo, versão ou ano"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 flex-1 lg:hidden" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filtros{activeCount > 0 && ` (${activeCount})`}
                </Button>
                <label htmlFor="inventory-sort" className="sr-only">
                  Ordenar por
                </label>
                <select
                  id="inventory-sort"
                  className="field flex-1 sm:w-52 sm:flex-none"
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value as SortKey })}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contador e chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start" aria-live="polite">
              <p className="mr-2 text-sm text-ink-500">
                {status === 'loading' ? (
                  'Carregando veículos…'
                ) : (
                  <>
                    <strong className="font-semibold text-ink-950">{results.length}</strong> {results.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
                  </>
                )}
              </p>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => {
                    if (chip.key === 'q') setQuery('')
                    update(chip.patch)
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink-100 pr-2.5 pl-3 text-xs font-medium text-ink-800 transition-colors hover:bg-ink-200"
                  aria-label={`Remover filtro ${chip.label}`}
                >
                  {chip.label} <X size={13} aria-hidden="true" />
                </button>
              ))}
              {chips.length > 1 && (
                <button type="button" onClick={clearAll} className="ml-1 text-xs font-semibold text-accent hover:underline">
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="mt-6">
              {status === 'error' ? (
                <ErrorState message={error} onRetry={reload} />
              ) : status === 'loading' ? (
                <VehicleGrid>
                  {Array.from({ length: 6 }, (_, i) => (
                    <VehicleCardSkeleton key={i} />
                  ))}
                </VehicleGrid>
              ) : results.length === 0 ? (
                <EmptyState
                  title="Nenhum veículo encontrado"
                  description="Ajuste os filtros ou fale com a equipe pelo WhatsApp."
                  action={
                    <Button variant="dark" onClick={clearAll}>
                      Limpar filtros
                    </Button>
                  }
                />
              ) : (
                <>
                  <VehicleGrid>
                    {visible.map((v, i) => (
                      <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
                    ))}
                  </VehicleGrid>
                  {remaining > 0 && (
                    <div className="mt-12 flex flex-col items-center gap-3">
                      <p className="text-sm text-ink-500">
                        Exibindo {visible.length} de {results.length}
                      </p>
                      <Button variant="outline" size="lg" onClick={() => setPage(page + 1)}>
                        Carregar mais veículos
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros — mobile (diálogo nativo: foco preso e Esc para fechar) */}
      <dialog
        ref={dialogRef}
        onClose={() => setDrawerOpen(false)}
        aria-labelledby="filters-dialog-title"
        className="m-0 mt-auto h-[88dvh] max-h-none w-full max-w-none rounded-t-[1.5rem] bg-white p-0 backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 id="filters-dialog-title" className="font-display text-lg font-bold">
              Filtros
            </h2>
            <button type="button" className="grid size-10 place-items-center rounded-full hover:bg-ink-100" onClick={() => setDrawerOpen(false)} aria-label="Fechar filtros">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterPanel filters={filters} options={options} onChange={update} />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-ink-100 px-5 py-4">
            <Button variant="outline" size="lg" onClick={clearAll}>
              Limpar
            </Button>
            <Button variant="dark" size="lg" onClick={() => setDrawerOpen(false)}>
              Ver {results.length} {results.length === 1 ? 'veículo' : 'veículos'}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  )
}
