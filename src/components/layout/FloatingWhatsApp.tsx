import { useLocation } from 'react-router'
import { env } from '@/config/env'
import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl, generalMessage } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'

/** Atalho flutuante para o WhatsApp (oculto na página do veículo, que tem CTA próprio fixo). */
export function FloatingWhatsApp() {
  const { pathname } = useLocation()
  // Oculto onde há CTA próprio fixo (veículo) ou formulário (financiamento)
  if (pathname.startsWith('/veiculos/') || pathname.toLowerCase().startsWith('/financiamento')) return null
  return (
    <a
      href={buildWhatsAppUrl(generalMessage(), env.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent({ name: 'contact_click', params: { channel: 'whatsapp', location: 'floating_button' } })}
      className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-accent text-white shadow-[0_12px_30px_-10px_var(--color-accent)] hover:bg-accent-hover transition-transform duration-300 hover:scale-105 sm:right-6 sm:bottom-6"
      aria-label="Conversar pelo WhatsApp (abre em nova aba)"
    >
      <WhatsAppIcon size={26} />
    </a>
  )
}
