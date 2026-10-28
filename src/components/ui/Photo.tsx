import { useState, type ImgHTMLAttributes } from 'react'
import type { VehicleImage } from '@/types/vehicle'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> & {
  image: VehicleImage
  alt?: string
}

/**
 * Imagem com fallback: se a foto remota falhar (rede, link removido), exibe a
 * imagem local `fallbackUrl` — o site nunca mostra imagem quebrada.
 */
export function Photo({ image, alt, onError, ...props }: Props) {
  const [failed, setFailed] = useState<string | null>(null)
  const useFallback = failed === image.url && Boolean(image.fallbackUrl)
  return (
    <img
      key={useFallback ? 'fallback' : image.url}
      src={useFallback ? image.fallbackUrl : image.url}
      srcSet={useFallback ? undefined : image.srcSet}
      alt={alt ?? image.alt ?? ''}
      onError={(e) => {
        if (!useFallback && image.fallbackUrl) setFailed(image.url)
        onError?.(e)
      }}
      {...props}
    />
  )
}

/** Crédito curto exigido pela licença (autor · licença · link para a origem). */
export function PhotoCredit({ image, className = '' }: { image: VehicleImage; className?: string }) {
  const c = image.credit
  if (!c) return null
  return (
    <p className={`text-[11px] leading-snug ${className}`}>
      Foto ilustrativa ·{' '}
      <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
        {c.author ?? 'Wikimedia Commons'}
      </a>
      {c.license && ` · ${c.license}`}
    </p>
  )
}
