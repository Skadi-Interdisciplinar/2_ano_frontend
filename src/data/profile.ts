export interface IUserProfile {
  id: string
  nome: string
  cargo: string
  usuario: string
  unidade?: string
  email?: string
  avatar?: string
}

export interface IProfilePreferences {
  modoEscuro: boolean
  idioma: string
  notificacoes?: boolean
}

export interface IRedefinirSenhaPayload {
  senhaAtual: string
  novaSenha: string
  confirmarNovaSenha: string
}

export interface IResetPasswordState {
  values: IRedefinirSenhaPayload
  errors: Partial<Record<keyof IRedefinirSenhaPayload, string>>
  submitting: boolean
  success: boolean
  generalError: string | null
}

export const DEFAULT_USER_PROFILE: IUserProfile = {
  id: 'super-admin-01',
  nome: 'Pedro Henrique',
  cargo: 'Super Administrador',
  usuario: 'pedhen.8002',
  unidade: 'JBS Belterra',
  email: 'pedro.henrique@skadi.com',
  avatar: 'P',
}

export const DEFAULT_PROFILE_PREFERENCES: IProfilePreferences = {
  modoEscuro: false,
  idioma: 'Português - BR',
  notificacoes: true,
}
