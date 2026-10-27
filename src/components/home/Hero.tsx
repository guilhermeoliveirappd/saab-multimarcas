import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { QuickSearch } from '@/components/vehicles/QuickSearch'

export function Hero() {
  const { hero } = content
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative isolate overflow-hidden bg-ink-950 pt-[72px] lg:pt-20">
        <img
          src={hero.image}
          alt=""
          width={2400}
          height={1350}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-[75%_center] opacity-90 lg:object-[right_center]"
        />
        {/* Véu para legibilidade do texto sobre a imagem */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" aria-hidden="true" />

        <div className="container-site flex min-h-[600px] flex-col justify-center pt-16 pb-40 sm:min-h-[640px] lg:min-h-[720px] lg:pb-48">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow flex items-center gap-3 text-ink-300">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="mt-6 font-display text-[2.6rem] leading-[0.98] font-extrabold text-balance text-white sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-300 sm:text-lg">{hero.subheadline}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/estoque" size="lg" variant="primary">
                {hero.primaryCta}
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
              <WhatsAppButton location="hero" size="lg" variant="outline-light">
                {hero.secondaryCta}
              </WhatsAppButton>
            </div>
          </div>
        </div>
        {hero.imageIsIllustration && (
          <p className="absolute right-4 bottom-28 text-[10px] tracking-wide text-white/40 uppercase sm:right-6 lg:bottom-32">Imagem ilustrativa</p>
        )}
      </div>

      <div className="container-site relative z-10 -mt-24 lg:-mt-28">
        <QuickSearch />
      </div>
    </section>
  )
}
