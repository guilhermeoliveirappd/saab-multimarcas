import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { BODY_TYPES, FUELS, TRANSMISSIONS, VEHICLE_STATUSES, type VehicleImage, type VehicleInput } from '@/types/vehicle'
import { FUEL_LABELS, STATUS_LABELS, TRANSMISSION_LABELS } from '@/lib/format'
import { buildVehicleSlug, slugify } from '@/lib/slug'
import { MAX_IMAGE_MB, createVehicle, getVehicleById, removeVehicleImage, updateVehicle, uploadVehicleImage } from '@/services/admin/admin-vehicles'
import { Button } from '@/components/ui/Button'

const BODY_LABELS: Record<(typeof BODY_TYPES)[number], string> = { hatch: 'Hatch', sedan: 'Sedã', suv: 'SUV', picape: 'Picape', outro: 'Outro' }

interface FormState {
  brand: string
  model: string
  version: string
  yearManufacture: string
  yearModel: string
  mileage: string
  transmission: VehicleInput['transmission']
  fuel: VehicleInput['fuel']
  color: string
  bodyType: VehicleInput['bodyType']
  price: string
  description: string
  options: string
  images: VehicleImage[]
  status: VehicleInput['status']
  featured: boolean
  published: boolean
  slug: string
}

const EMPTY: FormState = {
  brand: '',
  model: '',
  version: '',
  yearManufacture: '',
  yearModel: '',
  mileage: '',
  transmission: 'automatico',
  fuel: 'flex',
  color: '',
  bodyType: 'hatch',
  price: '',
  description: '',
  options: '',
  images: [],
  status: 'disponivel',
  featured: false,
  published: false,
  slug: '',
}

const digits = (s: string) => s.replace(/\D/g, '')

function toInput(f: FormState): { value?: VehicleInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const year = new Date().getFullYear() + 1
  const yf = Number(f.yearManufacture)
  const ym = Number(f.yearModel)
  if (!f.brand.trim()) errors.brand = 'Obrigatório'
  if (!f.model.trim()) errors.model = 'Obrigatório'
  if (!f.version.trim()) errors.version = 'Obrigatório'
  if (!(yf >= 1950 && yf <= year)) errors.yearManufacture = 'Ano inválido'
  if (!(ym >= 1950 && ym <= year + 1)) errors.yearModel = 'Ano inválido'
  if (f.mileage === '') errors.mileage = 'Obrigatório'
  if (!f.color.trim()) errors.color = 'Obrigatório'
  const slug = slugify(f.slug)
  if (!slug) errors.slug = 'Obrigatório'
  if (f.published && f.images.length === 0) errors.images = 'Adicione ao menos uma foto antes de publicar.'
  if (Object.keys(errors).length) return { errors }
  return {
    errors,
    value: {
      slug,
      brand: f.brand,
      model: f.model,
      version: f.version,
      yearManufacture: yf,
      yearModel: ym,
      mileage: Number(digits(f.mileage)),
      transmission: f.transmission,
      fuel: f.fuel,
      color: f.color,
      bodyType: f.bodyType,
      price: f.price === '' ? null : Number(digits(f.price)),
      description: f.description,
      options: f.options.split('\n'),
      images: f.images,
      status: f.status,
      featured: f.featured,
      published: f.published,
    },
  }
}

function Field({ label, error, children, hint, className = '' }: { label: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  )
}

export default function AdminVehicleForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [slugTouched, setSlugTouched] = useState(editing)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  useEffect(() => {
    if (!id) return
    getVehicleById(id)
      .then((v) => {
        if (!v) {
          setMessage({ type: 'error', text: 'Veículo não encontrado.' })
          return
        }
        setForm({
          ...v,
          yearManufacture: String(v.yearManufacture),
          yearModel: String(v.yearModel),
          mileage: String(v.mileage),
          price: v.price == null ? '' : String(v.price),
          options: v.options.join('\n'),
        })
      })
      .catch((err: unknown) => setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) }))
      .finally(() => setLoading(false))
  }, [id])

  const set =
    <K extends keyof FormState>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = (e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value) as FormState[K]
      setForm((f) => {
        const next = { ...f, [key]: value }
        if (!slugTouched && ['brand', 'model', 'version', 'yearModel'].includes(key as string)) {
          next.slug = buildVehicleSlug({ brand: next.brand, model: next.model, version: next.version, yearModel: Number(next.yearModel) || 0 })
        }
        return next
      })
    }

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    const folder = slugify(form.slug) || 'sem-slug'
    setUploading(files.length)
    setMessage(null)
    for (const file of files) {
      try {
        const url = await uploadVehicleImage(file, folder)
        setForm((f) => ({ ...f, images: [...f.images, { url, alt: `${f.brand} ${f.model} ${f.version}`.trim() }] }))
      } catch (err) {
        setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) })
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const moveImage = (index: number, dir: -1 | 1) =>
    setForm((f) => {
      const images = [...f.images]
      const target = index + dir
      if (target < 0 || target >= images.length) return f
      ;[images[index], images[target]] = [images[target], images[index]]
      return { ...f, images }
    })

  const deleteImage = async (img: VehicleImage) => {
    if (!window.confirm('Remover esta foto?')) return
    try {
      await removeVehicleImage(img.url)
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) })
      return
    }
    setForm((f) => ({ ...f, images: f.images.filter((i) => i.url !== img.url) }))
    if (editing) setMessage({ type: 'success', text: 'Foto removida. Salve para atualizar o anúncio.' })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { value, errors: found } = toInput(form)
    setErrors(found)
    if (!value) {
      setMessage({ type: 'error', text: 'Revise os campos destacados.' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      if (id) {
        await updateVehicle(id, value)
        setMessage({ type: 'success', text: 'Alterações salvas.' })
      } else {
        const created = await createVehicle(value)
        navigate(`/admin/veiculos/${created.id}`, { replace: true })
        setMessage({ type: 'success', text: 'Veículo cadastrado.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) })
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="animate-spin text-ink-400" aria-label="Carregando" />
      </div>
    )

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-4xl">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-950">
        <ArrowLeft size={15} aria-hidden="true" /> Voltar à lista
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink-950">{editing ? 'Editar veículo' : 'Cadastrar veículo'}</h1>

      {message && (
        <p role={message.type === 'error' ? 'alert' : 'status'} className={`mt-6 rounded-xl px-4 py-3 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
          {message.text}
        </p>
      )}

      <section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-ink-100">
        <h2 className="font-display text-lg font-bold">Identificação</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Marca" error={errors.brand}>
            <input className="field" value={form.brand} onChange={set('brand')} />
          </Field>
          <Field label="Modelo" error={errors.model}>
            <input className="field" value={form.model} onChange={set('model')} />
          </Field>
          <Field label="Versão" error={errors.version}>
            <input className="field" value={form.version} onChange={set('version')} placeholder="Ex.: EXL 2.0 CVT" />
          </Field>
          <Field label="Ano de fabricação" error={errors.yearManufacture}>
            <input className="field" inputMode="numeric" maxLength={4} value={form.yearManufacture} onChange={set('yearManufacture')} />
          </Field>
          <Field label="Ano do modelo" error={errors.yearModel}>
            <input className="field" inputMode="numeric" maxLength={4} value={form.yearModel} onChange={set('yearModel')} />
          </Field>
          <Field label="Categoria">
            <select className="field" value={form.bodyType} onChange={set('bodyType')}>
              {BODY_TYPES.map((b) => (
                <option key={b} value={b}>
                  {BODY_LABELS[b]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="URL do anúncio (slug)" error={errors.slug} hint={`/veiculos/${slugify(form.slug) || '...'}`} className="sm:col-span-3">
            <input
              className="field"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug')(e)
              }}
            />
          </Field>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-ink-100">
        <h2 className="font-display text-lg font-bold">Características e preço</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Quilometragem" error={errors.mileage}>
            <input className="field" inputMode="numeric" value={form.mileage} onChange={set('mileage')} />
          </Field>
          <Field label="Câmbio">
            <select className="field" value={form.transmission} onChange={set('transmission')}>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {TRANSMISSION_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Combustível">
            <select className="field" value={form.fuel} onChange={set('fuel')}>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {FUEL_LABELS[f]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cor" error={errors.color}>
            <input className="field" value={form.color} onChange={set('color')} />
          </Field>
          <Field label="Preço (R$)" hint="Deixe vazio para “Sob consulta”">
            <input className="field" inputMode="numeric" value={form.price} onChange={set('price')} placeholder="Ex.: 129900" />
          </Field>
          <Field label="Status">
            <select className="field" value={form.status} onChange={set('status')}>
              {VEHICLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Opcionais" hint="Um por linha" className="sm:col-span-3">
            <textarea className="field h-auto py-3" rows={5} value={form.options} onChange={set('options')} />
          </Field>
          <Field label="Descrição" className="sm:col-span-3">
            <textarea className="field h-auto py-3" rows={5} value={form.description} onChange={set('description')} />
          </Field>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-ink-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Fotos</h2>
            <p className="text-sm text-ink-500">A primeira foto é a capa. JPG, PNG ou WebP até {MAX_IMAGE_MB} MB — otimizadas automaticamente.</p>
          </div>
          <label className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-ink-950 px-5 text-sm font-semibold text-white hover:bg-ink-700 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${!form.slug ? 'pointer-events-none opacity-50' : ''}`}>
            {uploading > 0 ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
            {uploading > 0 ? `Enviando (${uploading})…` : 'Adicionar fotos'}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={onUpload} disabled={!form.slug || uploading > 0} />
          </label>
        </div>
        {!form.slug && <p className="mt-3 text-xs text-ink-400">Preencha marca, modelo e versão antes de enviar fotos.</p>}
        {errors.images && <p className="mt-3 text-sm font-medium text-danger">{errors.images}</p>}
        {form.images.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {form.images.map((img, i) => (
              <li key={img.url} className="overflow-hidden rounded-xl ring-1 ring-ink-100">
                <div className="relative aspect-[16/10] bg-ink-100">
                  <img src={img.url} alt="" className="size-full object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-ink-950 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Capa</span>}
                </div>
                <div className="flex justify-between p-1.5">
                  <div className="flex">
                    <button type="button" className="grid size-8 place-items-center rounded-full hover:bg-ink-100 disabled:opacity-30" disabled={i === 0} onClick={() => moveImage(i, -1)} aria-label="Mover para a esquerda">
                      <ArrowUp size={14} className="-rotate-90" />
                    </button>
                    <button type="button" className="grid size-8 place-items-center rounded-full hover:bg-ink-100 disabled:opacity-30" disabled={i === form.images.length - 1} onClick={() => moveImage(i, 1)} aria-label="Mover para a direita">
                      <ArrowDown size={14} className="-rotate-90" />
                    </button>
                  </div>
                  <button type="button" className="grid size-8 place-items-center rounded-full text-danger hover:bg-red-50" onClick={() => void deleteImage(img)} aria-label="Remover foto">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-ink-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="size-4 accent-ink-950" checked={form.published} onChange={set('published')} /> Publicado no site
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="size-4 accent-ink-950" checked={form.featured} onChange={set('featured')} /> Destaque na home
          </label>
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={saving || uploading > 0}>
          {saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {editing ? 'Salvar alterações' : 'Cadastrar veículo'}
        </Button>
      </section>
    </form>
  )
}
