import { siteConfig } from './site'

export interface NavItem {
  label: string
  to: string
}

export const mainNav: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'Estoque', to: '/estoque' },
  ...(siteConfig.services.sell || siteConfig.services.trade ? [{ label: 'Venda ou Troca', to: '/venda-ou-troca' }] : []),
  ...(siteConfig.services.financing ? [{ label: 'Financiamento', to: '/financiamento' }] : []),
  { label: 'Sobre Nós', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]

export const legalNav: NavItem[] = [{ label: 'Política de Privacidade', to: '/politica-de-privacidade' }]
