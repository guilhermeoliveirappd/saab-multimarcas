import { useState, type ImgHTMLAttributes } from 'react'
import type { VehicleImage } from '@/types/vehicle'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> & {
  image: VehicleImage
  alt?: string
}

/** Sequência de fontes: foto principal → alternativas → imagem local. */
const sourcesOf = (image: VehicleImage): VehicleImage[] => [
  image,
  ...(image.alternates ?? []),
  ...(image.fallbackUrl ? [{ url: image.fallbackUrl, alt: image.alt }] : []),
]

/**
 * Imagem resiliente: se a foto remota falhar (rede, link removido), tenta as
 * alternativas e por fim a imagem local — o site nunca mostra imagem quebrada.
 */
export function Photo({ image, alt, onError, ...props }: Props) {
  const sources = sourcesOf(image)
  const [failure, setFailure] = useState<{ url: string; index: number }>({ url: image.url, index: 0 })
  // Reinicia a sequência quando a imagem muda (ex.: navegação na galeria)
  const index = failure.url === image.url ? failure.index : 0
  const current = sources[Math.min(index, sources.length - 1)]

  return (
    <img
      key={current.url}
      src={current.url}
      srcSet={current.srcSet}
      alt={alt ?? image.alt ?? ''}
      onError={(e) => {
        if (index < sources.length - 1) setFailure({ url: image.url, index: index + 1 })
        else onError?.(e)
      }}
      {...props}
    />
  )
}
