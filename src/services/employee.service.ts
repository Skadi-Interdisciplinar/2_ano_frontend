import axios from 'axios'
import api from './api.ts'
import type { Administrator } from '../types/employee.types.ts'

/**
 * Serviço de colaboradores e administradores isolado em src/services/.
 * Retorno estritamente tipado com Promise<Administrator[]> e tratamento de erro via try/catch.
 */
export const getFuncionarios = async (): Promise<Administrator[]> => {
  try {
    const response = await api.get<Administrator[]>('super_admin/employees_admin')
    return response.data ?? []
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Falha de conexão com o servidor ao consultar administradores.', { cause: error })
      }
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('Permissão insuficiente para visualizar lista de administradores.', { cause: error })
      }
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro inesperado ao consultar administradores.', { cause: error })
  }
}
