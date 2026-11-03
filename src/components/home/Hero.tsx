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
        {/*
          Enquadramento sem cortes: a foto é exibida INTEIRA (object-contain) e as
          bordas são preenchidas por uma versão desfocada e escurecida da mesma foto.
          Assim o carro nunca é cortado, em qualquer proporção de tela.
        */}
        <Photo
          image={hero.image}
          alt=""
          aria-hidden="true"
          sizes="100vw"
          decoding="async"
          className="absolute inset-0 -z-30 size-full scale-110 object-cover blur-2xl brightness-[.45]"
        />
        <Photo
          image={hero.image}
          alt={hero.image.alt ?? ''}
          sizes="(min-width: 1024px) 1400px, 100vw"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-x-0 top-[72px] bottom-24 -z-20 mx-auto h-[calc(100%-72px-6rem)] w-full object-contain object-center [mask-image:radial-gradient(ellipse_75%_70%_at_center,#000_55%,transparent_100%)] lg:top-20 lg:bottom-28 lg:h-[calc(100%-5rem-7rem)] lg:object-bottom lg:[mask-image:radial-gradient(ellipse_70%_80%_at_50%_70%,#000_50%,transparent_100%)]"
        />
        {/* Overlay escuro discreto para a legibilidade da headline */}
        <div className="absolute inset-0 -z-10 bg-ink-950/35" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_center,rgba(10,10,11,.55)_0%,rgba(10,10,11,0)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink-950 to-transparent" aria-hidden="true" />

        <div className="container-site flex min-h-[560px] flex-col items-center justify-center pt-12 pb-36 text-center sm:min-h-[620px] lg:min-h-[700px] lg:pb-44">
          <div className="flex max-w-6xl animate-fade-up flex-col items-center">
            <h1
              id="hero-title"
              className="font-display text-[clamp(2rem,8.6vw,4.25rem)] leading-[1.08] font-extrabold text-balance text-white [text-shadow:0_2px_28px_rgba(0,0,0,.55)] lg:text-[clamp(3rem,4.6vw,4.25rem)]"
            >
              {hero.headline.map((line) => (
                // Desktop: 1 frase por linha (2 linhas). Mobile: a frase pode quebrar para manter a fonte grande.
                <span key={line} className="block lg:whitespace-nowrap">
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
            <ButtonLink to="/estoque" size="lg" variant="primary" className="mt-10 px-9 lg:mt-12">
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
