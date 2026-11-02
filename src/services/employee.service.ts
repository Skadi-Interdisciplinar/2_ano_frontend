import axios from 'axios'
import api from './api.ts'
import type {
  Administrator,
  AdministratorInput,
  AdministratorUpdate,
} from '../types/employee.types.ts'
import type { Cd } from '../data/distributionCenter.ts'

export function mensagemDaApi(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (error.response?.status === 401) return 'Não autenticado.'
    if (error.response?.status === 403) return 'Acesso negado.'
  }
  return fallback
}

export const getCds = async (): Promise<Cd[]> => {
  try {
    const response = await api.get<Cd[]>('/cd')
    return Array.isArray(response.data) ? response.data : []
  } catch (error: unknown) {
    console.warn('Falha ao consultar centros de distribuição:', error)
    return []
  }
}

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

export const createAdministrador = async (payload: AdministratorInput): Promise<unknown> => {
  try {
    const response = await api.post('/auth/register', payload)
    return response.data
  } catch (error: unknown) {
    const msg = mensagemDaApi(error, 'Erro ao cadastrar administrador.')
    throw new Error(msg, { cause: error })
  }
}

export const updateAdministrador = async (payload: AdministratorUpdate): Promise<unknown> => {
  try {
    const response = await api.put(`super_admin/employees_admin/${payload.id}`, payload)
    return response.data
  } catch (error: unknown) {
    const msg = mensagemDaApi(error, 'Erro ao atualizar administrador.')
    throw new Error(msg, { cause: error })
  }
}

export const deleteAdministrador = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`super_admin/employees_admin/${id}`)
  } catch (error: unknown) {
    const msg = mensagemDaApi(error, 'Erro ao remover administrador.')
    throw new Error(msg, { cause: error })
  }
}
