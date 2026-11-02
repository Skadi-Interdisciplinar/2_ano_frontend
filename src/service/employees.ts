import axios from 'axios'
import api from '../config/axiosConnection.ts'
import type { AdministratorInput, AdministratorUpdate } from '../data/administrators.ts'
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
  const response = await api.get<Cd[]>('/cd')
  return Array.isArray(response.data) ? response.data : []
}

export const getFuncionarios = async () => {
  const response = await api.get('super_admin/employees_admin')
  return response.data
}

export const createAdministrador = async (payload: AdministratorInput) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const updateAdministrador = async (payload: AdministratorUpdate) => {
  const response = await api.put(`super_admin/employees_admin/${payload.id}`, payload)
  return response.data
}

export const deleteAdministrador = async (id: string | number) => {
  await api.delete(`super_admin/employees_admin/${id}`)
}
