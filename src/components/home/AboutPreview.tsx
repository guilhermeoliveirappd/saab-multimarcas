import { ArrowRight, Camera } from 'lucide-react'
import { content } from '@/config/content'
import { ButtonLink } from '@/components/ui/Button'
import { ProvisionalBadge } from '@/components/ui/ProvisionalBadge'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function PhotoPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`relative grid place-items-center overflow-hidden rounded-[var(--radius-card)] bg-ink-100 ${className}`}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgba(10,10,11,.035)_22px_23px)]" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center text-ink-500">
        <span className="grid size-14 place-items-center rounded-full bg-white shadow-[var(--shadow-card)]">
          <Camera size={22} aria-hidden="true" />
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  )
}

export function AboutPreview() {
  const a = content.about
  return (
    <section aria-labelledby="about-title" className="py-20 lg:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {a.image ? (
          <img src={a.image} alt={a.imageAlt} loading="lazy" className="aspect-[4/3] w-full rounded-[var(--radius-card)] object-cover" />
        ) : (
          <PhotoPlaceholder label="Espaço para foto da fachada ou da equipe — a receber" className="aspect-[4/3]" />
        )}
        <div>
          <SectionHeading id="about-title" eyebrow={a.eyebrow} title={a.title} description={a.summary} badge={a.provisional && <ProvisionalBadge />} />
          <ButtonLink to="/sobre" variant="dark" size="lg" className="mt-10">
            {a.cta} <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
