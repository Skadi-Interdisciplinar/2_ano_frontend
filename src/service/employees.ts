import api from '../config/axiosConnection.ts'
import type { AdministratorInput } from '../data/administrators.ts'

export const getFuncionarios = async () => {
  const response = await api.get('super_admin/employees_admin')
  return response.data
}

export const createAdministrador = async (payload: AdministratorInput) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const updateAdministrador = async (id: string | number, payload: AdministratorInput) => {
  const response = await api.put(`super_admin/employees_admin/${id}`, payload)
  return response.data
}

export const deleteAdministrador = async (id: string | number) => {
  const response = await api.delete(`super_admin/employees_admin/${id}`)
  return response.data
}
