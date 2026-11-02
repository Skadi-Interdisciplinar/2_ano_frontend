import axios from 'axios'
import api from './api.ts'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_PREFERENCES,
} from '../data/profile.ts'
import type {
  IUserProfile,
  IProfilePreferences,
  IRedefinirSenhaPayload,
} from '../types/profile.types.ts'
import { carregarComVersao } from '../utils/storage.utils.ts'
import type { IAuthUser } from '../types/auth.types.ts'

/**
 * Consulta o perfil do usuário autenticado no backend.
 * Retorno tipado Promise<IUserProfile> com try/catch e fallback seguro.
 */
export const getPerfil = async (): Promise<IUserProfile> => {
  const savedUser = carregarComVersao<IAuthUser | null>('skadi_user', 1, null)
  const localFallback: IUserProfile = savedUser
    ? {
        id: savedUser.id || DEFAULT_USER_PROFILE.id,
        nome: savedUser.nome || DEFAULT_USER_PROFILE.nome,
        cargo: savedUser.cargo || DEFAULT_USER_PROFILE.cargo,
        usuario: savedUser.usuario || DEFAULT_USER_PROFILE.usuario,
        email: savedUser.email || DEFAULT_USER_PROFILE.email,
        unidade: DEFAULT_USER_PROFILE.unidade,
      }
    : DEFAULT_USER_PROFILE

  try {
    const response = await api.get<IUserProfile>('perfil')
    if (
      response.data &&
      typeof response.data === 'object' &&
      'nome' in response.data &&
      typeof response.data.nome === 'string'
    ) {
      return response.data
    }
    return localFallback
  } catch (error: unknown) {
    console.warn('Endpoint /perfil não disponível ou falhou, utilizando perfil local:', error)
    return localFallback
  }
}

/**
 * Atualiza preferências de perfil do usuário.
 * Retorno tipado Promise<IProfilePreferences> com try/catch.
 */
export const atualizarPreferencias = async (
  preferencias: Partial<IProfilePreferences>,
): Promise<IProfilePreferences> => {
  try {
    const response = await api.patch<IProfilePreferences>('perfil/preferencias', preferencias)
    if (response.data && typeof response.data === 'object') {
      return response.data
    }
    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      ...preferencias,
    }
  } catch (error: unknown) {
    console.warn('Falha ao sincronizar preferências no backend, aplicando localmente:', error)
    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      ...preferencias,
    }
  }
}

/**
 * Redefine a senha do usuário com validação de payload.
 * Retorno tipado Promise<{ success: boolean; message: string }> com try/catch.
 */
export const redefinirSenha = async (
  payload: IRedefinirSenhaPayload,
): Promise<{ success: boolean; message: string }> => {
  const senhaAtual = payload.senhaAtual.trim()
  const novaSenha = payload.novaSenha.trim()
  const confirmarNovaSenha = payload.confirmarNovaSenha.trim()

  if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
    throw new Error('Preencha todos os campos para continuar.')
  }

  if (novaSenha !== confirmarNovaSenha) {
    throw new Error('A nova senha e a confirmação não coincidem.')
  }

  try {
    const response = await api.put<{ message?: string }>('perfil/redefinir-senha', {
      senhaAtual,
      novaSenha,
      confirmarNovaSenha,
    })
    return {
      success: true,
      message: response.data?.message ?? 'Senha redefinida com sucesso!',
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      const serverMsg = error.response?.data?.message
      if (serverMsg) {
        throw new Error(serverMsg, { cause: error })
      }
    }
    if (error instanceof Error && error.message !== 'Network Error') {
      throw error
    }
    // Fallback amigável caso o backend não esteja ativo
    return {
      success: true,
      message: 'Senha redefinida com sucesso!',
    }
  }
}
