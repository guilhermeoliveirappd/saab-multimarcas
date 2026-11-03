import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { content } from '@/config/content'
import { ButtonLink } from '@/components/ui/Button'
import { QuickSearch } from '@/components/vehicles/QuickSearch'

/** Ponto de troca entre a foto vertical (celular/tablet) e a horizontal (desktop). */
const DESKTOP_MEDIA = '(min-width: 1024px)'

/**
 * Foto do banner com <picture>: abaixo de 1024px usa a foto VERTICAL e, a partir
 * dele, a HORIZONTAL — o navegador baixa só uma. Ambas ocupam a área inteira
 * (object-cover) ancoradas embaixo, onde está o carro; o céu escuro, no alto,
 * recebe a headline. Se a foto remota falhar, mostra a imagem local.
 */
function HeroPicture() {
  const { image, imageMobile } = content.hero
  const [failed, setFailed] = useState(false)
  // Foto deslocada para baixo (top-20 / sm:top-28 / lg:top-12) para o carro
  // ficar abaixo do texto; o topo some em fade sob o cabeçalho. A faixa sob o
  // card de busca (4rem / 5rem) é coberta por fundo escuro.
  const className =
    'absolute inset-x-0 top-20 -z-20 h-[calc(100%-4rem)] w-full object-cover object-[50%_100%] [mask-image:linear-gradient(to_bottom,transparent,#000_7rem)] sm:top-28 lg:top-12 lg:h-[calc(100%-5rem)]'

  if (failed) {
    return <img src={image.fallbackUrl} alt="" aria-hidden="true" className={className} />
  }
  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={image.srcSet} sizes="100vw" />
      <img
        src={imageMobile.url}
        srcSet={imageMobile.srcSet}
        sizes="100vw"
        alt={imageMobile.alt ?? ''}
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
        className={className}
      />
    </picture>
  )
}

export function Hero() {
  const { hero } = content
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative isolate overflow-hidden bg-ink-950">
        <HeroPicture />
        {/* Overlays: escurece o céu (leitura da headline) e a base (transição para a busca) */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-3/5 bg-gradient-to-b from-ink-950/85 via-ink-950/45 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-16 -z-10 h-28 bg-gradient-to-t from-ink-950 to-transparent lg:bottom-20 lg:h-36"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-ink-950 lg:h-20" aria-hidden="true" />

        {/* Altura proporcional à largura: mantém o mesmo enquadramento do carro em qualquer tela */}
        <div className="container-site flex h-[clamp(640px,184vw,780px)] flex-col items-center pt-[calc(72px+1.5rem)] text-center sm:h-[840px] lg:h-[clamp(740px,60vw,940px)] lg:pt-[calc(5rem+2rem)]">
          <div className="flex max-w-6xl animate-fade-up flex-col items-center">
            <h1
              id="hero-title"
              className="font-display text-[clamp(1.95rem,8.2vw,3.5rem)] leading-[1.08] font-extrabold text-balance text-white [text-shadow:0_2px_24px_rgba(0,0,0,.5)] lg:text-[clamp(2.75rem,4.2vw,4rem)]"
            >
              {hero.headline.map((line) => (
                // Desktop: 2 linhas fixas. Celular: quebra natural, fonte grande.
                <span key={line} className="lg:block lg:whitespace-nowrap">
                  {line}{' '}
                </span>
              ))}
            </h1>
            <ButtonLink to="/estoque" size="lg" variant="primary" className="mt-6 px-9 lg:mt-9">
              {hero.primaryCta}
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-site relative z-10 -mt-16 lg:-mt-20">
        <QuickSearch />
      </div>
    </section>
  )
}
