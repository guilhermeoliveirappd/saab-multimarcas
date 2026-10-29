import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { QuickSearch } from '@/components/vehicles/QuickSearch'

export function Hero() {
  const { hero } = content
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative isolate overflow-hidden bg-ink-950 pt-[72px] lg:pt-20">
        <Photo
          image={hero.image}
          alt=""
          sizes="100vw"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
        {/* Véus para garantir contraste do texto branco sobre qualquer foto */}
        <div className="absolute inset-0 -z-10 bg-ink-950/45" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_center,rgba(10,10,11,.6)_0%,rgba(10,10,11,0)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink-950/70 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink-950 to-transparent" aria-hidden="true" />

        <div className="container-site flex min-h-[560px] flex-col items-center justify-center pt-12 pb-36 text-center sm:min-h-[620px] lg:min-h-[700px] lg:pb-44">
          <div className="flex max-w-4xl animate-fade-up flex-col items-center">
            <h1
              id="hero-title"
              className="font-display text-[clamp(1.85rem,8.4vw,5rem)] leading-[1.06] font-extrabold text-white [text-shadow:0_2px_24px_rgba(0,0,0,.35)]"
            >
              {hero.headline.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {/* Ajuste óptico: o ponto final da Plus Jakarta Sans tem recuo largo em pesos altos */}
                  {line.endsWith('.') ? (
                    <>
                      {line.slice(0, -1)}
                      <span className="-ml-[0.09em]">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-balance text-white/85 sm:max-w-xl sm:text-lg">{hero.subheadline}</p>
            <ButtonLink to="/estoque" size="lg" variant="primary" className="mt-9 px-9">
              {hero.primaryCta}
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-site relative z-10 -mt-24 lg:-mt-28">
        <QuickSearch />
      </div>
    </section>
  )
}
