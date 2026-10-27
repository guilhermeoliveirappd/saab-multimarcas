import type { Vehicle, VehicleInput, VehicleStatus } from '@/types/vehicle'
import { VEHICLE_IMAGES_BUCKET, getSupabase } from '@/lib/supabase'
import { VEHICLE_COLUMNS, fromRow, toRow, type VehicleRow } from '../vehicles/mapper'

/**
 * Operações administrativas do catálogo. Todas dependem de sessão autenticada
 * de um usuário presente em `public.admin_users` — a RLS bloqueia os demais.
 */

function fail(action: string, message: string): never {
  throw new Error(`${action}: ${message}`)
}

export async function listAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await getSupabase().from('vehicles').select(VEHICLE_COLUMNS).order('created_at', { ascending: false })
  if (error) fail('Falha ao listar veículos', error.message)
  return (data as VehicleRow[]).map(fromRow)
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const { data, error } = await getSupabase().from('vehicles').select(VEHICLE_COLUMNS).eq('id', id).maybeSingle()
  if (error) fail('Falha ao carregar veículo', error.message)
  return data ? fromRow(data as VehicleRow) : null
}

const friendly = (message: string) =>
  message.includes('vehicles_slug_key') ? 'Já existe um veículo com esta URL (slug). Altere o slug.' : message

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const { data, error } = await getSupabase().from('vehicles').insert(toRow(input)).select(VEHICLE_COLUMNS).single()
  if (error) fail('Falha ao cadastrar', friendly(error.message))
  return fromRow(data as VehicleRow)
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<Vehicle> {
  const { data, error } = await getSupabase().from('vehicles').update(toRow(input)).eq('id', id).select(VEHICLE_COLUMNS).single()
  if (error) fail('Falha ao salvar', friendly(error.message))
  return fromRow(data as VehicleRow)
}

export async function patchVehicle(id: string, patch: Partial<{ status: VehicleStatus; featured: boolean; published: boolean }>): Promise<void> {
  const { error } = await getSupabase().from('vehicles').update(patch).eq('id', id)
  if (error) fail('Falha ao atualizar', error.message)
}

export async function deleteVehicle(v: Vehicle): Promise<void> {
  const paths = v.images.map((i) => storagePathFromUrl(i.url)).filter((p): p is string => Boolean(p))
  if (paths.length) await getSupabase().storage.from(VEHICLE_IMAGES_BUCKET).remove(paths)
  const { error } = await getSupabase().from('vehicles').delete().eq('id', v.id)
  if (error) fail('Falha ao excluir', error.message)
}

// ─── Imagens ────────────────────────────────────────────────────────────────

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const MAX_IMAGE_MB = 12

export function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${VEHICLE_IMAGES_BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length))
}

/** Redimensiona para no máx. 2000px e converte para WebP (fallback: arquivo original). */
async function optimizeImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

export async function uploadVehicleImage(file: File, folder: string): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new Error(`Formato não suportado: ${file.name}. Use JPG, PNG, WebP ou AVIF.`)
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`${file.name} excede ${MAX_IMAGE_MB} MB.`)
  const blob = await optimizeImage(file)
  const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() ?? 'jpg').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const storage = getSupabase().storage.from(VEHICLE_IMAGES_BUCKET)
  const { error } = await storage.upload(path, blob, { contentType: blob.type || file.type, cacheControl: '31536000', upsert: false })
  if (error) fail('Falha no upload', error.message)
  return storage.getPublicUrl(path).data.publicUrl
}

export async function removeVehicleImage(url: string): Promise<void> {
  const path = storagePathFromUrl(url)
  if (!path) return
  const { error } = await getSupabase().storage.from(VEHICLE_IMAGES_BUCKET).remove([path])
  if (error) fail('Falha ao remover imagem', error.message)
}
