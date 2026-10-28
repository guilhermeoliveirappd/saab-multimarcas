import type { ImageCredit, VehicleImage } from '../types/vehicle'

/**
 * Fotografias reais de terceiros usadas nos veículos de EXEMPLO e no banner.
 * (Documentação interna: não são fotos do estoque da SAAB.)
 *
 * Fontes e licenças:
 * - Wikimedia Commons (CC0 / CC BY / CC BY-SA): crédito obrigatório — exibido
 *   na galeria e em /creditos-de-imagens.
 * - Pexels (Licença Pexels: uso livre, crédito opcional — mantido por cortesia).
 *
 * Regra das galerias: cada galeria usa SOMENTE fotos do mesmo carro (mesma
 * sessão/vídeo de origem, numeração sequencial), nunca de carros diferentes.
 * Modelos sem um conjunto confiável ficam com uma única foto.
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
  /** Arquivos do Commons do MESMO carro, na ordem da galeria (capa primeiro) */
  files: string[]
  author: string | null
  license: string | null
}

/** Galerias por veículo de exemplo (chave = slug). */
export const STOCK_GALLERIES: Record<string, PhotoSet> = {
  // Mesmo carro azul, numeração sequencial da mesma sessão (Damian B Oh)
  'bmw-320i-m-sport-2023': {
    files: [
      'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(1).jpg',
      'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(4).jpg',
      'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(10).jpg',
      'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(12).jpg',
      'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(16).jpg',
    ],
    author: 'Damian B Oh',
    license: null,
  },
  // Mesmo vídeo de origem (Autosdeprimera): frente, frente, traseira e interior
  'hyundai-hb20-platinum-2023': {
    files: [
      '2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_front_view.png',
      '2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_front_view_02.png',
      '2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_rear_view.png',
      '2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_interior_01.png',
    ],
    author: 'Autosdeprimera',
    license: 'CC BY',
  },
  // Mesmo vídeo de origem (Autosdeprimera): frente, traseira e interior
  'chevrolet-tracker-premier-2021': {
    files: ['Chevrolet_Tracker_2021_(front).png', 'Chevrolet_Tracker_2021_(rear).png', 'Chevrolet_Tracker_2021_(interior).png'],
    author: 'Autosdeprimera',
    license: 'CC BY 3.0',
  },
  // Mesmo vídeo de origem (Garagem do Jabulas): frente e interior
  'volkswagen-nivus-highline-2022': {
    files: [
      'Volkswagen_Nivus_Highline_(Brazil)_front_view_01.png',
      'Volkswagen_Nivus_Highline_(Brazil)_front_view_03.png',
      'Volkswagen_Nivus_Highline_(Brazil)_interior.png',
    ],
    author: 'Garagem do Jabulas',
    license: 'CC BY 3.0',
  },
  // Mesmo carro azul, mesma data e local (Stuttgart-Vaihingen)
  'honda-civic-sport-2021': {
    files: ['Honda_Civic_(2021)_sedan_Sport_DSC_7057.jpg', 'Honda_Civic_(2021)_sedan_Sport_DSC_7054.jpg'],
    author: null,
    license: 'CC BY-SA 4.0',
  },
  // Mesmo carro, mesma data e local (Punta del Este) — NaBUru38
  'fiat-toro-freedom-2022': {
    files: ['Fiat_Toro_2022_1.8_Freedom_in_Punta_del_Este_(front).jpg', 'Fiat_Toro_2022_1.8_Freedom_in_Punta_del_Este_(rear).jpg'],
    author: 'NaBUru38',
    license: 'CC BY-SA 4.0',
  },
  // Quadros consecutivos da mesma sessão (Alexander-93)
  'volkswagen-t-cross-highline-2023': {
    files: ['Volkswagen_T-Cross_(2023)_1X7A2499.jpg', 'Volkswagen_T-Cross_(2023)_1X7A2500.jpg'],
    author: 'Alexander-93',
    license: null,
  },
  // Modelos com uma única foto confiável (sem repetição artificial)
  'toyota-corolla-xei-2022': { files: ['2020_Toyota_Corolla_SE,_front_2.29.20.jpg'], author: 'Kevauto', license: 'CC BY-SA 4.0' },
  'jeep-compass-longitude-2021': { files: ['2021_Jeep_Compass_Limited_4WD_in_Billet_Silver_Metallic,_front_left.jpg'], author: null, license: null },
  'chevrolet-onix-premier-2022': { files: ['2021_Chevrolet_Onix_1.0T_Premier_(Chile)_front_view.jpg'], author: null, license: null },
  'toyota-hilux-srv-2020': { files: ['Toyota_Hilux_Rogue_2nd_facelift_2020_front.jpg'], author: 'EurovisionNim', license: null },
  'hyundai-creta-limited-2023': { files: ['2022_Hyundai_Creta_1.6_Plus_(Chile)_front_view.jpg'], author: null, license: 'CC BY-SA 2.0' },
  'fiat-argo-drive-2021': { files: ['Fiat_Argo_test_drive_car_in_Punta_del_Este_(front).jpg'], author: 'NaBUru38', license: 'CC BY-SA 4.0' },
}

/**
 * Banner principal: BMW azul em garagem (Pexels). Se não carregar, tenta as
 * alternativas na ordem — o banner nunca fica sem fotografia real.
 */
export const HERO_PHOTO: VehicleImage = {
  ...pexelsImage(10945892, 'a-parked-blue-bmw-car', 'Alex Urezkov', 'BMW azul estacionado em garagem'),
  alternates: [
    pexelsImage(17539749, 'blue-mercedes-benz-car-parked-on-a-rural-road', null, 'Mercedes-AMG azul em estrada'),
    commonsImage('BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(1).jpg', { author: 'Damian B Oh', license: null }, { alt: 'BMW Série 3 azul', maxWidth: 1920 }),
  ],
  fallbackUrl: '/demo/hero-car.svg',
}
