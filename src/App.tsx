import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { isSupabaseConfigured } from '@/config/env'
import { siteConfig } from '@/config/site'
import { Layout } from '@/components/layout/Layout'
import { VehiclesProvider } from '@/hooks/VehiclesProvider'
import HomePage from '@/pages/HomePage'

// Páginas carregadas sob demanda (code-splitting)
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'))
const SellTradePage = lazy(() => import('@/pages/SellTradePage'))
const FinancingPage = lazy(() => import('@/pages/FinancingPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AdminApp = lazy(() => (isSupabaseConfigured ? import('@/pages/admin/AdminApp') : import('@/pages/admin/AdminUnavailable')))

function PageFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />
}

export default function App() {
  const { services } = siteConfig
  return (
    <VehiclesProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="estoque" element={<InventoryPage />} />
            <Route path="veiculos/:slug" element={<VehicleDetailPage />} />
            {(services.sell || services.trade) && <Route path="venda-ou-troca" element={<SellTradePage />} />}
            {services.financing && <Route path="financiamento" element={<FinancingPage />} />}
            <Route path="sobre" element={<AboutPage />} />
            <Route path="contato" element={<ContactPage />} />
            <Route path="politica-de-privacidade" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </VehiclesProvider>
  )
}
