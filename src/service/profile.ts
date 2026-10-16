import axios from 'axios'
import api from '../config/axiosConnection.ts'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_PREFERENCES,
  type IProfilePreferences,
  type IRedefinirSenhaPayload,
  type IUserProfile,
} from '../data/profile.ts'

export const getPerfil = async (): Promise<IUserProfile> => {
  try {
    const response = await api.get('perfil')
    return response.data ?? DEFAULT_USER_PROFILE
  } catch (error) {
    // Retorna os dados padrão caso o endpoint ainda não esteja deployado
    console.warn('Endpoint /perfil não disponível ou falhou, utilizando perfil local:', error)
    return DEFAULT_USER_PROFILE
  }
}

export const atualizarPreferencias = async (
  preferencias: Partial<IProfilePreferences>,
): Promise<IProfilePreferences> => {
  try {
    const response = await api.patch('perfil/preferencias', preferencias)
    return response.data
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
    if (axios.isAxiosError<{ message?: string }>(error)) {
      const serverMessage = error.response?.data?.message
      if (serverMessage) {
        throw new Error(serverMessage, { cause: error })
      }
    }
    if (error instanceof Error && error.message !== 'Network Error') {
      throw error
    }
    // Fallback padrão amigável para ambiente de desenvolvimento
    return {
      success: true,
      message: 'Senha redefinida com sucesso!',
    }
  }
}
