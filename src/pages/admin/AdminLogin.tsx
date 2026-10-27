import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Loader2 } from 'lucide-react'
import { signIn } from '@/services/admin/auth'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { useAdminSession } from './admin-session'

export default function AdminLogin() {
  const session = useAdminSession()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session.status === 'admin') {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from && from.startsWith('/admin') ? from : '/admin'} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-[1.5rem] bg-white p-8 shadow-2xl" aria-labelledby="login-title">
        <Logo />
        <h1 id="login-title" className="mt-8 font-display text-2xl font-bold text-ink-950">
          Acesso administrativo
        </h1>
        <p className="mt-1 text-sm text-ink-500">Gerenciamento do catálogo de veículos.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="field-label">
              E-mail
            </label>
            <input id="admin-email" type="email" className="field" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="admin-password" className="field-label">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              className="field"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" variant="dark" size="lg" className="mt-6 w-full" disabled={submitting}>
          {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Entrar
        </Button>
      </form>
    </div>
  )
}
