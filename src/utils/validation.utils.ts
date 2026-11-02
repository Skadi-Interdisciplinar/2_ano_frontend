import type { ILoginCredentials } from '../types/auth.types.ts'
import type { IRedefinirSenhaPayload } from '../types/profile.types.ts'

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

  const rawUser = credentials.username ?? credentials.usuario ?? ''
  const rawPass = credentials.password ?? credentials.senha ?? ''

  const usernameSanitizado = sanitizeString(rawUser)
  const passwordSanitizada = sanitizeString(rawPass)

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

/**
 * Validação e sanitização tipada para o formulário de redefinição de senha.
 * Garante tipo, tamanho máximo, tamanho mínimo e mensagem de erro específica por campo.
 */
export function validarRedefinirSenha(
  payload: IRedefinirSenhaPayload,
): IValidationResult<IRedefinirSenhaPayload> {
  const errors: Partial<Record<keyof IRedefinirSenhaPayload, string>> = {}

  const senhaAtual = sanitizeString(payload.senhaAtual)
  const novaSenha = sanitizeString(payload.novaSenha)
  const confirmarNovaSenha = sanitizeString(payload.confirmarNovaSenha)

  if (!senhaAtual) {
    errors.senhaAtual = 'A senha atual é obrigatória.'
  } else if (senhaAtual.length > 64) {
    errors.senhaAtual = 'A senha atual deve ter no máximo 64 caracteres.'
  }

  if (!novaSenha) {
    errors.novaSenha = 'A nova senha é obrigatória.'
  } else if (novaSenha.length < 6) {
    errors.novaSenha = 'A nova senha deve ter no mínimo 6 caracteres.'
  } else if (novaSenha.length > 64) {
    errors.novaSenha = 'A nova senha deve ter no máximo 64 caracteres.'
  }

  if (!confirmarNovaSenha) {
    errors.confirmarNovaSenha = 'A confirmação da nova senha é obrigatória.'
  } else if (novaSenha && confirmarNovaSenha !== novaSenha) {
    errors.confirmarNovaSenha = 'A nova senha e a confirmação não coincidem.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
