import type { ILoginCredentials } from '../types/auth.types.ts'

export interface IValidationResult<T> {
  isValid: boolean
  errors: Partial<Record<keyof T, string>>
}

/**
 * Sanitiza texto removendo caracteres perigosos e espaços excedentes.
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

/**
 * Validação tipada para o formulário de login.
 * Valida tipo, obrigatoriedade, tamanho mínimo e tamanho máximo com mensagem específica por campo.
 */
export function validarLogin(credentials: ILoginCredentials): IValidationResult<ILoginCredentials> {
  const errors: Partial<Record<keyof ILoginCredentials, string>> = {}

  const usernameSanitizado = sanitizeString(credentials.username)
  const passwordSanitizada = sanitizeString(credentials.password)

  if (!usernameSanitizado) {
    errors.username = 'O campo Usuário é obrigatório.'
  } else if (usernameSanitizado.length < 3) {
    errors.username = 'O usuário deve ter no mínimo 3 caracteres.'
  } else if (usernameSanitizado.length > 50) {
    errors.username = 'O usuário deve ter no máximo 50 caracteres.'
  }

  if (!passwordSanitizada) {
    errors.password = 'O campo Senha é obrigatório.'
  } else if (passwordSanitizada.length < 4) {
    errors.password = 'A senha deve conter no mínimo 4 caracteres.'
  } else if (passwordSanitizada.length > 32) {
    errors.password = 'A senha deve conter no máximo 32 caracteres.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
