import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { ExternalLink, Loader2, LogOut, ShieldAlert } from 'lucide-react'
import { checkIsAdmin, getSession, onAuthChange, signOut } from '@/services/admin/auth'
import type { Session } from '@supabase/supabase-js'
import { useSeo } from '@/lib/seo'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { AdminSessionContext, useAdminSession, type AdminSession } from './admin-session'
import AdminLogin from './AdminLogin'
import AdminVehicleForm from './AdminVehicleForm'
import AdminVehicleList from './AdminVehicleList'

function useSessionState(): AdminSession {
  const [state, setState] = useState<AdminSession>({ status: 'loading', user: null, error: null })
  useEffect(() => {
    let active = true
    const resolve = async (session: Session | null) => {
      if (!session) return active && setState({ status: 'signed-out', user: null, error: null })
      try {
        const isAdmin = await checkIsAdmin()
        if (active) setState({ status: isAdmin ? 'admin' : 'forbidden', user: session.user, error: null })
      } catch (err) {
        if (active) setState({ status: 'error', user: session.user, error: err instanceof Error ? err.message : String(err) })
      }
    }
    getSession().then(resolve)
    const unsubscribe = onAuthChange((session) => void resolve(session))
    return () => {
      active = false
      unsubscribe()
    }
  }, [])
  return state
}

function FullScreenMessage({ children }: { children: ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-ink-50 p-6 text-center">{children}</div>
}

/** Protege as rotas internas: exige sessão + permissão de administrador no banco. */
function RequireAdmin() {
  const session = useAdminSession()
  const location = useLocation()
  if (session.status === 'loading')
    return (
      <FullScreenMessage>
        <Loader2 className="animate-spin text-ink-400" aria-label="Verificando acesso" />
      </FullScreenMessage>
    )
  if (session.status === 'signed-out') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (session.status !== 'admin')
    return (
      <FullScreenMessage>
        <div className="max-w-md">
          <ShieldAlert className="mx-auto text-danger" size={32} aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold">Acesso não autorizado</h1>
          <p className="mt-2 text-ink-500">{session.error ?? 'Sua conta não tem permissão para gerenciar o estoque.'}</p>
          <Button variant="dark" className="mt-6" onClick={() => void signOut()}>
            Sair
          </Button>
        </div>
      </FullScreenMessage>
    )

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo className="scale-90" />
            <span className="hidden rounded-full bg-ink-950 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase sm:inline">Estoque</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-ink-500 md:inline">{session.user?.email}</span>
            <Link to="/" target="_blank" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-ink-600 hover:bg-ink-100">
              <ExternalLink size={15} aria-hidden="true" /> <span className="hidden sm:inline">Ver site</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => void signOut()}>
              <LogOut size={15} aria-hidden="true" /> Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="container-site py-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default function AdminApp() {
  useSeo({ title: 'Painel administrativo', path: '/admin', noindex: true })
  const session = useSessionState()
  return (
    <AdminSessionContext.Provider value={session}>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<AdminVehicleList />} />
          <Route path="veiculos/novo" element={<AdminVehicleForm />} />
          <Route path="veiculos/:id" element={<AdminVehicleForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminSessionContext.Provider>
  )
}
