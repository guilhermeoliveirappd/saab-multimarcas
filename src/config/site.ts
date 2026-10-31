/**
 * Configuração do site da Robcar Veículos.
 *
 * Dados da empresa vêm de `src/config/brand.ts` (fonte única). Aqui ficam as
 * flags de serviços, SEO e catálogo. `null`/`false` = não confirmado: o site
 * oculta o bloco correspondente — nunca inventa a informação.
 *
 * Este arquivo não pode depender de `import.meta.env`, pois também é usado
 * pelo script de pré-renderização (Node). Overrides por ambiente ficam em
 * `src/config/env.ts`.
 */
import { brand, mapsLinks, type Phone } from './brand'

export { mapsLinks }
export type { Phone }

export interface BusinessHours {
  label: string
  value: string
}

export interface ServiceFlags {
  /** Venda de veículos do estoque (atividade principal da revenda) */
  buy: boolean
  /** A loja compra/avalia o veículo do cliente — aguardando confirmação */
  sell: boolean
  /** Aceita veículo como parte do pagamento — aguardando confirmação */
  trade: boolean
  /** Página de financiamento — habilitar apenas após confirmação do cliente */
  financing: boolean
}

export const siteConfig = {
  name: brand.name,
  shortName: brand.shortName,
  legalName: brand.legalName,
  cnpj: brand.cnpj,
  /**
   * Logotipo oficial: a Robcar NÃO possui logotipo. Enquanto `src` for null,
   * o site usa o wordmark tipográfico provisório "ROBCAR VEÍCULOS".
   * Ex.: { src: '/brand/logo-robcar.svg', srcOnDark: '/brand/logo-robcar-branco.svg' }
   */
  logo: { src: null as string | null, srcOnDark: null as string | null },
  city: brand.city,
  state: brand.state,

  whatsappNumber: brand.whatsappNumber,
  phones: brand.phones as Phone[],
  email: brand.email,

  address: {
    confirmed: brand.address.confirmed,
    street: brand.address.street,
    district: brand.address.district,
    zip: brand.address.zip,
  },

  /** `null` = horário não informado (bloco oculto) */
  businessHours: null as BusinessHours[] | null,

  social: brand.social,

  /** Somente serviços confirmados pela Robcar ficam ativos */
  services: {
    buy: true,
    sell: false,
    trade: false,
    financing: false,
  } satisfies ServiceFlags,

  agency: {
    name: 'NESX Performance & Growth',
    url: null as string | null,
  },

  seo: {
    defaultTitle: `${brand.name} | Revenda de veículos em ${brand.city} (${brand.state})`,
    titleTemplate: `%s | ${brand.name}`,
    defaultDescription: `Conheça o estoque da ${brand.name} em ${brand.city} (${brand.state}). Veja fotos, detalhes e fale com a equipe pelo WhatsApp.`,
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
