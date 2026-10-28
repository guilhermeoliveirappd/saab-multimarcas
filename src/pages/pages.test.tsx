import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render'
import InventoryPage from './InventoryPage'
import VehicleDetailPage from './VehicleDetailPage'
import SellTradePage from './SellTradePage'

describe('InventoryPage', () => {
  it('applies filters coming from the URL', async () => {
    renderRoute(<InventoryPage />, { path: '/estoque', route: '/estoque?marca=Toyota' })
    expect(await screen.findByText(/veículos encontrados/)).toHaveTextContent('2 veículos encontrados')
    expect(screen.getByRole('link', { name: 'Corolla' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hilux' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Civic' })).not.toBeInTheDocument()
  })

  it('shows the empty state and clears filters', async () => {
    renderRoute(<InventoryPage />, { path: '/estoque', route: '/estoque?precoMin=900000' })
    expect(await screen.findByText('Nenhum veículo encontrado')).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0])
    expect(await screen.findByText(/veículos encontrados/)).toHaveTextContent('12 veículos encontrados')
  })

  it('loads more results incrementally', async () => {
    renderRoute(<InventoryPage />, { path: '/estoque', route: '/estoque' })
    await screen.findByText(/veículos encontrados/)
    expect(screen.getAllByRole('article')).toHaveLength(9)
    await userEvent.click(screen.getByRole('button', { name: 'Carregar mais veículos' }))
    expect(screen.getAllByRole('article')).toHaveLength(12)
  })
})

describe('VehicleDetailPage', () => {
  it('renders the vehicle with a contextual WhatsApp link', async () => {
    renderRoute(<VehicleDetailPage />, { path: '/veiculos/:slug', route: '/veiculos/honda-civic-sport-2021' })
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Civic')
    const links = screen.getAllByRole('link', { name: /Tenho interesse/ })
    const href = links[0].getAttribute('href')!
    expect(href).toMatch(/^https:\/\/wa\.me\//)
    expect(decodeURIComponent(href)).toContain('Honda / Civic / Sport 2.0 CVT / 2020/2021')
    const related = screen.getByRole('heading', { name: 'Veículos relacionados' }).closest('section')!
    expect(within(related).getAllByRole('article')).toHaveLength(3)
  })

  it('shows a not-found state for unknown slugs', async () => {
    renderRoute(<VehicleDetailPage />, { path: '/veiculos/:slug', route: '/veiculos/nao-existe' })
    expect(await screen.findByText('Este anúncio não está disponível')).toBeInTheDocument()
  })
})

describe('SellTradePage', () => {
  it('validates required fields before opening WhatsApp', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderRoute(<SellTradePage />, { path: '/venda-ou-troca', route: '/venda-ou-troca' })
    await userEvent.click(screen.getByRole('button', { name: /Solicitar avaliação/ }))
    expect(screen.getByText('Informe a marca.')).toBeInTheDocument()
    expect(open).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Marca'), 'Fiat')
    await userEvent.type(screen.getByLabelText('Modelo'), 'Uno')
    await userEvent.type(screen.getByLabelText('Ano'), '2015')
    await userEvent.type(screen.getByLabelText('Quilometragem'), '98000')
    await userEvent.click(screen.getByRole('button', { name: /Solicitar avaliação/ }))
    expect(open).toHaveBeenCalledTimes(1)
    expect(decodeURIComponent(open.mock.calls[0][0] as string)).toContain('• Modelo: Uno')
  })
})
