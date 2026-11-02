import api from '../config/axiosConnection.ts'
import type { Chamado, ChamadoAbertura, ChamadoEdicao, StatusChamado } from '../data/support.ts'

export const abrirChamado = async (payload: ChamadoAbertura) => {
  const response = await api.post<Chamado>('/support', payload)
  return response.data
}

export const listarChamados = async () => {
  const response = await api.get<Chamado[]>('/super_admin/support')
  return Array.isArray(response.data) ? response.data : []
}

export const buscarChamado = async (id: number) => {
  const response = await api.get<Chamado>(`/super_admin/support/${id}`)
  return response.data
}

export const editarChamado = async (id: number, payload: ChamadoEdicao) => {
  const response = await api.put<Chamado>(`/super_admin/support/${id}`, payload)
  return response.data
}

export const alterarStatusChamado = async (id: number, status: StatusChamado) => {
  const response = await api.patch<Chamado>(`/super_admin/support/${id}/status`, { status })
  return response.data
}

export const excluirChamado = async (id: number) => {
  await api.delete(`/super_admin/support/${id}`)
}
