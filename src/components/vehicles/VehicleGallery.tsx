import { useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VehicleImage } from '@/types/vehicle'
import { cn } from '@/lib/cn'

interface Props {
  images: VehicleImage[]
  title: string
  overlay?: ReactNode
}

export function VehicleGallery({ images, title, overlay }: Props) {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const total = images.length
  const go = (next: number) => setIndex((next + total) % total)

  if (total === 0) {
    return <div className="grid aspect-[16/10] place-items-center rounded-[var(--radius-card)] bg-ink-100 text-ink-400">Fotos em breve</div>
  }

  const current = images[index]
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0]?.clientX ?? null)
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <div role="region" aria-roledescription="galeria" aria-label={`Fotos de ${title}`} onKeyDown={onKeyDown}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-ink-100" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img
          key={current.url}
          src={current.url}
          alt={current.alt ?? `${title} — foto ${index + 1}`}
          width={960}
          height={600}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className="size-full animate-[fade-up_.45s_ease-out] object-cover"
        />
        {overlay && <div className="absolute top-4 left-4 flex flex-wrap gap-2">{overlay}</div>}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-950 shadow-lg backdrop-blur transition-all hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-950 shadow-lg backdrop-blur transition-all hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              aria-label="Próxima foto"
            >
              <ChevronRight size={20} />
            </button>
            <p className="absolute right-4 bottom-4 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur" aria-live="polite">
              {index + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'block aspect-[16/10] w-full overflow-hidden rounded-xl ring-2 transition-all',
                  i === index ? 'ring-ink-950' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                <img src={img.url} alt="" loading="lazy" width={192} height={120} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
