import { ExternalLink, Star } from 'lucide-react'
import { reviews } from '@/data/reviews'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Depoimentos REAIS e verificáveis (src/data/reviews.ts).
 * Sem avaliações cadastradas, a seção não é renderizada.
 */
export function Testimonials() {
  if (reviews.length === 0) return null
  return (
    <section aria-labelledby="reviews-title" className="bg-ink-50 py-20 lg:py-28">
      <div className="container-site">
        <SectionHeading id="reviews-title" title="O que dizem nossos clientes" className="mb-12" />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.sourceUrl + r.author} className="flex flex-col rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-ink-100">
              <div className="flex gap-0.5 text-amber-500" aria-label={`Nota ${r.rating} de 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} fill={i < r.rating ? 'currentColor' : 'none'} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">“{r.text}”</blockquote>
              <footer className="mt-6 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-950">{r.author}</span>
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-950">
                  Ver origem <ExternalLink size={14} aria-hidden="true" />
                </a>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
