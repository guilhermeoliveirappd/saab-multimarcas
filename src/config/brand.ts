/**
 * ─── Robcar Veículos — dados da empresa (fonte única) ──────────────────────
 *
 * Tudo que identifica a empresa fica AQUI: nome, contatos, endereço, redes e
 * links de mapa. Componentes e SEO leem estes dados via `siteConfig`.
 *
 * Regra: nada inventado. Campo sem dado confirmado = `null` (o site oculta o
 * bloco correspondente). Cores ficam em `src/styles/index.css` (--brand-primary).
 *
 * Pendências de conferência (documentação interna, ver README):
 * - Grafia da rua: briefing informa "Armando Sales"; fontes públicas podem
 *   escrever "Armando Salles". Confirmar antes da publicação definitiva.
 * - Confirmar que o celular (18) 99784-1331 recebe WhatsApp.
 */

export interface Phone {
  label: string
  display: string
  /** Formato E.164 para links tel: */
  e164: string
}

export const brand = {
  name: 'Robcar Veículos',
  shortName: 'Robcar',
  /** Wordmark tipográfico PROVISÓRIO (a empresa não tem logotipo oficial) */
  wordmark: { primary: 'ROBCAR', secondary: 'VEÍCULOS' },
  legalName: null as string | null,
  cnpj: null as string | null,

  city: 'Osvaldo Cruz',
  state: 'SP',

  address: {
    confirmed: true,
    /** Grafia conforme briefing — conferir "Sales" × "Salles" */
    street: 'Rua Armando Sales, nº 487',
    district: 'Centro',
    zip: '',
    /** Texto usado para gerar a rota e o mapa (sem coordenadas inventadas) */
    mapsQuery: 'Rua Armando Sales, 487 - Centro, Osvaldo Cruz - SP',
  },

  phones: [
    { label: 'Telefone', display: '(18) 3528-1773', e164: '+551835281773' },
    { label: 'Celular', display: '(18) 99784-1331', e164: '+5518997841331' },
  ] satisfies Phone[],

  /** WhatsApp provisório = celular informado (confirmar que recebe WhatsApp) */
  whatsappNumber: '5518997841331',
  email: null as string | null,

  social: {
    instagram: 'https://www.instagram.com/robcar__veiculos/',
    instagramHandle: '@robcar__veiculos',
    facebook: null as string | null,
    youtube: null as string | null,
  },
}

export const mapsLinks = {
  route: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(brand.address.mapsQuery)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(brand.address.mapsQuery)}&output=embed`,
}
