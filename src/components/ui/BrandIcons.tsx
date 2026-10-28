import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Ícone simplificado do WhatsApp (traço), no estilo dos ícones Lucide. */
export function WhatsAppIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.4l-4.5 1.1z" />
      <path d="M9 8.6c.2-.5.6-.6.9-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.1-.2.3 0 .5.7 1.2 1.6 2 2.8 2.6.2.1.4.1.5-.1l.6-.7c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-.6.3-1.4.4-2.4.1-2.3-.7-4.4-2.8-5.2-5-.4-1.1-.3-2 .2-2.6z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function InstagramIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 3.5h-2.2A3.8 3.8 0 0 0 9 7.3V10H6.5v3.5H9v7h3.5v-7h2.6l.6-3.5h-3.2V7.6c0-.6.4-1 1-1H15z" />
    </svg>
  )
}

export function YouTubeIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
    </svg>
  )
}
