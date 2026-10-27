/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_ALLOW_INDEXING?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_GTM_ID?: string
  readonly VITE_GA4_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
