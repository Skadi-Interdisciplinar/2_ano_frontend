import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  IAuthContext,
  IAuthUser,
  ILoginCredentials,
  ILoginResponse,
} from '../types/auth.types.ts'
import { postLogin, postLogout } from '../services/auth.service.ts'
import {
  carregarComVersao,
  removerItem,
  salvarComVersao,
} from '../utils/storage.utils.ts'

const TOKEN_KEY = 'skadi_token'
const USER_KEY = 'skadi_user'
const SESSION_KEY = 'skadi_session'
const SCHEMA_VERSAO = 1

function usuarioDoToken(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json: unknown = JSON.parse(atob(normalized))
    if (typeof json === 'object' && json !== null && 'sub' in json && typeof json.sub === 'string') {
      return json.sub
    }
    return null
  } catch {
    return null
  }
}

function usuarioDaSessao(token: string, informado?: string): IAuthUser {
  const usuario = usuarioDoToken(token) ?? informado ?? 'usuario'
  return { id: usuario, nome: usuario, usuario }
}

function sessaoExpirada(): boolean {
  const session = carregarComVersao<Pick<ILoginResponse, 'validUntil'> | null>(SESSION_KEY, SCHEMA_VERSAO, null)
  if (!session?.validUntil) return false
  const validUntil = Date.parse(session.validUntil)
  return Number.isFinite(validUntil) && validUntil <= Date.now()
}

function limparSessao() {
  removerItem(TOKEN_KEY)
  removerItem(USER_KEY)
  removerItem(SESSION_KEY)
}

function sessaoSalva(): { token: string; user: IAuthUser } | null {
  if (sessaoExpirada()) {
    limparSessao()
    return null
  }
  const token = carregarComVersao<string | null>(TOKEN_KEY, SCHEMA_VERSAO, null)
  const user = carregarComVersao<IAuthUser | null>(USER_KEY, SCHEMA_VERSAO, null)
  return token && user ? { token, user } : null
}

const AuthContext = createContext<IAuthContext | null>(null)

export interface IAuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: IAuthProviderProps) {
  // Inicialização preguiçosa sem disparar render em cascata via useEffect
  const [user, setUser] = useState<IAuthUser | null>(() => sessaoSalva()?.user ?? null)

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(sessaoSalva()))

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const login = useCallback(async (credentials: ILoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Faz requisição estrita para a API
      const response = await postLogin(credentials)
      const sessionUser = usuarioDaSessao(response.token, credentials.usuario ?? credentials.username)
      const resolvedUser = response.user ?? sessionUser
      setUser(resolvedUser)
      setIsAuthenticated(true)

      salvarComVersao(TOKEN_KEY, response.token, SCHEMA_VERSAO)
      salvarComVersao(USER_KEY, resolvedUser, SCHEMA_VERSAO)
      if (response.expirationTime || response.validUntil) {
        salvarComVersao(
          SESSION_KEY,
          { expirationTime: response.expirationTime, validUntil: response.validUntil },
          SCHEMA_VERSAO,
        )
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', response.token)
      }
      return true
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    void postLogout()
    limparSessao()
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token')
    }
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo<IAuthContext>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): IAuthContext {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
