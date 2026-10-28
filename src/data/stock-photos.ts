import type { ImageCredit, VehicleImage } from '../types/vehicle'

/**
 * Fotografias reais de referência dos modelos de EXEMPLO, hospedadas no
 * Wikimedia Commons sob licenças livres (CC0 / CC BY / CC BY-SA). Não são
 * fotos do estoque da SAAB: servem apenas para ilustrar o modelo.
 *
 * Os créditos (autor + licença + link) são exibidos no site, como exigem as
 * licenças. Antes de usar em produção, confira cada página de origem.
 * Substitua por fotos oficiais do estoque assim que disponíveis.
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

interface PhotoRef {
  file: string
  author: string | null
  license: string | null
}

/** Uma foto de referência por modelo de exemplo (chave = slug do veículo). */
export const STOCK_PHOTOS: Record<string, PhotoRef> = {
  'honda-civic-exl-2021': { file: 'Honda_Civic_(2021)_sedan_Sport_DSC_7057.jpg', author: null, license: 'CC BY-SA 4.0' },
  'toyota-corolla-xei-2022': { file: '2020_Toyota_Corolla_SE,_front_2.29.20.jpg', author: 'Kevauto', license: 'CC BY-SA 4.0' },
  'jeep-compass-longitude-2021': { file: '2021_Jeep_Compass_Limited_4WD_in_Billet_Silver_Metallic,_front_left.jpg', author: null, license: null },
  'volkswagen-t-cross-highline-2023': { file: 'Volkswagen_T-Cross_(2023)_1X7A2499.jpg', author: null, license: null },
  'hyundai-hb20-platinum-2023': { file: '2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_front_view.png', author: 'Autosdeprimera', license: 'CC BY' },
  'chevrolet-onix-premier-2022': { file: '2021_Chevrolet_Onix_1.0T_Premier_(Chile)_front_view.jpg', author: null, license: null },
  'toyota-hilux-srv-2020': { file: 'Toyota_Hilux_Rogue_2nd_facelift_2020_front.jpg', author: 'EurovisionNim', license: null },
  'fiat-toro-volcano-2022': { file: 'Fiat_Toro_Volcano_front.jpg', author: 'Diego HC', license: 'CC0 1.0' },
  'volkswagen-nivus-highline-2022': { file: 'Volkswagen_Nivus_Brazil_front.jpg', author: 'Mateusmatsuda', license: 'CC BY-SA 4.0' },
  'hyundai-creta-limited-2023': { file: '2022_Hyundai_Creta_1.6_Plus_(Chile)_front_view.jpg', author: null, license: 'CC BY-SA 2.0' },
  'bmw-320i-m-sport-2020': { file: 'BMW_320i_M_Sport_(G20)_front.jpg', author: 'Tokumeigakarinoaoshima', license: 'CC BY-SA 4.0' },
  'fiat-argo-drive-2021': { file: 'Fiat_Argo_test_drive_car_in_Punta_del_Este_(front).jpg', author: 'NaBUru38', license: 'CC BY-SA 4.0' },
  'chevrolet-tracker-premier-2022': { file: 'Chevrolet_Tracker_2021_(front).png', author: 'Autosdeprimera', license: 'CC BY' },
}

/** Fotografia do banner principal (BMW Série 3 azul). */
export const HERO_PHOTO = commonsImage(
  'BMW_G20_LCI_320i_M_Sport_M_Portimao_Blue_Metallic_(1).jpg',
  { author: null, license: null },
  { alt: 'BMW Série 3 azul', fallbackUrl: '/demo/hero-car.svg', maxWidth: 1920 },
)
