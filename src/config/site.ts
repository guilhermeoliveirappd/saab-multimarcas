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
    /** `confirmed: false` exibe "Endereço a confirmar" e oculta o mapa */
    confirmed: false,
    street: '',
    district: '',
    zip: '',
    /** URL de incorporação do Google Maps (iframe src). Só é usada se `confirmed` */
    mapsEmbedUrl: '',
    /** Link "Como chegar" no Google Maps */
    mapsLink: '',
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
    financing: false,
  } satisfies ServiceFlags,

  /**
   * Quando `true`, blocos com conteúdo provisório recebem um selo
   * "Conteúdo provisório". Desligue somente quando todo o texto for validado.
   */
  showProvisionalMarkers: true,

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
    pageSize: 9,
  },
}

export type SiteConfig = typeof siteConfig
