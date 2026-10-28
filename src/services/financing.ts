import { env } from '@/config/env'
import type { FormValues } from '@/lib/financing'

/**
 * Envio da ficha de financiamento.
 *
 * OPERACIONAL SOMENTE quando `VITE_FINANCING_ENDPOINT` aponta para um backend
 * HTTPS autorizado (validação no servidor, controle de acesso, antiabuso,
 * retenção definida). Sem isso, nenhum dado sai do navegador.
 *
 * Nunca envie a ficha por WhatsApp, query string, analytics ou console.
 */
export const financingEndpoint = /^https:\/\//.test(env.financingEndpoint) ? env.financingEndpoint : ''
export const isFinancingSubmissionEnabled = Boolean(financingEndpoint)

export type SubmitResult = { status: 'sent' } | { status: 'disabled' } | { status: 'error'; message: string }

export async function submitFinancingRequest(values: FormValues, vehicleId: string | null): Promise<SubmitResult> {
  if (!isFinancingSubmissionEnabled) return { status: 'disabled' }
  try {
    const res = await fetch(financingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ ...values, vehicleId, consentAt: new Date().toISOString() }),
    })
    if (!res.ok) return { status: 'error', message: 'Não foi possível enviar agora. Tente novamente em instantes.' }
    return { status: 'sent' }
  } catch {
    return { status: 'error', message: 'Falha de conexão. Verifique sua internet e tente novamente.' }
  }
}
