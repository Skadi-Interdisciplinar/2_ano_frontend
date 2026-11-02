import type {
  IUserProfile,
  IProfilePreferences,
  IRedefinirSenhaPayload,
  IResetPasswordState,
} from '../types/profile.types.ts'

export type {
  IUserProfile,
  IProfilePreferences,
  IRedefinirSenhaPayload,
  IResetPasswordState,
}

export const DEFAULT_USER_PROFILE: IUserProfile = {
  id: 'super-admin-01',
  nome: 'Pedro Henrique',
  cargo: 'Super Administrador',
  usuario: 'pedhen.8002',
  unidade: 'JBS Belterra',
  email: 'pedro.henrique@skadi.com',
  avatar: undefined,
}

export const DEFAULT_PROFILE_PREFERENCES: IProfilePreferences = {
  modoEscuro: false,
  idioma: 'Português - BR',
  notificacoes: true,
}
