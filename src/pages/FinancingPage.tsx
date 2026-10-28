import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Info, Loader2, ShieldCheck } from 'lucide-react'
import { content } from '@/config/content'
import { useVehicles } from '@/hooks/vehicles-context'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import {
  FINANCING_STEPS,
  activeFields,
  applyMask,
  maskCurrency,
  validateStep,
  type FieldDef,
  type FormErrors,
  type FormValues,
} from '@/lib/financing'
import { formatPrice, formatYears, vehicleFullName } from '@/lib/format'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { financingMessage } from '@/lib/whatsapp'
import { submitFinancingRequest } from '@/services/financing'
import type { Vehicle } from '@/types/vehicle'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Outcome = null | 'sent' | 'disabled' | { error: string }

function Field({ field, value, error, onChange }: { field: FieldDef; value: string; error?: string; onChange: (v: string) => void }) {
  const id = `fin-${field.name}`
  const describedBy = error ? `${id}-error` : undefined
  const common = {
    id,
    name: field.name,
    value,
    required: field.required,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    autoComplete: field.autoComplete ?? 'off',
    className: cn('field', error && 'border-danger'),
  }
  const inputMode =
    field.kind === 'phone' ? 'tel' : field.kind === 'email' ? 'email' : ['cep', 'currency', 'year', 'cpf'].includes(field.kind) ? 'numeric' : undefined

  return (
    <div className={cn(field.wide && 'sm:col-span-2')}>
      <label htmlFor={id} className="field-label">
        {field.label}
        {!field.required && <span className="ml-1 font-normal tracking-normal normal-case">(opcional)</span>}
      </label>
      {field.kind === 'select' ? (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.kind === 'textarea' ? (
        <textarea {...common} rows={3} maxLength={500} placeholder={field.placeholder} className={cn(common.className, 'h-auto py-3')} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...common}
          type={field.kind === 'email' ? 'email' : field.kind === 'date' ? 'date' : field.kind === 'phone' ? 'tel' : 'text'}
          inputMode={inputMode}
          placeholder={field.placeholder}
          onChange={(e) => onChange(applyMask(field.kind, e.target.value))}
        />
      )}
      {error && (
        <p id={describedBy} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function VehicleSummary({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink-100">
      {vehicle.images[0] && (
        <div className="aspect-[16/10] bg-ink-100">
          <Photo image={vehicle.images[0]} sizes="360px" loading="lazy" className="size-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <p className="eyebrow text-ink-400">Veículo selecionado</p>
        <p className="mt-1 font-display text-lg font-bold text-ink-950">
          {vehicle.brand} {vehicle.model}
        </p>
        <p className="text-sm text-ink-500">
          {vehicle.version} · {formatYears(vehicle)}
        </p>
        <p className="mt-3 font-display text-xl font-bold text-ink-950">{formatPrice(vehicle.price)}</p>
        <Link to={`/veiculos/${vehicle.slug}`} className="mt-2 inline-flex text-sm font-medium text-accent hover:underline">
          Ver anúncio
        </Link>
      </div>
    </div>
  )
}

export default function FinancingPage() {
  useSeo({ ...STATIC_PAGES['/financiamento'], path: '/financiamento' })
  const f = content.financing
  const { vehicles } = useVehicles()
  const [params] = useSearchParams()

  // Veículo pré-selecionado: o parâmetro é só um identificador; os dados vêm do catálogo
  const slug = (params.get('veiculo') ?? '').toLowerCase()
  const vehicle = useMemo(
    () => (/^[a-z0-9-]{3,120}$/.test(slug) ? (vehicles.find((v) => v.slug === slug && v.status !== 'vendido') ?? null) : null),
    [vehicles, slug],
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<FormValues>({}) // somente em memória — nunca persistido
  const [errors, setErrors] = useState<FormErrors>({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Pré-preenche os dados do veículo selecionado (uma vez por veículo)
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null)
  if (vehicle && prefilledFor !== vehicle.id) {
    setPrefilledFor(vehicle.id)
    setValues((v) => ({
      ...v,
      marca: vehicle.brand,
      modelo: `${vehicle.model} ${vehicle.version}`,
      ano: String(vehicle.yearModel),
      ...(vehicle.price != null && { valorVeiculo: maskCurrency(String(vehicle.price)) }),
    }))
  }

  const step = FINANCING_STEPS[stepIndex]
  const fields = activeFields(step)
  const isLast = stepIndex === FINANCING_STEPS.length - 1
  const errorList = Object.entries(errors)

  // Leva o foco ao resumo de erros apenas a cada tentativa de avançar/enviar
  // (nunca enquanto a pessoa digita).
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus()
  }, [attempt])

  const goTo = (i: number) => {
    setStepIndex(i)
    setErrors({})
    trackEvent({ name: 'financing_step', params: { step: i + 1 } })
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const update = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name])
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateStep(step, values)
    setErrors(found)
    if (Object.keys(found).length > 0) return setAttempt((n) => n + 1)
    if (!isLast) return goTo(stepIndex + 1)

    // Revalida todas as etapas antes do envio
    for (let i = 0; i < FINANCING_STEPS.length; i++) {
      const stepErrors = validateStep(FINANCING_STEPS[i], values)
      if (Object.keys(stepErrors).length > 0) {
        setStepIndex(i)
        setErrors(stepErrors)
        return setAttempt((n) => n + 1)
      }
    }
    if (!consent) {
      setConsentError(true)
      document.getElementById('fin-consent')?.focus()
      return
    }
    setSubmitting(true)
    const result = await submitFinancingRequest(values, vehicle?.id ?? null)
    setSubmitting(false)
    trackEvent({ name: 'financing_submit', params: { status: result.status } })
    if (result.status === 'sent') {
      setValues({})
      setOutcome('sent')
    } else if (result.status === 'disabled') setOutcome('disabled')
    else setOutcome({ error: result.message })
  }

  const whatsappMessage = financingMessage(vehicle ? `${vehicleFullName(vehicle)}` : undefined)

  return (
    <>
      {/* Hero compacto */}
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        <div className="absolute -top-32 left-1/2 -z-10 h-72 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-brand/40 blur-3xl" aria-hidden="true" />
        <div className="container-site flex flex-col items-center py-12 text-center lg:py-16">
          <nav aria-label="Trilha de navegação">
            <ol className="flex items-center gap-1 text-xs text-white/60">
              <li>
                <Link to="/" className="hover:text-white">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li aria-current="page" className="text-white/85">
                Financiamento
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 font-display text-[1.9rem] leading-tight font-bold sm:text-5xl">{f.title}</h1>
          <span className="mt-5 h-1 w-10 rounded-full bg-brand-light" aria-hidden="true" />
          <p className="mt-5 max-w-lg text-[15px] text-balance text-white/80 sm:text-lg">{f.description}</p>
        </div>
      </section>

      <div className="bg-ink-50">
        <div className="container-site grid gap-8 py-10 lg:grid-cols-[1fr_340px] lg:py-14">
          <div>
            {/* Indicador de progresso */}
            <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Etapas da ficha">
              {FINANCING_STEPS.map((s, i) => {
                const done = i < stepIndex
                const current = i === stepIndex
                return (
                  <li key={s.id} aria-current={current ? 'step' : undefined}>
                    <button
                      type="button"
                      disabled={i > stepIndex || outcome !== null}
                      onClick={() => goTo(i)}
                      className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                    >
                      <span className={cn('h-1.5 rounded-full transition-colors', done || current ? 'bg-accent' : 'bg-ink-200')} aria-hidden="true" />
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                            done ? 'bg-accent text-white' : current ? 'bg-ink-950 text-white' : 'bg-white text-ink-400 ring-1 ring-ink-200',
                          )}
                        >
                          {done ? <Check size={13} aria-hidden="true" /> : i + 1}
                        </span>
                        <span className={cn('hidden text-xs font-semibold sm:block', current ? 'text-ink-950' : 'text-ink-500')}>{s.title}</span>
                        <span className="sr-only">
                          {done ? ' (concluída)' : current ? ' (etapa atual)' : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="rounded-[1.5rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink-100 sm:p-8">
              {outcome === 'sent' ? (
                <div role="status" className="flex flex-col items-center py-8 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-accent text-white">
                    <Check size={26} aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold text-ink-950">Solicitação enviada</h2>
                  <p className="mt-2 max-w-sm text-balance text-ink-500">A equipe da SAAB vai analisar sua ficha e entrar em contato.</p>
                </div>
              ) : outcome === 'disabled' ? (
                <div role="status" className="flex flex-col items-center py-8 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-accent">
                    <Info size={26} aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold text-ink-950">Envio online indisponível</h2>
                  <p className="mt-2 max-w-md text-balance text-ink-500">
                    Seus dados não foram enviados nem armazenados. Para seguir com o financiamento, fale com a equipe.
                  </p>
                  <WhatsAppButton location="financing_unavailable" message={whatsappMessage} size="lg" className="mt-6">
                    Falar com a equipe
                  </WhatsAppButton>
                  <button type="button" onClick={() => setOutcome(null)} className="mt-4 text-sm font-medium text-ink-500 hover:text-ink-950">
                    Voltar à ficha
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate aria-labelledby="fin-step-title">
                  <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">
                    Etapa {stepIndex + 1} de {FINANCING_STEPS.length}
                  </p>
                  <h2 id="fin-step-title" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-2xl font-bold text-ink-950 outline-none">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-ink-500">{step.description}</p>

                  {errorList.length > 0 && (
                    <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800 outline-none">
                      <p className="font-semibold">Revise {errorList.length === 1 ? 'o campo destacado' : `os ${errorList.length} campos destacados`}:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {errorList.map(([name, message]) => (
                          <li key={name}>
                            <a href={`#fin-${name}`} className="underline underline-offset-2">
                              {fields.find((fl) => fl.name === name)?.label}: {message}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {fields.map((field) => (
                      <Field key={field.name} field={field} value={values[field.name] ?? ''} error={errors[field.name]} onChange={(v) => update(field.name, v)} />
                    ))}
                  </div>

                  {isLast && (
                    <div className="mt-6 rounded-xl bg-ink-50 p-4 ring-1 ring-ink-100">
                      <label className="flex items-start gap-3 text-sm text-ink-700">
                        <input
                          id="fin-consent"
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked)
                            setConsentError(false)
                          }}
                          aria-invalid={consentError}
                          aria-describedby={consentError ? 'fin-consent-error' : undefined}
                          className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]"
                        />
                        <span>
                          Li a{' '}
                          <Link to="/politica-de-privacidade" className="font-medium text-accent underline-offset-2 hover:underline">
                            Política de Privacidade
                          </Link>{' '}
                          e concordo com o uso destes dados para a análise da minha solicitação de financiamento.
                        </span>
                      </label>
                      {consentError && (
                        <p id="fin-consent-error" className="mt-2 text-sm text-danger">
                          Confirme a leitura da Política de Privacidade para continuar.
                        </p>
                      )}
                    </div>
                  )}

                  {outcome && typeof outcome === 'object' && (
                    <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
                      {outcome.error}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    {stepIndex > 0 ? (
                      <Button variant="outline" size="lg" onClick={() => goTo(stepIndex - 1)}>
                        <ArrowLeft size={17} aria-hidden="true" /> Voltar
                      </Button>
                    ) : (
                      <span />
                    )}
                    <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                      {submitting && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
                      {isLast ? 'Solicitar financiamento' : 'Continuar'}
                      {!isLast && <ArrowRight size={17} aria-hidden="true" />}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            {vehicle && <VehicleSummary vehicle={vehicle} />}
            <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink-100">
              <p className="flex items-center gap-2 font-semibold text-ink-950">
                <ShieldCheck size={18} className="text-accent" aria-hidden="true" /> Seus dados
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.privacyNote}</p>
              <Link to="/politica-de-privacidade" className="mt-3 inline-flex text-sm font-medium text-accent hover:underline">
                Política de Privacidade
              </Link>
            </div>
            <p className="px-1 text-xs leading-relaxed text-ink-400">{f.disclaimer}</p>
          </aside>
        </div>
      </div>
    </>
  )
}
