import { FINANCING_STEPS, activeFields, isValidCpf, maskCep, maskCurrency, maskPhone, validateField, validateStep } from './financing'

const step = (id: string) => FINANCING_STEPS.find((s) => s.id === id)!

describe('financing masks', () => {
  it('formats phone, CEP and currency', () => {
    expect(maskPhone('18999998888')).toBe('(18) 99999-8888')
    expect(maskPhone('1832221111')).toBe('(18) 3222-1111')
    expect(maskCep('19060000')).toBe('19060-000')
    expect(maskCurrency('0012990000')).toBe('R$ 12.990.000')
    expect(maskCurrency('abc')).toBe('')
  })

  it('validates CPF check digits', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('529.982.247-24')).toBe(false)
  })
})

describe('data minimization', () => {
  it('keeps sensitive and pending-validation fields off by default', () => {
    const names = FINANCING_STEPS.flatMap((s) => activeFields(s).map((f) => f.name))
    for (const sensitive of ['cpf', 'rg', 'cnh', 'nascimento', 'nomeMae', 'tipoResidencia', 'tempoResidencia', 'tempoEmprego']) {
      expect(names).not.toContain(sensitive)
    }
    expect(names).toEqual(expect.arrayContaining(['nome', 'email', 'celular', 'cep', 'renda', 'marca', 'parcelas']))
  })

  it('can enable sensitive fields explicitly', () => {
    const names = activeFields(step('pessoal'), { sensitiveFields: true, pendingValidationFields: false }).map((f) => f.name)
    expect(names).toContain('cpf')
  })
})

describe('financing validation', () => {
  it('requires the personal fields and checks formats', () => {
    expect(Object.keys(validateStep(step('pessoal'), {}))).toEqual(['nome', 'email', 'celular'])
    expect(validateStep(step('pessoal'), { nome: 'Maria Souza', email: 'maria@exemplo.com', celular: '(18) 99999-8888' })).toEqual({})
    expect(validateStep(step('pessoal'), { nome: 'Maria', email: 'x@y', celular: '999' })).toMatchObject({
      nome: expect.any(String),
      email: expect.any(String),
      celular: expect.any(String),
    })
  })

  it('checks money relationships between vehicle value, down payment and financed amount', () => {
    const veiculo = step('veiculo')
    const entrada = veiculo.fields.find((f) => f.name === 'entrada')!
    const financiado = veiculo.fields.find((f) => f.name === 'valorFinanciado')!
    expect(validateField(entrada, 'R$ 200.000', { valorVeiculo: 'R$ 150.000' })).toMatch(/menor que o valor/)
    expect(validateField(entrada, 'R$ 50.000', { valorVeiculo: 'R$ 150.000' })).toBeNull()
    expect(validateField(financiado, 'R$ 160.000', { valorVeiculo: 'R$ 150.000' })).toMatch(/não pode superar/)
  })
})
