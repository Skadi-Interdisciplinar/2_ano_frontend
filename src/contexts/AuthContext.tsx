import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  IAuthContext,
  IAuthUser,
  ILoginCredentials,
} from '../types/auth.types.ts'
import { postLogin, postLogout } from '../services/auth.service.ts'
import {
  carregarComVersao,
  removerItem,
  salvarComVersao,
} from '../utils/storage.utils.ts'

const TOKEN_KEY = 'skadi_token'
const USER_KEY = 'skadi_user'
const SCHEMA_VERSAO = 1

const AuthContext = createContext<IAuthContext | null>(null)

export interface IAuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IAuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Inicializa sessão a partir do storage versionado
  useEffect(() => {
    const savedToken = carregarComVersao<string | null>(TOKEN_KEY, SCHEMA_VERSAO, null)
    const savedUser = carregarComVersao<IAuthUser | null>(USER_KEY, SCHEMA_VERSAO, null)

    if (savedToken && savedUser) {
      setUser(savedUser)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: ILoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Faz requisição estrita para a API
      const response = await postLogin(credentials)
      setUser(response.user)
      setIsAuthenticated(true)

      // Persiste com schema versionado (_versao: 1)
      salvarComVersao(TOKEN_KEY, response.token, SCHEMA_VERSAO)
      salvarComVersao(USER_KEY, response.user, SCHEMA_VERSAO)
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
    removerItem(TOKEN_KEY)
    removerItem(USER_KEY)
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

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
