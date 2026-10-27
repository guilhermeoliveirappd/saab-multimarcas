import { useSeo } from '@/lib/seo'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFoundPage() {
  useSeo({ title: 'Página não encontrada', path: '/404', noindex: true })
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-black text-ink-100">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink-950">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-ink-500">O endereço pode ter mudado ou não existe mais.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink to="/" variant="outline">
          Ir para o início
        </ButtonLink>
        <ButtonLink to="/estoque" variant="dark">
          Ver estoque
        </ButtonLink>
      </div>
    </section>
  )
}
