import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '../config/env'

/**
 * Cliente Supabase com a chave ANON (pública). As permissões reais são
 * garantidas pelas políticas RLS em `supabase/migrations`. Nunca use a
 * chave service_role no frontend.
 */
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
  client ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  return client
}

export const VEHICLE_IMAGES_BUCKET = 'vehicle-images'
