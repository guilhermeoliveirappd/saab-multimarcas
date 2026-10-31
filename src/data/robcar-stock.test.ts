import { fromStock, type VeiculoEstoque } from './robcar-stock'

const veiculo: VeiculoEstoque = {
  id: 'rc-001',
  slug: 'teste-modelo-2022',
  marca: 'Marca',
  modelo: 'Modelo',
  versao: 'Versão',
  anoFabricacao: 2021,
  anoModelo: 2022,
  preco: 100000,
  quilometragem: 12000,
  cambio: 'automatico',
  combustivel: 'flex',
  cor: 'Vermelho',
  opcionais: ['Ar-condicionado'],
  descricao: 'Texto fornecido pela loja.',
  imagens: [{ arquivo: 'frente', angulo: 'frente' }, { arquivo: 'interior', angulo: 'interior', alt: 'Painel' }],
  status: 'disponivel',
  destaque: true,
}

describe('fromStock', () => {
  it('maps the Portuguese inventory model to the UI model without inventing data', () => {
    const v = fromStock(veiculo)
    expect(v).toMatchObject({
      slug: 'teste-modelo-2022',
      brand: 'Marca',
      yearManufacture: 2021,
      yearModel: 2022,
      price: 100000,
      mileage: 12000,
      featured: true,
      isDemo: false,
    })
    expect(v.images).toHaveLength(2)
    expect(v.images[0].url).toBe('/estoque/teste-modelo-2022/frente-1280.webp')
    expect(v.images[0].srcSet).toContain('/estoque/teste-modelo-2022/frente-640.webp 640w')
    expect(v.images[0].alt).toBe('Marca Modelo Versão — frente')
    expect(v.images[1].alt).toBe('Painel')
  })
})
