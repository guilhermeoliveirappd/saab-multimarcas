import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import type { VehicleImage } from '@/types/vehicle'
import { cn } from '@/lib/cn'
import { Photo, PhotoCredit } from '@/components/ui/Photo'

interface Props {
  images: VehicleImage[]
  title: string
}

/** Gestos de deslizar (mobile) → anterior/próxima. */
function useSwipe(onPrev: () => void, onNext: () => void) {
  const startX = useRef<number | null>(null)
  return {
    onTouchStart: (e: TouchEvent) => (startX.current = e.touches[0]?.clientX ?? null),
    onTouchEnd: (e: TouchEvent) => {
      if (startX.current === null) return
      const delta = (e.changedTouches[0]?.clientX ?? 0) - startX.current
      if (Math.abs(delta) > 40) (delta < 0 ? onNext : onPrev)()
      startX.current = null
    },
  }
}

const thumbOf = (img: VehicleImage): VehicleImage => ({ ...img, url: img.srcSet ? img.srcSet.split(' ')[0] : img.url, srcSet: undefined })

const navButton =
  'absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-950 shadow-lg backdrop-blur transition-all hover:bg-white'

/** Galeria: foto principal, navegação, miniaturas e ampliação em tela cheia. */
export function VehicleGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const total = images.length
  const go = (next: number) => setIndex((next + total) % total)
  const prev = () => go(index - 1)
  const next = () => go(index + 1)
  const swipe = useSwipe(prev, next)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || typeof dialog.showModal !== 'function') return
    if (zoomOpen && !dialog.open) dialog.showModal()
    if (!zoomOpen && dialog.open) dialog.close()
  }, [zoomOpen])

  if (total === 0) {
    return <div className="grid aspect-[16/10] place-items-center rounded-[var(--radius-card)] bg-ink-100 text-ink-400">Fotos em breve</div>
  }

  const current = images[index]
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }
  const label = (i: number) => images[i].alt ?? `${title} — foto ${i + 1}`

  return (
    <div role="region" aria-roledescription="galeria" aria-label={`Fotos de ${title}`} onKeyDown={onKeyDown}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-ink-100" {...swipe}>
        <button type="button" className="block size-full cursor-zoom-in" onClick={() => setZoomOpen(true)} aria-label={`Ampliar ${label(index)}`}>
          <Photo
            key={current.url}
            image={current}
            alt={label(index)}
            sizes="(min-width: 1024px) 760px, 100vw"
            width={960}
            height={600}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className="size-full animate-[fade-up_.45s_ease-out] object-cover"
          />
        </button>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-ink-950/60 text-white backdrop-blur transition-colors hover:bg-ink-950/80"
          aria-label="Ampliar foto"
        >
          <Expand size={17} />
        </button>
        {total > 1 && (
          <>
            <button type="button" onClick={prev} className={cn(navButton, 'left-3 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100')} aria-label="Foto anterior">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={next} className={cn(navButton, 'right-3 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100')} aria-label="Próxima foto">
              <ChevronRight size={20} />
            </button>
            <p className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur" aria-live="polite">
              {index + 1} / {total}
            </p>
          </>
        )}
      </div>

      <PhotoCredit image={current} className="mt-2 text-center text-ink-400" />

      {total > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver ${label(i)}`}
                aria-current={i === index}
                className={cn(
                  'block aspect-[16/10] w-full overflow-hidden rounded-xl ring-2 transition-all',
                  i === index ? 'ring-accent' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                <Photo image={thumbOf(img)} alt="" loading="lazy" width={192} height={120} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Ampliação em tela cheia (diálogo nativo: foco preso e Esc para fechar) */}
      <dialog
        ref={dialogRef}
        onClose={() => setZoomOpen(false)}
        onKeyDown={onKeyDown}
        aria-label={`Fotos ampliadas de ${title}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink-950/95 p-0 text-white backdrop:bg-ink-950/80"
      >
        {zoomOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-white/70">
                {index + 1} / {total}
              </p>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Fechar ampliação"
                autoFocus
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" {...swipe}>
              <Photo key={current.url} image={current} alt={label(index)} sizes="100vw" className="max-h-full max-w-full rounded-lg object-contain" />
              {total > 1 && (
                <>
                  <button type="button" onClick={prev} className={cn(navButton, 'left-2 sm:left-4')} aria-label="Foto anterior">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={next} className={cn(navButton, 'right-2 sm:right-4')} aria-label="Próxima foto">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <div className="px-4 pt-3 pb-5 sm:px-6">
              <PhotoCredit image={current} className="text-center text-white/50" />
              {total > 1 && (
                <ul className="mx-auto mt-3 flex max-w-xl justify-center gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <li key={img.url} className="w-20 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Ver ${label(i)}`}
                        aria-current={i === index}
                        className={cn('block aspect-[16/10] w-full overflow-hidden rounded-lg ring-2', i === index ? 'ring-white' : 'opacity-50 ring-transparent hover:opacity-90')}
                      >
                        <Photo image={thumbOf(img)} alt="" loading="lazy" className="size-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
