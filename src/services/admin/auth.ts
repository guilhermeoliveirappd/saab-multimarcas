import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'E-mail ou senha inválidos.' : error.message)
}

export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export function onAuthChange(cb: (session: Session | null) => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => cb(session))
  return () => data.subscription.unsubscribe()
}

/** Confere no banco (função `is_admin`) se o usuário logado é administrador. */
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('is_admin')
  if (error) throw new Error(`Não foi possível verificar permissões: ${error.message}`)
  return data === true
}
