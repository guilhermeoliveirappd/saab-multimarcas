/**
 * Textos comerciais centralizados. Revise aqui sem tocar nos componentes.
 *
 * `provisional: true` indica texto demonstrativo que ainda depende de
 * validação do cliente (exibe o selo "Conteúdo provisório" quando
 * `siteConfig.showProvisionalMarkers` estiver ativo).
 */

export const content = {
  hero: {
    eyebrow: 'Presidente Prudente · SP',
    headline: 'Seu próximo carro começa com uma boa escolha.',
    subheadline:
      'Encontre o veículo ideal para o seu próximo capítulo. Explore nosso estoque e converse com quem entende de boas escolhas.',
    primaryCta: 'Explorar estoque',
    secondaryCta: 'Falar com um especialista',
    /**
     * Imagem do hero. Substitua por uma fotografia real (ex.: '/media/hero.jpg',
     * idealmente 2400px de largura, WebP/AVIF). A ilustração atual é provisória.
     */
    image: '/demo/hero-car.svg',
    imageAlt: 'Ilustração de um sedã em estúdio escuro',
    imageIsIllustration: true,
  },

  quickSearch: {
    title: 'Encontre seu veículo',
    button: 'Encontrar veículo',
  },

  featured: {
    eyebrow: 'Vitrine',
    title: 'Veículos em destaque',
    description: 'Uma seleção do nosso estoque atual. Clique para ver fotos, opcionais e condições.',
    cta: 'Ver estoque completo',
  },

  differentials: {
    provisional: true,
    eyebrow: 'Por que a SAAB',
    title: 'Uma compra conduzida com atenção aos detalhes',
    description:
      'Texto demonstrativo. Os diferenciais definitivos serão definidos com a SAAB antes da publicação.',
    items: [
      {
        icon: 'messages',
        title: 'Atendimento próximo',
        text: 'Converse diretamente com a equipe pelo WhatsApp e tire suas dúvidas sobre cada veículo.',
      },
      {
        icon: 'search',
        title: 'Estoque com informações claras',
        text: 'Fotos, versão, quilometragem, câmbio e opcionais reunidos em uma única página por veículo.',
      },
      {
        icon: 'handshake',
        title: 'Negociação transparente',
        text: 'Condições apresentadas de forma direta, para você decidir com tranquilidade.',
      },
      {
        icon: 'map',
        title: 'Loja em Presidente Prudente',
        text: 'Venha conhecer os veículos pessoalmente e fazer sua avaliação com calma.',
      },
    ],
  },

  services: {
    eyebrow: 'Soluções',
    title: 'Compre, venda ou troque',
    description: 'Escolha o caminho ideal para o seu momento.',
    buy: {
      title: 'Comprar',
      text: 'Explore o estoque com filtros por marca, modelo, ano e faixa de preço.',
      cta: 'Ver estoque',
    },
    sell: {
      title: 'Vender',
      text: 'Envie os dados do seu veículo e receba o contato da equipe para uma avaliação.',
      cta: 'Solicitar avaliação',
    },
    trade: {
      title: 'Trocar',
      text: 'Use o seu veículo atual na negociação do próximo. Converse com a equipe sobre as possibilidades.',
      cta: 'Simular troca pelo WhatsApp',
    },
  },

  about: {
    provisional: true,
    eyebrow: 'Sobre a SAAB',
    title: 'Uma revenda multimarcas em Presidente Prudente',
    summary:
      'Texto provisório. Aqui entrará um resumo da história da SAAB Multimarcas, sua forma de trabalhar e o que a diferencia — conteúdo a ser fornecido e validado pelo cliente.',
    cta: 'Conheça a SAAB',
    /** Substitua por foto real da fachada ou da equipe (ex.: '/media/fachada.jpg') */
    image: null as string | null,
    imageAlt: 'Fachada da SAAB Multimarcas',
  },

  aboutPage: {
    provisional: true,
    title: 'Sobre a SAAB Multimarcas',
    intro:
      'Conteúdo provisório. Esta página receberá a história, o propósito e os diferenciais comprovados da SAAB Multimarcas.',
    history: {
      title: 'Nossa história',
      text: 'História da empresa a ser fornecida pelo cliente: ano de fundação, trajetória e marcos relevantes.',
    },
    purpose: {
      title: 'Nosso propósito',
      text: 'Propósito e valores da empresa a serem definidos em conjunto com a SAAB.',
    },
    gallery: [] as { src: string; alt: string }[],
  },

  sellTrade: {
    eyebrow: 'Venda ou troca',
    title: 'Seu veículo pode ser o primeiro passo para o próximo.',
    description:
      'Informe alguns dados do seu veículo e envie para a nossa equipe pelo WhatsApp. Retornamos com os próximos passos da avaliação.',
    provisionalSteps: true,
    steps: [
      { title: 'Conte sobre o seu veículo', text: 'Preencha marca, modelo, ano e quilometragem.' },
      { title: 'Envie pelo WhatsApp', text: 'A mensagem é montada automaticamente com os dados informados.' },
      { title: 'Combine a avaliação', text: 'A equipe retorna para agendar a avaliação presencial.' },
    ],
    button: 'Solicitar avaliação via WhatsApp',
    disclaimer:
      'Os dados não são armazenados pelo site: eles são apenas inseridos na mensagem do WhatsApp, que você revisa antes de enviar.',
  },

  financing: {
    provisional: true,
    title: 'Financiamento',
    description:
      'Conte com a orientação da equipe para entender as possibilidades de financiamento do seu próximo veículo.',
    steps: [
      'Escolha o veículo no estoque.',
      'Fale com a equipe pelo WhatsApp informando que deseja financiar.',
      'A equipe orienta sobre as próximas etapas e a documentação necessária.',
    ],
    disclaimer:
      'Condições sujeitas à análise de crédito pela instituição financeira. O site não realiza simulações nem coleta dados pessoais.',
    cta: 'Falar sobre financiamento',
  },

  contact: {
    title: 'Fale com a SAAB',
    description: 'Atendimento pelo WhatsApp e pelo Instagram. Endereço e horários serão publicados após confirmação.',
  },

  finalCta: {
    title: 'Encontrou o carro certo?',
    text: 'Fale com a equipe da SAAB e tire suas dúvidas.',
  },
}

export type Content = typeof content
