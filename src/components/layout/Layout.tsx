import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import { ConsentBanner } from './ConsentBanner'
import { DemoBanner } from './DemoBanner'
import { FloatingWhatsApp } from './FloatingWhatsApp'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  // Rola ao topo ao mudar de página (não ao alterar filtros na mesma página)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // page_view manual (SPA), apenas na troca de página — mudanças de filtro não contam.
  // Executa após o useSeo da página (efeito do filho) atualizar o título.
  useEffect(() => {
    trackPageView(pathname + window.location.search, document.title)
  }, [pathname])

  return (
    <>
      <a href="#conteudo" className="sr-only z-[60] rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Pular para o conteúdo
      </a>
      <DemoBanner />
      <Header />
      <main id="conteudo" tabIndex={-1} className="min-h-[60vh] outline-none">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ConsentBanner />
    </>
  )
}
