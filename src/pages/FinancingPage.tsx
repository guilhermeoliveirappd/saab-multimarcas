import { content } from '@/config/content'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { financingMessage } from '@/lib/whatsapp'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

/** Página informativa — a rota só existe quando `siteConfig.services.financing` é true. */
export default function FinancingPage() {
  useSeo({ ...STATIC_PAGES['/financiamento'], path: '/financiamento' })
  const f = content.financing
  return (
    <>
      <PageHeader title={f.title} description={f.description} breadcrumb={[{ label: f.title }]} />
      <div className="container-site max-w-3xl py-14 text-center lg:py-20">
        <h2 className="font-display text-2xl font-bold text-ink-950">Como funciona</h2>
        <ol className="mt-6 space-y-4">
          {f.steps.map((step, i) => (
            <li key={step} className="flex flex-col items-center gap-3 rounded-2xl bg-ink-50 p-5 ring-1 ring-ink-100">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-white">{i + 1}</span>
              <p className="text-ink-700">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-ink-500">{f.disclaimer}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <WhatsAppButton location="financing" message={financingMessage()} size="lg">
            {f.cta}
          </WhatsAppButton>
          <ButtonLink to="/estoque" variant="outline" size="lg">
            Ver estoque
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
