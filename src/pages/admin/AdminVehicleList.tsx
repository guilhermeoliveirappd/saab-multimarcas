import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff, Loader2, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import type { Vehicle, VehicleStatus } from '@/types/vehicle'
import { VEHICLE_STATUSES } from '@/types/vehicle'
import { STATUS_LABELS, formatMileage, formatPrice, formatYears } from '@/lib/format'
import { normalizeText } from '@/lib/slug'
import { deleteVehicle, listAllVehicles, patchVehicle } from '@/services/admin/admin-vehicles'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState } from '@/components/ui/States'

export default function AdminVehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      setVehicles(await listAllVehicles())
      setStatus('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    // Carregamento inicial do catálogo administrativo
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = normalizeText(query)
    return q ? vehicles.filter((v) => normalizeText(`${v.brand} ${v.model} ${v.version} ${v.yearModel}`).includes(q)) : vehicles
  }, [vehicles, query])

  const patch = async (v: Vehicle, change: Partial<Pick<Vehicle, 'status' | 'featured' | 'published'>>) => {
    setBusyId(v.id)
    setNotice(null)
    try {
      await patchVehicle(v.id, change)
      setVehicles((list) => list.map((item) => (item.id === v.id ? { ...item, ...change } : item)))
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (v: Vehicle) => {
    if (!window.confirm(`Excluir definitivamente "${v.brand} ${v.model} ${v.version}"? Esta ação não pode ser desfeita.\n\nPara apenas retirar do site, use "Despublicar".`)) return
    setBusyId(v.id)
    try {
      await deleteVehicle(v)
      setVehicles((list) => list.filter((item) => item.id !== v.id))
      setNotice('Veículo excluído.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyId(null)
    }
  }

  const counts = useMemo(
    () => ({
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'disponivel' && v.published).length,
      featured: vehicles.filter((v) => v.featured).length,
    }),
    [vehicles],
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-950">Veículos</h1>
          {status === 'ready' && (
            <p className="mt-1 text-sm text-ink-500">
              {counts.total} cadastrados · {counts.available} disponíveis no site · {counts.featured} em destaque
            </p>
          )}
        </div>
        <ButtonLink to="/admin/veiculos/novo" variant="primary">
          <Plus size={16} aria-hidden="true" /> Cadastrar veículo
        </ButtonLink>
      </div>

      {notice && (
        <p role="status" className="mt-6 rounded-xl bg-white px-4 py-3 text-sm text-ink-700 ring-1 ring-ink-200">
          {notice}
        </p>
      )}

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        <input type="search" className="field h-11 pl-10" placeholder="Buscar no cadastro" aria-label="Buscar no cadastro" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="mt-6">
        {status === 'loading' ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="animate-spin text-ink-400" aria-label="Carregando" />
          </div>
        ) : status === 'error' ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : filtered.length === 0 ? (
          <EmptyState title={vehicles.length ? 'Nenhum resultado' : 'Nenhum veículo cadastrado'} description={vehicles.length ? 'Ajuste a busca.' : 'Cadastre o primeiro veículo do estoque.'} />
        ) : (
          <ul className="space-y-3">
            {filtered.map((v) => {
              const busy = busyId === v.id
              return (
                <li key={v.id} className={`flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-100 md:flex-row md:items-center ${busy ? 'opacity-60' : ''}`}>
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                      {v.images[0] && <img src={v.images[0].url} alt="" className="size-full object-cover" loading="lazy" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink-950">
                        {v.brand} {v.model} <span className="font-normal text-ink-500">{v.version}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {formatYears(v)} · {formatMileage(v.mileage)} · {formatPrice(v.price)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                        {!v.published && <span className="rounded-full bg-ink-100 px-2 py-0.5 text-ink-600">Não publicado</span>}
                        {v.featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Destaque</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor={`status-${v.id}`}>
                      Status de {v.model}
                    </label>
                    <select
                      id={`status-${v.id}`}
                      className="field h-10 w-36 text-sm"
                      value={v.status}
                      disabled={busy}
                      onChange={(e) => void patch(v, { status: e.target.value as VehicleStatus })}
                    >
                      {VEHICLE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                    <IconToggle active={v.featured} disabled={busy} label={v.featured ? 'Remover destaque' : 'Marcar como destaque'} onClick={() => void patch(v, { featured: !v.featured })}>
                      <Star size={16} fill={v.featured ? 'currentColor' : 'none'} />
                    </IconToggle>
                    <IconToggle active={v.published} disabled={busy} label={v.published ? 'Despublicar' : 'Publicar'} onClick={() => void patch(v, { published: !v.published })}>
                      {v.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </IconToggle>
                    <Link to={`/admin/veiculos/${v.id}`} className="grid size-10 place-items-center rounded-full ring-1 ring-ink-200 hover:bg-ink-100" aria-label={`Editar ${v.model}`} title="Editar">
                      <Pencil size={16} />
                    </Link>
                    <button type="button" disabled={busy} onClick={() => void remove(v)} className="grid size-10 place-items-center rounded-full text-accent ring-1 ring-ink-200 hover:bg-red-50" aria-label={`Excluir ${v.model}`} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function IconToggle({ active, label, onClick, disabled, children }: { active: boolean; label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-10 place-items-center rounded-full ring-1 transition-colors ${active ? 'bg-ink-950 text-white ring-ink-950' : 'text-ink-500 ring-ink-200 hover:bg-ink-100'}`}
    >
      {children}
    </button>
  )
}
