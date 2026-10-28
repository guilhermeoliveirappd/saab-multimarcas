import { Database, Lock } from 'lucide-react'
import { useSeo } from '@/lib/seo'
import { ButtonLink } from '@/components/ui/Button'

/** Exibido quando o Supabase não está configurado: nenhuma função administrativa é simulada. */
export default function AdminUnavailable() {
  useSeo({ title: 'Painel administrativo', path: '/admin', noindex: true })
  return (
    <section className="container-site flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-xl rounded-[1.5rem] bg-white p-8 text-center shadow-[var(--shadow-card-hover)] ring-1 ring-ink-100 sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink-950 text-white">
          <Lock size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-950">Painel administrativo indisponível</h1>
        <p className="mt-3 leading-relaxed text-ink-500">
          O gerenciador de estoque depende do backend (Supabase), que ainda não foi configurado neste ambiente. Nenhuma alteração pode ser feita
          até a configuração.
        </p>
        <div className="mt-6 rounded-2xl bg-ink-50 p-5 text-left text-sm text-ink-600 ring-1 ring-ink-100">
          <p className="flex items-center gap-2 font-semibold text-ink-900">
            <Database size={16} aria-hidden="true" /> Para ativar
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5">
            <li>Criar o projeto no Supabase e executar a migração em <code className="text-xs">supabase/migrations</code>.</li>
            <li>
              Definir <code className="text-xs">VITE_SUPABASE_URL</code> e <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> na Vercel.
            </li>
            <li>Criar o usuário administrador e registrá-lo em <code className="text-xs">admin_users</code>.</li>
          </ol>
        </div>
        <ButtonLink to="/" variant="dark" className="mt-8">
          Voltar ao site
        </ButtonLink>
      </div>
    </section>
  )
}
