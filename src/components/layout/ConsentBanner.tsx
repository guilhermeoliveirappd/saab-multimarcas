import { useState } from 'react'
import { Link } from 'react-router'
import { analyticsEnabled, getConsent, setConsent } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'

/** Exibido somente se houver ferramenta de mensuração configurada (GA4/GTM). */
export function ConsentBanner() {
  const [visible, setVisible] = useState(() => analyticsEnabled && getConsent() === null)
  if (!visible) return null

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div role="region" aria-label="Preferências de cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-ink-200 bg-white p-5 shadow-2xl sm:inset-x-6 sm:bottom-6">
      <p className="text-sm leading-relaxed text-ink-600">
        Usamos cookies de mensuração para entender como o site é utilizado e melhorar sua experiência. Saiba mais na{' '}
        <Link to="/politica-de-privacidade" className="font-medium text-ink-950 underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="dark" onClick={() => choose('granted')}>
          Aceitar
        </Button>
        <Button size="sm" variant="outline" onClick={() => choose('denied')}>
          Recusar
        </Button>
      </div>
    </div>
  )
}
