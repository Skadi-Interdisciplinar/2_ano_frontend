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
