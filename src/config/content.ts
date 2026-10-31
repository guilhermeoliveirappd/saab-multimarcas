/**
 * Textos comerciais da Robcar Veículos, centralizados. Revise aqui sem tocar
 * nos componentes.
 *
 * Diretriz de layout: textos centralizados e cada bloco com NO MÁXIMO duas
 * linhas no desktop e no mobile — mantenha os textos curtos.
 *
 * Regra: nenhum diferencial, prazo, garantia ou condição sem confirmação da
 * Robcar. Blocos dependentes de validação ficam desligados (`enabled: false`)
 * e as pendências estão no README ("Pendências do cliente").
 */
import { HERO_PHOTO } from '../data/stock-photos'
import { brand } from './brand'

type FacadePhoto = { src: string; srcSet: string; width: number; height: number; alt: string }

export const content = {
  hero: {
    /** Headline PROVISÓRIA (validar com o cliente). Cada item vira uma linha. */
    headline: ['Seu próximo destino', 'começa na Robcar.'],
    primaryCta: 'Explorar estoque',
    /** Foto do banner. Para trocar, edite HERO_PHOTO em src/data/stock-photos.ts */
    image: HERO_PHOTO,
  },

  quickSearch: {
    title: 'Encontre seu veículo',
    button: 'Encontrar veículo',
  },

  featured: {
    title: 'Veículos em destaque',
    cta: 'Ver estoque completo',
  },

  /**
   * "Por que escolher" — DESLIGADO até a Robcar validar os diferenciais.
   * Os itens abaixo são neutros (descrevem o site, não a empresa); revise antes
   * de ativar. Nunca exibido na home.
   */
  differentials: {
    enabled: false,
    title: `Por que escolher a ${brand.shortName}`,
    items: [
      { icon: 'messages', title: 'Atendimento direto', text: 'Fale com a equipe pelo WhatsApp ou telefone.' },
      { icon: 'search', title: 'Informação clara', text: 'Fotos, ficha técnica e opcionais em um só lugar.' },
      { icon: 'map', title: `Loja em ${brand.city}`, text: 'Conheça os veículos pessoalmente.' },
    ],
  },

  services: {
    title: 'Compre, venda ou troque',
    buy: {
      title: 'Comprar',
      text: 'Filtre o estoque por marca, modelo, ano e preço.',
      cta: 'Ver estoque',
    },
    sell: {
      title: 'Vender',
      text: 'Envie os dados do seu carro e receba uma avaliação.',
      cta: 'Solicitar avaliação',
    },
    trade: {
      title: 'Trocar',
      text: 'Use seu carro atual na negociação do próximo.',
      cta: 'Falar pelo WhatsApp',
    },
  },

  aboutPage: {
    title: `Sobre a ${brand.name}`,
    intro: `Revenda de veículos em ${brand.city} (${brand.state}).`,
    /** História e propósito: preencher com o texto oficial. `null` = bloco oculto. */
    history: null as { title: string; text: string } | null,
    purpose: null as { title: string; text: string } | null,
    gallery: [] as { src: string; alt: string }[],
  },

  location: {
    title: `Venha conhecer a ${brand.shortName}`,
    /** Link para a página Sobre Nós */
    aboutCta: `Conheça a ${brand.shortName}`,
    /**
     * Foto real da fachada vermelha da Robcar — AGUARDANDO ARQUIVO.
     * Ao receber: salve em public/media/fachada-robcar-800.webp e
     * fachada-robcar-1600.webp (ou rode `npm run photos:fachada`) e preencha:
     *   { src: '/media/fachada-robcar-1600.webp',
     *     srcSet: '/media/fachada-robcar-800.webp 800w, /media/fachada-robcar-1600.webp 1600w',
     *     width: <largura>, height: <altura>,
     *     alt: 'Fachada da Robcar Veículos na Rua Armando Sales, em Osvaldo Cruz' }
     * `null` = exibe o painel com o wordmark (nunca uma fachada de outra loja).
     */
    facade: null as FacadePhoto | null,
  },

  sellTrade: {
    title: 'Venda ou troque seu veículo',
    description: 'Preencha os dados e envie pelo WhatsApp para avaliação.',
    steps: [
      { title: 'Conte sobre o carro', text: 'Marca, modelo, ano e quilometragem.' },
      { title: 'Envie pelo WhatsApp', text: 'A mensagem é montada automaticamente.' },
      { title: 'Combine a avaliação', text: 'A equipe retorna com os próximos passos.' },
    ],
    button: 'Solicitar avaliação',
    disclaimer: 'Os dados não ficam salvos no site: vão só na mensagem que você envia.',
  },

  financing: {
    title: 'Financie seu próximo carro',
    description: 'Preencha a ficha em quatro etapas para iniciar a análise com a equipe.',
    privacyNote: 'Usados só na análise da sua solicitação. Não vão ao WhatsApp nem ficam salvos no navegador.',
    disclaimer: 'Aprovação sujeita à análise de crédito. Esta página não simula taxas.',
  },

  contact: {
    title: `Fale com a ${brand.shortName}`,
    description: 'Atendimento por WhatsApp, telefone e Instagram.',
  },
}

export type Content = typeof content
