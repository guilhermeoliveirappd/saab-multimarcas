import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render'
import FinancingPage from './FinancingPage'

describe('FinancingPage', () => {
  it('pre-selects a catalog vehicle and ignores unknown identifiers', async () => {
    renderRoute(<FinancingPage />, { path: '/financiamento', route: '/financiamento?veiculo=bmw-320i-m-sport-2023' })
    expect(await screen.findByText('Veículo selecionado')).toBeInTheDocument()

    renderRoute(<FinancingPage />, { path: '/financiamento', route: '/financiamento?veiculo=<script>' })
    expect(screen.getAllByText('Veículo selecionado')).toHaveLength(1)
  })

  it('walks through the steps without persisting or sending data when no backend is configured', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const user = userEvent.setup()
    renderRoute(<FinancingPage />, { path: '/financiamento', route: '/financiamento?veiculo=bmw-320i-m-sport-2023' })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Revise os 3 campos destacados')

    await user.type(screen.getByLabelText('Nome completo'), 'Maria Souza')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Celular'), '18999998888')
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('heading', { name: 'Endereço' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('CEP'), '19060000')
    await user.type(screen.getByRole('textbox', { name: 'Endereço' }), 'Rua Exemplo')
    await user.type(screen.getByLabelText('Número'), '10')
    await user.type(screen.getByLabelText('Bairro'), 'Centro')
    await user.type(screen.getByLabelText('Cidade'), 'Presidente Prudente')
    await user.selectOptions(screen.getByLabelText('UF'), 'SP')
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    await user.type(screen.getByLabelText('Empresa onde trabalha'), 'Empresa X')
    await user.type(screen.getByLabelText('Profissão / cargo'), 'Analista')
    await user.type(screen.getByLabelText('Renda mensal'), '8000')
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    // Etapa do veículo pré-preenchida a partir do catálogo
    expect(screen.getByLabelText('Marca')).toHaveValue('BMW')
    await user.type(screen.getByLabelText('Valor de entrada'), '90000')
    await user.selectOptions(screen.getByLabelText('Quantidade de parcelas'), '48')
    await user.click(screen.getByRole('button', { name: 'Solicitar financiamento' }))
    expect(screen.getByText(/Confirme a leitura da Política de Privacidade/)).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Solicitar financiamento' }))

    expect(await screen.findByRole('heading', { name: 'Envio online indisponível' })).toBeInTheDocument()
    expect(screen.getByText(/não foram enviados nem armazenados/)).toBeInTheDocument()
    expect(setItem).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(open).not.toHaveBeenCalled()

    // O WhatsApp de apoio identifica apenas o veículo — nenhum dado pessoal
    const href = decodeURIComponent(screen.getByRole('link', { name: /Falar com a equipe/ }).getAttribute('href')!)
    expect(href).toContain('BMW 320i')
    for (const personal of ['Maria', 'maria@exemplo.com', '99999', 'Analista', '8.000']) expect(href).not.toContain(personal)
  })
})
