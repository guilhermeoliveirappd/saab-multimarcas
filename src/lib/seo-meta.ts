/**
 * Metadados de SEO compartilhados entre o app (runtime) e o script de
 * pré-renderização (Node). Não usar APIs de navegador nem import.meta.env aqui.
 */
import { siteConfig } from '../config/site'
import type { Vehicle } from '../types/vehicle'
import { FUEL_LABELS, TRANSMISSION_LABELS, formatMileage, formatPrice, formatYears, vehicleFullName } from './format'

export interface PageMeta {
  title?: string
  description?: string
  path: string
  image?: string
  type?: 'website' | 'product' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | null
}

export const STATIC_PAGES: Record<string, Omit<PageMeta, 'path'>> = {
  '/': { description: siteConfig.seo.defaultDescription },
  '/estoque': {
    title: 'Estoque de veículos',
    description: `Veja o estoque da ${siteConfig.name} em ${siteConfig.city}: filtre por marca, modelo, ano, câmbio e preço.`,
  },
  '/venda-ou-troca': {
    title: 'Venda ou troque seu veículo',
    description: `Envie os dados do seu veículo para a ${siteConfig.name} e solicite uma avaliação pelo WhatsApp.`,
  },
  '/financiamento': {
    title: 'Financiamento',
    description: `Informações sobre financiamento de veículos na ${siteConfig.name}.`,
  },
  '/sobre': {
    title: 'Sobre nós',
    description: `Conheça a ${siteConfig.name}, revenda de veículos em ${siteConfig.city} (${siteConfig.state}).`,
  },
  '/contato': {
    title: 'Contato',
    description: `Fale com a ${siteConfig.name} pelo WhatsApp ou Instagram.`,
  },
  '/creditos-de-imagens': {
    title: 'Créditos das imagens',
    description: 'Autoria e licenças das fotografias ilustrativas usadas no site.',
    noindex: true,
  },
  '/politica-de-privacidade': {
    title: 'Política de Privacidade',
    description: `Como a ${siteConfig.name} trata dados pessoais neste site.`,
  },
}

export const fullTitle = (title?: string): string =>
  title ? siteConfig.seo.titleTemplate.replace('%s', title) : siteConfig.seo.defaultTitle

export const absoluteUrl = (siteUrl: string, path: string): string =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

export function vehicleMeta(v: Vehicle): Omit<PageMeta, 'path'> {
  const name = vehicleFullName(v)
  const parts = [formatYears(v), formatMileage(v.mileage), TRANSMISSION_LABELS[v.transmission], FUEL_LABELS[v.fuel], formatPrice(v.price)]
  return {
    title: name,
    description: `${name} — ${parts.join(' · ')}. ${v.isDemo ? 'Anúncio de demonstração.' : `Fale com a ${siteConfig.name} pelo WhatsApp.`}`,
    // Ilustrações SVG não são aceitas por redes sociais; usa a imagem padrão
    image: v.images[0]?.url && !v.images[0].url.endsWith('.svg') ? v.images[0].url : undefined,
    type: 'product',
  }
}

/** JSON-LD schema.org/Car — somente para veículos reais (nunca demonstração). */
export function vehicleJsonLd(v: Vehicle, siteUrl: string): Record<string, unknown> | null {
  if (v.isDemo) return null
  const url = absoluteUrl(siteUrl, `/veiculos/${v.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicleFullName(v),
    brand: { '@type': 'Brand', name: v.brand },
    model: v.model,
    vehicleModelDate: String(v.yearModel),
    productionDate: String(v.yearManufacture),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileage, unitCode: 'KMT' },
    fuelType: FUEL_LABELS[v.fuel],
    vehicleTransmission: TRANSMISSION_LABELS[v.transmission],
    color: v.color,
    image: v.images.map((i) => absoluteUrl(siteUrl, i.url)),
    url,
    ...(v.price != null && {
      offers: {
        '@type': 'Offer',
        price: v.price,
        priceCurrency: 'BRL',
        url,
        availability:
          v.status === 'disponivel' ? 'https://schema.org/InStock' : v.status === 'reservado' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/SoldOut',
      },
    }),
  }
}

/** JSON-LD da loja — publicado apenas quando o endereço for confirmado. */
export function dealerJsonLd(siteUrl: string): Record<string, unknown> | null {
  const a = siteConfig.address
  if (!a.confirmed) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: siteConfig.name,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      postalCode: a.zip,
      addressCountry: 'BR',
    },
    ...(siteConfig.phoneDisplay && { telephone: siteConfig.phoneDisplay }),
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.youtube].filter(Boolean),
  }
}
