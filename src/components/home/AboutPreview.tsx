import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/layout/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Painel de marca exibido enquanto não houver fotos oficiais da loja/equipe. */
export function BrandPanel({ className = '' }: { className?: string }) {
  return (
    <div className={`relative isolate grid place-items-center overflow-hidden rounded-[var(--radius-card)] bg-brand-deep ${className}`}>
      <div className="absolute -top-1/3 -right-1/4 -z-10 size-[70%] rounded-full bg-brand/60 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-1/3 -left-1/4 -z-10 size-[60%] rounded-full bg-brand-night blur-3xl" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:44px_44px]"
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-4 px-8 text-center">
        <Logo tone="light" className="scale-[1.35]" />
        <p className="mt-4 text-sm text-white/70">
          {siteConfig.city} · {siteConfig.state}
        </p>
      </div>
    </div>
  )
}

export function AboutPreview() {
  const a = content.about
  return (
    <section aria-labelledby="about-title" className="py-20 lg:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {a.image ? (
          // Proporção original preservada (sem recorte): largura total, altura automática
          <img
            src={a.image.src}
            srcSet={a.image.srcSet}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width={a.image.width}
            height={a.image.height}
            alt={a.image.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)]"
          />
        ) : (
          <BrandPanel className="aspect-[4/3]" />
        )}
        <SectionHeading
          id="about-title"
          title={a.title}
          action={
            <ButtonLink to="/sobre" variant="primary" size="lg">
              {a.cta} <ArrowRight size={18} aria-hidden="true" />
            </ButtonLink>
          }
        />
      </div>
    </section>
  )
}
