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
    headline: ['Bons negócios começam', 'com boas escolhas.'],
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
    /** Link para a página Sobre Nós */
    aboutCta: 'Conheça a SAAB',
    /**
     * Foto real da fachada (fornecida pela SAAB). Proporção original 4:3 preservada.
     * Para trocar: substitua os arquivos em public/media/ e ajuste width/height.
     * `null` = exibe o painel com a marca.
     */
    facade: {
      src: '/media/fachada-saab-1448.webp',
      srcSet: '/media/fachada-saab-800.webp 800w, /media/fachada-saab-1448.webp 1448w',
      width: 1448,
      height: 1086,
      alt: 'Fachada da SAAB Multimarcas, com o letreiro "Compra, Venda, Troca, Financia", na Avenida Joaquim Constantino, em Presidente Prudente',
    } as { src: string; srcSet: string; width: number; height: number; alt: string } | null,
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
    title: 'Financie seu próximo carro',
    description: 'Preencha a ficha em quatro etapas para iniciar a análise com a equipe.',
    privacyNote: 'Usados só na análise da sua solicitação. Não vão ao WhatsApp nem ficam salvos no navegador.',
    disclaimer: 'Aprovação sujeita à análise de crédito. Esta página não simula taxas.',
  },

  contact: {
    title: 'Fale com a SAAB',
    description: 'Atendimento pelo WhatsApp e pelo Instagram.',
  },
}

export type Content = typeof content
