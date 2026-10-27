import type { ReactNode } from 'react'
import { env } from '@/config/env'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, generalMessage } from '@/lib/whatsapp'
import { WhatsAppIcon } from './BrandIcons'
import { buttonClasses } from './button-styles'

interface Props {
  /** Identifica a posição do botão nos eventos de mensuração */
  location: string
  message?: string
  vehicle?: { id: string; name: string }
  variant?: Parameters<typeof buttonClasses>[0]['variant']
  size?: Parameters<typeof buttonClasses>[0]['size']
  className?: string
  children?: ReactNode
  icon?: boolean
}

/** Botão de WhatsApp com mensagem contextualizada e evento de clique. */
export function WhatsAppButton({ location, message, vehicle, variant = 'primary', size = 'md', className, children, icon = true }: Props) {
  const href = buildWhatsAppUrl(message ?? generalMessage(), env.whatsappNumber)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses({ variant, size, className })}
      onClick={() =>
        trackEvent({
          name: 'contact_click',
          params: { channel: 'whatsapp', location, vehicle_id: vehicle?.id, vehicle_name: vehicle?.name },
        })
      }
    >
      {icon && <WhatsAppIcon size={18} />}
      {children ?? 'Fale com a SAAB'}
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  )
}
