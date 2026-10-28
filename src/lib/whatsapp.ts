import { siteConfig } from '../config/site'
import type { Vehicle } from '../types/vehicle'
import { formatMileage, formatYears } from './format'

/**
 * Monta um link da API de links do WhatsApp (wa.me) com a mensagem codificada.
 * Sem número configurado, o link abre o WhatsApp para o usuário escolher o contato.
 */
export function buildWhatsAppUrl(message: string, phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(message)}`
}

export function generalMessage(): string {
  return `Olá! Estava navegando pelo site da ${siteConfig.name} e gostaria de falar com um especialista.`
}

export function vehicleInterestMessage(
  v: Pick<Vehicle, 'brand' | 'model' | 'version' | 'yearManufacture' | 'yearModel'>,
  pageUrl?: string,
): string {
  const label = `${v.brand} / ${v.model} / ${v.version} / ${formatYears(v)}`
  const base = `Olá! Estava navegando pelo site da ${siteConfig.name} e gostaria de saber mais sobre o veículo ${label}. Ele ainda está disponível?`
  return pageUrl ? `${base}\n\n${pageUrl}` : base
}

export interface TradeInData {
  brand: string
  model: string
  year: string
  mileage: string
  intent: 'vender' | 'trocar'
  notes?: string
}

export function tradeInMessage(d: TradeInData): string {
  const km = Number(d.mileage.replace(/\D/g, ''))
  const lines = [
    `Olá! Estava navegando pelo site da ${siteConfig.name} e gostaria de solicitar uma avaliação do meu veículo para ${d.intent === 'vender' ? 'venda' : 'troca'}.`,
    '',
    `• Marca: ${d.brand.trim()}`,
    `• Modelo: ${d.model.trim()}`,
    `• Ano: ${d.year.trim()}`,
    `• Quilometragem: ${Number.isFinite(km) && d.mileage.trim() ? formatMileage(km) : 'não informada'}`,
  ]
  if (d.notes?.trim()) lines.push(`• Observações: ${d.notes.trim()}`)
  return lines.join('\n')
}

/** Só identifica o veículo — nunca inclui dados pessoais da ficha. */
export function financingMessage(vehicleName?: string): string {
  const about = vehicleName ? ` do veículo ${vehicleName}` : ''
  return `Olá! Estava navegando pelo site da ${siteConfig.name} e gostaria de informações sobre o financiamento${about}.`
}
