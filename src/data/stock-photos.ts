import type { ImageCredit, VehicleImage } from '../types/vehicle'

/**
 * Fotografias reais de terceiros usadas nos veículos de EXEMPLO e no banner.
 * (Documentação interna: não são fotos do estoque da SAAB.)
 *
 * Fontes e licenças:
 * - Pexels (Licença Pexels): uso livre, sem atribuição obrigatória.
 * - Wikimedia Commons (CC BY-SA 4.0): atribuição obrigatória. Cumprida pela
 *   página /informacoes-legais (link no rodapé), forma admitida pela licença
 *   ("URI ou link para recurso com as informações"). Sem rótulos sobre as fotos.
 *
 * Regra das galerias: cada galeria usa SOMENTE fotos do mesmo carro (mesma
 * sessão, série numerada), nunca de carros diferentes.
 */

const COMMONS_WIDTHS = [500, 960, 1280, 1920] as const

/** URL de miniatura do Commons via Special:FilePath (hotlink permitido). */
export const commonsUrl = (file: string, width: number): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

export const commonsPage = (file: string): string => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`

export function commonsImage(
  file: string,
  credit: Omit<ImageCredit, 'sourceUrl'>,
  options: { alt: string; fallbackUrl?: string; maxWidth?: (typeof COMMONS_WIDTHS)[number] },
): VehicleImage {
  const max = options.maxWidth ?? 1280
  return {
    url: commonsUrl(file, max),
    srcSet: COMMONS_WIDTHS.filter((w) => w <= max)
      .map((w) => `${commonsUrl(file, w)} ${w}w`)
      .join(', '),
    alt: options.alt,
    fallbackUrl: options.fallbackUrl,
    credit: { ...credit, sourceUrl: commonsPage(file) },
  }
}

const PEXELS_WIDTHS = [960, 1280, 1920, 2560] as const

export const pexelsUrl = (id: number, width: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`

export function pexelsImage(id: number, slug: string, author: string | null, alt: string): VehicleImage {
  return {
    url: pexelsUrl(id, 1920),
    srcSet: PEXELS_WIDTHS.map((w) => `${pexelsUrl(id, w)} ${w}w`).join(', '),
    alt,
    credit: { author: author ?? 'Pexels', license: 'Licença Pexels', sourceUrl: `https://www.pexels.com/photo/${slug}-${id}/` },
  }
}

export interface PhotoSet {
  /** Prefixo do nome do arquivo no Commons — o conjunto é "<prefixo> (N).jpg" */
  prefix: string
  /** Números dos arquivos, na ordem da galeria (capa primeiro) */
  numbers: number[]
  /** Como a existência dos arquivos foi verificada (auditoria interna) */
  verified: string
  author: string
  license: string
}

/**
 * Galerias por veículo (chave = slug). Todas do mesmo fotógrafo e da MESMA
 * sessão/carro: série numerada "(1)…(N)" de Damian B Oh no Commons.
 * Atribuição exigida pela licença: publicada em /informacoes-legais.
 */
export const STOCK_GALLERIES: Record<string, PhotoSet> = {
  'bmw-320i-m-sport-2023': {
    prefix: 'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic',
    numbers: [1, 3, 5, 10, 12, 16],
    verified: 'arquivos (1)–(6), (10), (12), (16) confirmados; série (1)–(20) listada na categoria BMW G20 (2022)',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'kia-sportage-signature-2023': {
    prefix: 'Kia_Sportage_1.6T_2WD_Signature_NQ5_PE_Snow_White_Pearl',
    numbers: [1, 3, 6, 10, 15, 20],
    verified: 'arquivo (3) confirmado; série (1)–(23) listada na categoria Kia Sportage (NQ5)',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'tesla-model-y-long-range-2025': {
    prefix: 'Tesla_Model_Y_Juniper_Stealth_Grey',
    numbers: [1, 3, 5, 7, 8],
    verified: 'arquivos (1), (3), (5), (7) e (8) confirmados',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'mercedes-benz-c300-amg-line-2023': {
    prefix: 'Mercedes-Benz_W206_C300_AMG_Line_Obsidian_Black',
    numbers: [1, 3, 5, 7, 10],
    verified: 'arquivos (1) e (10) confirmados; numeração contínua da mesma sessão',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'hyundai-elantra-2-0-2022': {
    prefix: 'Hyundai_Avante_CN7_white',
    numbers: [1, 3, 5, 7, 10],
    verified: 'arquivos (1) e (10) confirmados; numeração contínua da mesma sessão',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'kia-carnival-hi-limousine-2023': {
    prefix: 'Kia_Carnival_Hi-Limousine_KA4_Cotton_Beige',
    numbers: [2, 4, 12, 22],
    verified: 'arquivos (2), (4), (12) e (22) confirmados',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
  'hyundai-tucson-inspiration-2023': {
    prefix: 'Hyundai_Tucson_Inspiration_1.6T_NX4_Amazon_Gray_Metallic',
    numbers: [4, 2, 1, 3],
    verified: 'arquivos (2) e (4) confirmados; (1) e (3) da mesma sessão',
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
  },
}

export const galleryFiles = (set: PhotoSet): string[] => set.numbers.map((n) => `${set.prefix}_(${n}).jpg`)

/**
 * Banner principal: BMW azul em garagem (Pexels). Se não carregar, tenta as
 * alternativas na ordem — o banner nunca fica sem fotografia real.
 */
export const HERO_PHOTO: VehicleImage = {
  ...pexelsImage(10945892, 'a-parked-blue-bmw-car', 'Alex Urezkov', 'BMW azul estacionado em garagem'),
  alternates: [
    pexelsImage(17539749, 'blue-mercedes-benz-car-parked-on-a-rural-road', null, 'Mercedes-AMG azul em estrada'),
    pexelsImage(6920503, 'blue-bmw-car-on-the-road', null, 'BMW azul em rua de Berlim'),
  ],
  fallbackUrl: '/demo/hero-car.svg',
}
