import axios from 'axios'
import api from './api.ts'
import type { ILoginCredentials, ILoginResponse } from '../types/auth.types.ts'

/**
 * Serviço de autenticação isolado por recurso.
 * Utiliza a mesma nomenclatura do mobile ({ usuario, senha }).
 */
export const postLogin = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
  try {
    const response = await api.post<ILoginResponse>('/auth/login', {
      usuario: credentials.usuario,
      senha: credentials.senha,
    })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      if (!error.response) {
        throw new Error('Falha de conexão com o servidor. Verifique se a API está ativa.', { cause: error })
      }

      if (error.response.status === 401) {
        throw new Error('Usuário ou senha incorretos.', { cause: error })
      }

      if (error.response.status === 403) {
        throw new Error('Acesso negado. Seu perfil não possui permissão nesta área.', { cause: error })
      }

      const serverMessage = error.response.data?.message
      throw new Error(serverMessage || 'Erro ao realizar login no servidor.', { cause: error })
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Ocorreu um erro inesperado ao tentar realizar login.', { cause: error })
  }
}

export const postLogout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.warn('Erro ao notificar logout no servidor:', error)
  }
}
