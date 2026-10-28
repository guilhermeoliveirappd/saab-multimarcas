/**
 * Textos comerciais centralizados. Revise aqui sem tocar nos componentes.
 *
 * Diretriz de layout (V2): textos centralizados e cada bloco com NO MÁXIMO
 * duas linhas no desktop e no mobile — mantenha os textos curtos.
 *
 * `provisional: true` é apenas DOCUMENTAÇÃO INTERNA: o texto ainda depende de
 * validação do cliente. Nada disso é exibido na interface (ver README,
 * seção "Pendências do cliente").
 */
import { HERO_PHOTO } from '../data/stock-photos'

export const content = {
  hero: {
    /** Cada item vira uma linha da headline */
    headline: ['Seu próximo carro.', 'Sua próxima conquista.'],
    subheadline: 'Explore nosso estoque e encontre o veículo ideal para você.',
    primaryCta: 'Explorar estoque',
    /**
     * Foto do banner. Substitua por uma foto oficial (ex.: { url: '/media/hero.jpg' }),
     * idealmente 2400px de largura, WebP/AVIF.
     */
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

  differentials: {
    provisional: true,
    title: 'Por que escolher a SAAB',
    description: 'O que orienta o nosso atendimento.',
    items: [
      { icon: 'messages', title: 'Atendimento próximo', text: 'Fale direto com a equipe pelo WhatsApp.' },
      { icon: 'search', title: 'Informação clara', text: 'Fotos, ficha técnica e opcionais em um só lugar.' },
      { icon: 'handshake', title: 'Negociação transparente', text: 'Condições diretas para você decidir com calma.' },
      { icon: 'map', title: 'Loja em Prudente', text: 'Conheça os veículos pessoalmente.' },
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

  about: {
    provisional: true,
    title: 'Revenda multimarcas em Presidente Prudente',
    cta: 'Conheça a SAAB',
    /** Substitua por foto real da fachada ou da equipe (ex.: '/media/fachada.jpg') */
    image: null as string | null,
    imageAlt: 'Fachada da SAAB Multimarcas',
  },

  aboutPage: {
    provisional: true,
    title: 'Sobre a SAAB Multimarcas',
    intro: 'Revenda de veículos multimarcas em Presidente Prudente (SP).',
    /** História e propósito: preencher com o texto oficial. `null` = bloco oculto. */
    history: null as { title: string; text: string } | null,
    purpose: null as { title: string; text: string } | null,
    gallery: [] as { src: string; alt: string }[],
  },

  location: {
    title: 'Venha conhecer a SAAB',
  },

  sellTrade: {
    title: 'Venda ou troque seu veículo',
    description: 'Preencha os dados e envie pelo WhatsApp para avaliação.',
    provisionalSteps: true,
    steps: [
      { title: 'Conte sobre o carro', text: 'Marca, modelo, ano e quilometragem.' },
      { title: 'Envie pelo WhatsApp', text: 'A mensagem é montada automaticamente.' },
      { title: 'Combine a avaliação', text: 'A equipe retorna com os próximos passos.' },
    ],
    button: 'Solicitar avaliação',
    disclaimer: 'Os dados não ficam salvos no site: vão só na mensagem que você envia.',
  },

  financing: {
    provisional: true,
    title: 'Financiamento',
    description: 'Orientação da equipe para financiar seu próximo veículo.',
    steps: ['Escolha o veículo no estoque.', 'Fale com a equipe pelo WhatsApp.', 'Receba a orientação sobre documentos.'],
    disclaimer: 'Sujeito à análise de crédito. O site não faz simulações nem coleta dados.',
    cta: 'Falar sobre financiamento',
  },

  contact: {
    title: 'Fale com a SAAB',
    description: 'Atendimento pelo WhatsApp e pelo Instagram.',
  },
}

export type Content = typeof content
