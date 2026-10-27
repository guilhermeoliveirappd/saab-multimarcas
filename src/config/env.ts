import { siteConfig } from './site'

/** Leitura centralizada das variáveis de ambiente (todas opcionais). */
const raw = import.meta.env

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

export const env = {
  siteUrl: clean(raw.VITE_SITE_URL).replace(/\/$/, ''),
  allowIndexing: clean(raw.VITE_ALLOW_INDEXING) === 'true',
  whatsappNumber: clean(raw.VITE_WHATSAPP_NUMBER).replace(/\D/g, '') || siteConfig.whatsappNumber,
  supabaseUrl: clean(raw.VITE_SUPABASE_URL),
  supabaseAnonKey: clean(raw.VITE_SUPABASE_ANON_KEY),
  gtmId: clean(raw.VITE_GTM_ID),
  ga4Id: clean(raw.VITE_GA4_ID),
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey)
