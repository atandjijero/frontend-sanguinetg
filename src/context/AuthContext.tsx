import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, setAccessToken } from '../lib/api'
import type { Utilisateur } from '../lib/types'

interface RegisterPayload {
  nom: string
  prenom: string
  email: string
  telephone: string
  motDePasse: string
  confirmationMotDePasse: string
  groupeSanguin?: string
  quartierId?: string
}

interface AuthContextValue {
  user: Utilisateur | null
  isLoading: boolean
  login: (identifiant: string, motDePasse: string) => Promise<Utilisateur>
  register: (payload: RegisterPayload) => Promise<Utilisateur>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function bootstrap() {
      const refreshed = await api.refresh()
      if (!cancelled && refreshed) {
        try {
          const me = await api.get<Utilisateur>('/users/me')
          if (!cancelled) setUser(me)
        } catch {
          if (!cancelled) setUser(null)
        }
      }
      if (!cancelled) setIsLoading(false)
    }
    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (identifiant: string, motDePasse: string) => {
    const data = await api.post<{ user: Utilisateur; accessToken: string }>('/auth/login', {
      identifiant,
      motDePasse,
    })
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await api.post<{ user: Utilisateur; accessToken: string }>('/auth/register', payload)
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await api.get<Utilisateur>('/users/me')
    setUser(me)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [user, isLoading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>')
  }
  return context
}
