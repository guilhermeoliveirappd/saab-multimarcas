import { env } from '../config/env'

/**
 * Camada de mensuração. Eventos são enviados ao dataLayer (GTM) e/ou gtag (GA4)
 * SOMENTE se os IDs existirem e o visitante tiver consentido. Sem IDs, as
 * funções são no-op e o site funciona normalmente.
 *
 * Importante: `contact_click` mede cliques em botões de contato, NÃO leads
 * confirmados — o envio da mensagem acontece fora do site.
 */

export type AnalyticsEvent =
  | { name: 'contact_click'; params: { channel: 'whatsapp' | 'instagram' | 'phone' | 'maps'; location: string; vehicle_id?: string; vehicle_name?: string } }
  | { name: 'vehicle_view'; params: { vehicle_id: string; vehicle_name: string; price?: number | null; is_demo: boolean } }
  | { name: 'inventory_filter'; params: { filter: string; value: string } }
  | { name: 'quick_search'; params: { brand?: string; model?: string; price_range?: string } }
  | { name: 'share_click'; params: { vehicle_id: string; method: 'native' | 'clipboard' } }
  | { name: 'trade_in_submit'; params: { intent: string } }
  // Financiamento: apenas etapa/resultado — NUNCA dados da ficha
  | { name: 'financing_step'; params: { step: number } }
  | { name: 'financing_submit'; params: { status: 'sent' | 'disabled' | 'error' } }
  | { name: 'financing_cta'; params: { vehicle_id: string } }

type DataLayerEntry = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[]
    gtag?: (...args: unknown[]) => void
  }
}

export const CONSENT_KEY = 'robcar-analytics-consent'
export const analyticsEnabled = Boolean(env.gtmId || env.ga4Id)

let initialized = false

export function getConsent(): 'granted' | 'denied' | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(value: 'granted' | 'denied'): void {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* armazenamento indisponível: consentimento vale só para a sessão */
  }
  if (value === 'granted') initAnalytics()
}

function loadScript(src: string) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function initAnalytics(): void {
  if (initialized || !analyticsEnabled || typeof window === 'undefined') return
  if (getConsent() !== 'granted') return
  initialized = true
  window.dataLayer = window.dataLayer ?? []

  if (env.gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(env.gtmId)}`)
    return
  }
  // GA4 direto (sem GTM). page_view é enviado manualmente a cada rota (SPA).
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments as unknown as DataLayerEntry)
  }
  window.gtag('js', new Date())
  window.gtag('config', env.ga4Id, { send_page_view: false })
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(env.ga4Id)}`)
}

export function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) console.debug('[analytics]', event.name, event.params)
  if (!initialized) return
  if (env.gtmId) window.dataLayer?.push({ event: event.name, ...event.params })
  else window.gtag?.('event', event.name, event.params)
}

export function trackPageView(path: string, title: string): void {
  if (!initialized) return
  if (env.gtmId) window.dataLayer?.push({ event: 'virtual_page_view', page_path: path, page_title: title })
  else window.gtag?.('event', 'page_view', { page_path: path, page_title: title, page_location: window.location.href })
}
