export interface ILoginCredentials {
  usuario: string
  senha: string
  lembreMe?: boolean
}

export interface IAuthUser {
  id: string
  nome: string
  usuario: string
  email?: string
  cargo?: string
}

export interface ILoginResponse {
  token: string
  user: IAuthUser
}

export interface IAuthContext {
  user: IAuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: ILoginCredentials) => Promise<boolean>
  logout: () => void
}
