import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { useSearchParams } from 'react-router'
import { ShieldCheck } from 'lucide-react'
import { content } from '@/config/content'
import { env } from '@/config/env'
import { trackEvent } from '@/lib/analytics'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { buildWhatsAppUrl, tradeInMessage, type TradeInData } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProvisionalBadge } from '@/components/ui/ProvisionalBadge'

const CURRENT_YEAR = new Date().getFullYear()
type Errors = Partial<Record<keyof TradeInData, string>>

function validate(d: TradeInData): Errors {
  const errors: Errors = {}
  if (!d.brand.trim()) errors.brand = 'Informe a marca.'
  if (!d.model.trim()) errors.model = 'Informe o modelo.'
  const year = Number(d.year)
  if (!/^\d{4}$/.test(d.year) || year < 1950 || year > CURRENT_YEAR + 1) errors.year = `Informe um ano entre 1950 e ${CURRENT_YEAR + 1}.`
  if (d.mileage && !/^\d{1,7}$/.test(d.mileage.replace(/\D/g, ''))) errors.mileage = 'Informe apenas números.'
  return errors
}

export default function SellTradePage() {
  useSeo({ ...STATIC_PAGES['/venda-ou-troca'], path: '/venda-ou-troca' })
  const [params] = useSearchParams()
  const s = content.sellTrade
  const [data, setData] = useState<TradeInData>({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    intent: params.get('intencao') === 'vender' ? 'vender' : 'trocar',
    notes: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const set = (key: keyof TradeInData) => (e: { target: { value: string } }) => {
    setData((d) => ({ ...d, [key]: e.target.value }))
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`trade-${Object.keys(found)[0]}`)?.focus()
      return
    }
    trackEvent({ name: 'trade_in_submit', params: { intent: data.intent } })
    trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'sell_trade_form' } })
    window.open(buildWhatsAppUrl(tradeInMessage(data), env.whatsappNumber), '_blank', 'noopener,noreferrer')
  }

  const field = (key: keyof TradeInData, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`trade-${key}`} className="field-label">
        {label}
      </label>
      <input
        id={`trade-${key}`}
        className={`field ${errors[key] ? 'border-accent' : ''}`}
        value={data[key] ?? ''}
        onChange={set(key)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `trade-${key}-error` : undefined}
        {...props}
      />
      {errors[key] && (
        <p id={`trade-${key}-error`} className="mt-1.5 text-sm text-accent">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <>
      <PageHeader title={s.title} description={s.description} breadcrumb={[{ label: 'Venda ou Troca' }]} />
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-ink-500">Como funciona</p>
            {s.provisionalSteps && <ProvisionalBadge />}
          </div>
          <ol className="mt-8 space-y-8">
            {s.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-950 font-display font-bold text-white">{i + 1}</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-950">{step.title}</h2>
                  <p className="mt-1 leading-relaxed text-ink-500">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={onSubmit} noValidate className="rounded-[1.5rem] bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-ink-100 sm:p-8" aria-labelledby="trade-form-title">
          <h2 id="trade-form-title" className="font-display text-2xl font-bold text-ink-950">
            Dados do seu veículo
          </h2>
          <fieldset className="mt-6">
            <legend className="field-label">Você deseja</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['vender', 'trocar'] as const).map((intent) => (
                <label
                  key={intent}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold ring-1 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    data.intent === intent ? 'bg-ink-950 text-white ring-ink-950' : 'bg-white text-ink-700 ring-ink-200 hover:ring-ink-400'
                  }`}
                >
                  <input type="radio" name="intent" value={intent} checked={data.intent === intent} onChange={() => setData((d) => ({ ...d, intent }))} className="sr-only" />
                  {intent === 'vender' ? 'Vender meu veículo' : 'Trocar por outro'}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {field('brand', 'Marca', { placeholder: 'Ex.: Volkswagen', autoComplete: 'off', required: true })}
            {field('model', 'Modelo', { placeholder: 'Ex.: Polo Highline', autoComplete: 'off', required: true })}
            {field('year', 'Ano', { placeholder: 'Ex.: 2020', inputMode: 'numeric', maxLength: 4, required: true })}
            {field('mileage', 'Quilometragem', { placeholder: 'Ex.: 45000', inputMode: 'numeric' })}
          </div>
          <div className="mt-5">
            <label htmlFor="trade-notes" className="field-label">
              Observações <span className="font-normal normal-case">(opcional)</span>
            </label>
            <textarea id="trade-notes" rows={3} className="field h-auto py-3" value={data.notes} onChange={set('notes')} placeholder="Versão, estado de conservação, veículo de interesse…" maxLength={500} />
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">
            <WhatsAppIcon size={18} />
            {s.button}
          </Button>
          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-500">
            <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
            {s.disclaimer}
          </p>
        </form>
      </div>
    </>
  )
}
