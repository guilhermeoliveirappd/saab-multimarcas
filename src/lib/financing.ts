/**
 * Ficha de financiamento — definição de campos, máscaras e validação (puro).
 *
 * Minimização de dados (LGPD): campos sensíveis (CPF, RG, CNH, filiação, data de
 * nascimento) e campos cuja necessidade ainda não foi validada pela Robcar ficam
 * DESLIGADOS por padrão em `FINANCING_FLAGS`. Só ative após validação jurídica
 * e com o backend seguro configurado.
 */

export const FINANCING_FLAGS = {
  /** CPF, RG, CNH, data de nascimento e filiação — exige validação jurídica */
  sensitiveFields: false,
  /** Tipo/tempo de residência e tempo de emprego — aguardando validação da Robcar */
  pendingValidationFields: false,
}

export type FieldKind = 'text' | 'email' | 'phone' | 'cep' | 'currency' | 'year' | 'select' | 'textarea' | 'cpf' | 'date'

export interface FieldDef {
  name: string
  label: string
  kind: FieldKind
  required?: boolean
  autoComplete?: string
  options?: { value: string; label: string }[]
  /** Ocupa a linha inteira no grid do desktop */
  wide?: boolean
  placeholder?: string
  /** Dado pessoal sensível ou de alto risco — desligado por padrão */
  sensitive?: boolean
  /** Necessidade ainda não validada pela Robcar — desligado por padrão */
  pendingValidation?: boolean
}

export interface StepDef {
  id: 'pessoal' | 'residencial' | 'profissional' | 'veiculo'
  title: string
  description: string
  fields: FieldDef[]
}

export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

const INSTALLMENTS = [12, 18, 24, 36, 48, 60]

export const FINANCING_STEPS: StepDef[] = [
  {
    id: 'pessoal',
    title: 'Dados pessoais',
    description: 'Para a equipe entrar em contato com você.',
    fields: [
      { name: 'nome', label: 'Nome completo', kind: 'text', required: true, autoComplete: 'name', wide: true },
      { name: 'email', label: 'E-mail', kind: 'email', required: true, autoComplete: 'email' },
      { name: 'celular', label: 'Celular', kind: 'phone', required: true, autoComplete: 'tel-national', placeholder: '(18) 99999-9999' },
      { name: 'cpf', label: 'CPF', kind: 'cpf', required: true, sensitive: true },
      { name: 'nascimento', label: 'Data de nascimento', kind: 'date', required: true, sensitive: true },
      { name: 'rg', label: 'RG', kind: 'text', sensitive: true },
      { name: 'cnh', label: 'CNH', kind: 'text', sensitive: true },
      { name: 'nomeMae', label: 'Nome da mãe', kind: 'text', sensitive: true, wide: true },
    ],
  },
  {
    id: 'residencial',
    title: 'Endereço',
    description: 'Onde você mora atualmente.',
    fields: [
      { name: 'cep', label: 'CEP', kind: 'cep', required: true, autoComplete: 'postal-code', placeholder: '00000-000' },
      { name: 'endereco', label: 'Endereço', kind: 'text', required: true, autoComplete: 'address-line1', wide: true },
      { name: 'numero', label: 'Número', kind: 'text', required: true },
      { name: 'complemento', label: 'Complemento', kind: 'text', autoComplete: 'address-line2' },
      { name: 'bairro', label: 'Bairro', kind: 'text', required: true },
      { name: 'cidade', label: 'Cidade', kind: 'text', required: true, autoComplete: 'address-level2' },
      { name: 'uf', label: 'UF', kind: 'select', required: true, autoComplete: 'address-level1', options: UFS.map((u) => ({ value: u, label: u })) },
      {
        name: 'tipoResidencia',
        label: 'Tipo de residência',
        kind: 'select',
        pendingValidation: true,
        options: ['Própria', 'Alugada', 'Familiar', 'Outra'].map((v) => ({ value: v, label: v })),
      },
      { name: 'tempoResidencia', label: 'Tempo de residência', kind: 'text', pendingValidation: true, placeholder: 'Ex.: 3 anos' },
    ],
  },
  {
    id: 'profissional',
    title: 'Dados profissionais',
    description: 'Informações usadas na análise de crédito.',
    fields: [
      { name: 'empresa', label: 'Empresa onde trabalha', kind: 'text', required: true, autoComplete: 'organization', wide: true },
      { name: 'profissao', label: 'Profissão / cargo', kind: 'text', required: true, autoComplete: 'organization-title' },
      { name: 'renda', label: 'Renda mensal', kind: 'currency', required: true },
      { name: 'tempoEmprego', label: 'Tempo no emprego atual', kind: 'text', pendingValidation: true, placeholder: 'Ex.: 2 anos' },
    ],
  },
  {
    id: 'veiculo',
    title: 'Veículo e financiamento',
    description: 'O carro escolhido e como você quer pagar.',
    fields: [
      { name: 'marca', label: 'Marca', kind: 'text', required: true },
      { name: 'modelo', label: 'Modelo', kind: 'text', required: true },
      { name: 'ano', label: 'Ano', kind: 'year', required: true, placeholder: '2023' },
      { name: 'valorVeiculo', label: 'Valor do veículo', kind: 'currency', required: true },
      { name: 'entrada', label: 'Valor de entrada', kind: 'currency', required: true },
      { name: 'valorFinanciado', label: 'Valor que pretende financiar', kind: 'currency' },
      {
        name: 'parcelas',
        label: 'Quantidade de parcelas',
        kind: 'select',
        required: true,
        options: INSTALLMENTS.map((n) => ({ value: String(n), label: `${n} parcelas` })),
      },
      { name: 'observacoes', label: 'Observações', kind: 'textarea', wide: true, placeholder: 'Opcional' },
    ],
  },
]

/** Campos efetivamente ativos, conforme as flags de minimização. */
export function activeFields(step: StepDef, flags = FINANCING_FLAGS): FieldDef[] {
  return step.fields.filter((f) => (!f.sensitive || flags.sensitiveFields) && (!f.pendingValidation || flags.pendingValidationFields))
}

// ─── Máscaras ───────────────────────────────────────────────────────────────

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

export function maskPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function maskCep(v: string): string {
  const d = onlyDigits(v).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function maskCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11)
  return d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
}

const brl = new Intl.NumberFormat('pt-BR')
export function maskCurrency(v: string): string {
  const d = onlyDigits(v).replace(/^0+/, '').slice(0, 9)
  return d ? `R$ ${brl.format(Number(d))}` : ''
}

export function applyMask(kind: FieldKind, value: string): string {
  switch (kind) {
    case 'phone':
      return maskPhone(value)
    case 'cep':
      return maskCep(value)
    case 'cpf':
      return maskCpf(value)
    case 'currency':
      return maskCurrency(value)
    case 'year':
      return onlyDigits(value).slice(0, 4)
    default:
      return value
  }
}

// ─── Validação ──────────────────────────────────────────────────────────────

export type FormValues = Record<string, string>
export type FormErrors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const check = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i)
    const r = (sum * 10) % 11
    return r === 10 ? 0 : r
  }
  return check(9) === Number(d[9]) && check(10) === Number(d[10])
}

const money = (v: string | undefined) => Number(onlyDigits(v ?? '') || 0)

export function validateField(field: FieldDef, value: string, values: FormValues): string | null {
  const v = value.trim()
  if (!v) return field.required ? 'Campo obrigatório.' : null
  switch (field.kind) {
    case 'email':
      return EMAIL_RE.test(v) ? null : 'Informe um e-mail válido.'
    case 'phone':
      return onlyDigits(v).length >= 10 ? null : 'Informe o celular com DDD.'
    case 'cep':
      return onlyDigits(v).length === 8 ? null : 'Informe um CEP com 8 dígitos.'
    case 'cpf':
      return isValidCpf(v) ? null : 'CPF inválido.'
    case 'year': {
      const y = Number(v)
      const max = new Date().getFullYear() + 1
      return y >= 1980 && y <= max ? null : `Informe um ano entre 1980 e ${max}.`
    }
    case 'currency': {
      if (money(v) <= 0) return 'Informe um valor maior que zero.'
      if (field.name === 'entrada' && money(values.valorVeiculo) > 0 && money(v) >= money(values.valorVeiculo))
        return 'A entrada deve ser menor que o valor do veículo.'
      if (field.name === 'valorFinanciado' && money(values.valorVeiculo) > 0 && money(v) > money(values.valorVeiculo))
        return 'O valor financiado não pode superar o valor do veículo.'
      return null
    }
    case 'text':
      if (field.name === 'nome' && v.split(/\s+/).length < 2) return 'Informe nome e sobrenome.'
      return v.length > 120 ? 'Texto muito longo.' : null
    case 'textarea':
      return v.length > 500 ? 'Use no máximo 500 caracteres.' : null
    default:
      return null
  }
}

export function validateStep(step: StepDef, values: FormValues, flags = FINANCING_FLAGS): FormErrors {
  const errors: FormErrors = {}
  for (const field of activeFields(step, flags)) {
    const error = validateField(field, values[field.name] ?? '', values)
    if (error) errors[field.name] = error
  }
  return errors
}
