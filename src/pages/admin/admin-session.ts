import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AdminSession {
  status: 'loading' | 'signed-out' | 'forbidden' | 'admin' | 'error'
  user: User | null
  error: string | null
}

export const AdminSessionContext = createContext<AdminSession>({ status: 'loading', user: null, error: null })
export const useAdminSession = () => useContext(AdminSessionContext)
