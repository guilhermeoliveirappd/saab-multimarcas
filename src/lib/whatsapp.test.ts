import { demoVehicles } from '@/data/demo-vehicles'
import { buildWhatsAppUrl, tradeInMessage, vehicleInterestMessage } from './whatsapp'
import { formatMileage, formatPrice } from './format'
import { buildVehicleSlug } from './slug'

describe('whatsapp links', () => {
  it('builds wa.me URLs with only digits and an encoded message', () => {
    const url = buildWhatsAppUrl('Olá! Tudo bem? R$ 10 & mais', '+55 (18) 99999-0000')
    expect(url.startsWith('https://wa.me/5518999990000?text=')).toBe(true)
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Olá! Tudo bem? R$ 10 & mais')
    expect(url).not.toContain(' ')
  })

  it('falls back to the contact picker when no number is configured', () => {
    expect(buildWhatsAppUrl('oi', '')).toBe('https://wa.me/?text=oi')
  })

  it('identifies the vehicle in the interest message', () => {
    const civic = demoVehicles.find((v) => v.slug === 'honda-civic-sport-2021')!
    const msg = vehicleInterestMessage(civic, 'https://site/veiculos/honda-civic-sport-2021')
    expect(msg).toContain('site da SAAB Multimarcas')
    expect(msg).toContain('Honda / Civic / Sport 2.0 CVT / 2020/2021')
    expect(msg).toContain('Ele ainda está disponível?')
    expect(msg).toContain('https://site/veiculos/honda-civic-sport-2021')
  })

  it('structures the trade-in message with the filled fields', () => {
    const msg = tradeInMessage({ brand: 'Fiat ', model: 'Uno', year: '2015', mileage: '98000', intent: 'trocar' })
    expect(msg).toContain('para troca')
    expect(msg).toContain('• Marca: Fiat')
    expect(msg).toMatch(/Quilometragem: 98\.000 km/)
  })
})

describe('format helpers', () => {
  it('formats BRL prices and mileage', () => {
    expect(formatPrice(129900).replace(/\s/g, ' ')).toBe('R$ 129.900')
    expect(formatPrice(null)).toBe('Sob consulta')
    expect(formatMileage(38500)).toBe('38.500 km')
  })

  it('builds friendly slugs', () => {
    expect(buildVehicleSlug({ brand: 'Honda', model: 'Civic', version: 'EXL 2.0 CVT', yearModel: 2021 })).toBe('honda-civic-exl-2021')
    expect(buildVehicleSlug({ brand: 'Citroën', model: 'C4 Cactus', version: 'Feel', yearModel: 2022 })).toBe('citroen-c4-cactus-feel-2022')
  })
})
