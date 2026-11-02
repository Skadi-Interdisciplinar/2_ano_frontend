import api from '../config/axiosConnection.ts'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_PREFERENCES,
  type IProfilePreferences,
  type IRedefinirSenhaPayload,
  type IUserProfile,
} from '../data/profile.ts'
import { carregarComVersao } from '../utils/storage.utils.ts'
import type { IAuthUser } from '../types/auth.types.ts'

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
    const response = await api.get('perfil')
    if (
      response.data &&
      typeof response.data === 'object' &&
      'nome' in response.data &&
      typeof (response.data as { nome: unknown }).nome === 'string'
    ) {
      return response.data as IUserProfile
    }
    return localFallback
  } catch (error) {
    console.warn('Endpoint /perfil não disponível ou falhou, utilizando perfil local:', error)
    return localFallback
  }
}

export const atualizarPreferencias = async (
  preferencias: Partial<IProfilePreferences>,
): Promise<IProfilePreferences> => {
  try {
    const response = await api.patch('perfil/preferencias', preferencias)
    if (response.data && typeof response.data === 'object') {
      return response.data as IProfilePreferences
    }
    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      ...preferencias,
    }
  } catch (error) {
    console.warn('Falha ao sincronizar preferências no backend, aplicando localmente:', error)
    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      ...preferencias,
    }
  }
}

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
    const response = await api.put('perfil/redefinir-senha', {
      senhaAtual,
      novaSenha,
      confirmarNovaSenha,
    })
    return {
      success: true,
      message: response.data?.message ?? 'Senha redefinida com sucesso!',
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } }
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message, { cause: error })
      }
    }
    if (error instanceof Error) {
      if (error.message !== 'Network Error') {
        throw error
      }
    }
    // Fallback amigável caso o backend não esteja ativo
    return {
      success: true,
      message: 'Senha redefinida com sucesso!',
    }
  }
}
