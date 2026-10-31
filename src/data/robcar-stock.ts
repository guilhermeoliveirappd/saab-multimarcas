/**
 * ─── ESTOQUE REAL DA ROBCAR VEÍCULOS ───────────────────────────────────────
 *
 * Cadastre aqui os veículos reais, EXATAMENTE como informados pelo
 * responsável (não estime preço, km, ano, versão nem opcionais).
 * Enquanto esta lista estiver vazia, o site exibe os veículos de exemplo da
 * apresentação privada; com ao menos 1 veículo, passa a exibir SOMENTE estes.
 *
 * Fotos: coloque os originais em `fotos-originais/<slug>/` e rode
 *   npm run photos:estoque
 * O script gera `public/estoque/<slug>/<arquivo>-640.webp` e `-1280.webp`
 * (sem metadados EXIF/GPS). Liste em `imagens` só fotos DESTE carro, na ordem
 * da galeria (capa primeiro). Nunca repita a mesma foto nem use foto de outro carro.
 *
 * (Alternativa futura: cadastrar pelo painel /admin com o Supabase da Robcar.)
 */
import type { Fuel, Transmission, Vehicle, VehicleStatus } from '../types/vehicle'

export type AnguloFoto = 'frente' | 'lateral' | 'traseira' | 'interior' | 'detalhe'

export interface FotoVeiculo {
  /** Nome base gerado pelo script, sem tamanho/extensão. Ex.: 'frente' → frente-640.webp / frente-1280.webp */
  arquivo: string
  angulo?: AnguloFoto
  /** Texto alternativo específico (opcional; há um padrão automático) */
  alt?: string
}

export interface VeiculoEstoque {
  id: string
  /** URL do anúncio: /veiculos/<slug> — minúsculas, números e hífens */
  slug: string
  marca: string
  modelo: string
  versao: string
  anoFabricacao: number
  anoModelo: number
  /** `null` = preço sob consulta */
  preco: number | null
  quilometragem: number
  cambio: Transmission
  combustivel: Fuel
  cor: string
  categoria?: Vehicle['bodyType']
  opcionais: string[]
  descricao: string
  imagens: FotoVeiculo[]
  status: VehicleStatus
  destaque: boolean
}

/**
 * Exemplo de cadastro (não é veículo real — mantenha comentado):
 *
 * {
 *   id: 'rc-001',
 *   slug: 'marca-modelo-versao-2022',
 *   marca: 'Marca', modelo: 'Modelo', versao: 'Versão',
 *   anoFabricacao: 2021, anoModelo: 2022,
 *   preco: 0, quilometragem: 0,
 *   cambio: 'automatico', combustivel: 'flex', cor: 'Cor',
 *   opcionais: ['Opcional 1'], descricao: 'Texto fornecido pela Robcar.',
 *   imagens: [{ arquivo: 'frente', angulo: 'frente' }, { arquivo: 'interior', angulo: 'interior' }],
 *   status: 'disponivel', destaque: true,
 * },
 */
export const robcarStock: VeiculoEstoque[] = []

const ANGULO_LABEL: Record<AnguloFoto, string> = {
  frente: 'frente',
  lateral: 'lateral',
  traseira: 'traseira',
  interior: 'interior',
  detalhe: 'detalhe',
}

/** Converte o cadastro (português) para o modelo usado pelos componentes. */
export function fromStock(v: VeiculoEstoque, index = 0): Vehicle {
  const name = `${v.marca} ${v.modelo} ${v.versao}`
  const base = `/estoque/${v.slug}`
  return {
    id: v.id,
    slug: v.slug,
    brand: v.marca,
    model: v.modelo,
    version: v.versao,
    yearManufacture: v.anoFabricacao,
    yearModel: v.anoModelo,
    mileage: v.quilometragem,
    transmission: v.cambio,
    fuel: v.combustivel,
    color: v.cor,
    bodyType: v.categoria ?? 'outro',
    price: v.preco,
    description: v.descricao,
    options: v.opcionais,
    images: v.imagens.map((foto, i) => ({
      url: `${base}/${foto.arquivo}-1280.webp`,
      srcSet: `${base}/${foto.arquivo}-640.webp 640w, ${base}/${foto.arquivo}-1280.webp 1280w`,
      alt: foto.alt ?? `${name} — ${foto.angulo ? ANGULO_LABEL[foto.angulo] : `foto ${i + 1}`}`,
    })),
    status: v.status,
    featured: v.destaque,
    published: true,
    isDemo: false,
    createdAt: new Date(Date.UTC(2026, 9, 31, 0, 0, -index)).toISOString(),
  }
}
