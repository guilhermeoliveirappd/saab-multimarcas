/**
 * Configuração institucional central da SAAB Multimarcas.
 *
 * Tudo que estiver marcado com `null` ou `confirmed: false` AINDA NÃO FOI
 * VALIDADO PELO CLIENTE. O site trata esses casos exibindo "a confirmar" ou
 * ocultando o bloco correspondente — nunca inventando a informação.
 *
 * Este arquivo não pode depender de `import.meta.env`, pois também é usado
 * pelo script de pré-renderização (Node). Overrides por ambiente ficam em
 * `src/config/env.ts`.
 */

export interface BusinessHours {
  label: string
  value: string
}

export interface ServiceFlags {
  /** Compra de veículos do estoque */
  buy: boolean
  /** A loja compra/avalia o veículo do cliente */
  sell: boolean
  /** Aceita veículo como parte do pagamento */
  trade: boolean
  /** Página de financiamento — habilitar apenas após confirmação do cliente */
  financing: boolean
}

/** Texto único do endereço — usado na exibição e para gerar os links do Google Maps. */
const ADDRESS_QUERY = 'Avenida Joaquim Constantino, 1868 - Vila Formosa, Presidente Prudente - SP'

/** Links do Google Maps gerados a partir do TEXTO do endereço (sem coordenadas). */
export const mapsLinks = {
  route: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&output=embed`,
}

export const siteConfig = {
  name: 'SAAB Multimarcas',
  shortName: 'SAAB',
  legalName: null as string | null, // Razão social — a confirmar
  cnpj: null as string | null, // a confirmar
  /**
   * Logotipo oficial. Enquanto `src` for null, o site exibe um logotipo
   * tipográfico PROVISÓRIO. Ex.: { src: '/brand/logo-saab.svg', srcOnDark: '/brand/logo-saab-branco.svg' }
   */
  logo: { src: null as string | null, srcOnDark: null as string | null },
  city: 'Presidente Prudente',
  state: 'SP',

  /** Número no formato internacional, apenas dígitos. Ex.: 5518999999999 */
  whatsappNumber: '' as string, // a confirmar
  phoneDisplay: null as string | null, // a confirmar
  email: null as string | null, // a confirmar

  address: {
    /** Endereço oficial confirmado para o projeto. */
    confirmed: true,
    street: 'Avenida Joaquim Constantino, nº\u00a01868',
    district: 'Vila Formosa',
    /** CEP ainda não informado — vazio = não exibido */
    zip: '',
  },


  /** `null` = horário a confirmar */
  businessHours: null as BusinessHours[] | null,

  social: {
    instagram: 'https://www.instagram.com/saab_multimarcas/',
    instagramHandle: '@saab_multimarcas',
    facebook: null as string | null,
    youtube: null as string | null,
  },

  services: {
    buy: true,
    sell: true,
    trade: true,
    financing: true,
  } satisfies ServiceFlags,

  agency: {
    name: 'NESX Performance & Growth',
    url: null as string | null,
  },

  seo: {
    defaultTitle: 'SAAB Multimarcas | Revenda de veículos em Presidente Prudente',
    titleTemplate: '%s | SAAB Multimarcas',
    defaultDescription:
      'Conheça o estoque da SAAB Multimarcas em Presidente Prudente (SP). Veja fotos, detalhes e fale com a equipe pelo WhatsApp.',
    ogImage: '/og-default.png',
    locale: 'pt_BR',
  },

  inventory: {
    pageSize: 6,
  },
}

export type SiteConfig = typeof siteConfig

/** Endereço completo no formato oficial (ou só cidade/UF se não confirmado). */
export function formatAddress(): string {
  const { address, city, state } = siteConfig
  if (!address.confirmed) return `${city} — ${state}`
  return [address.street, address.district, city, state].filter(Boolean).join(' — ')
}
