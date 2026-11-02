import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../config/axiosConnection.ts'
import {
  getDashboardData,
  getMe,
  getCds,
  getChamadosSuporte,
} from './dashboard.service.ts'

vi.mock('../config/axiosConnection.ts', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('dashboard.service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  describe('getMe', () => {
    it('retorna os dados do usuário autenticado', async () => {
      const mockUser = {
        id: '1',
        nome: 'Super Admin',
        username: 'superadmin',
        nivelAcesso: 'SUPER_ADMIN',
      }
      vi.mocked(api.get).mockResolvedValue({ data: mockUser })

      const result = await getMe()
      expect(result).toEqual(mockUser)
      expect(api.get).toHaveBeenCalledWith('me')
    })

    it('propaga erro quando a requisição falha', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))
      await expect(getMe()).rejects.toThrow('Network error')
    })
  })

  describe('getCds', () => {
    it('retorna lista de CDs cadastrados', async () => {
      const mockCds = [
        { id: '1', nome: 'CD Belterra' },
        { id: '2', nome: 'CD Campinas' },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: mockCds })

      const result = await getCds()
      expect(result).toEqual(mockCds)
      expect(api.get).toHaveBeenCalledWith('cd')
    })
  })

  describe('getChamadosSuporte', () => {
    it('retorna lista de chamados de suporte', async () => {
      const mockTickets = [
        {
          id: '101',
          categoria: 'DUVIDA',
          status: 'REGISTRADO',
          descricao: 'Ajuda com login',
          dataHoraAbertura: '2026-11-01T10:00:00Z',
        },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: mockTickets })

      const result = await getChamadosSuporte()
      expect(result).toEqual(mockTickets)
      expect(api.get).toHaveBeenCalledWith('super_admin/support')
    })
  })

  describe('getDashboardData', () => {
    it('retorna dados agregados quando a rota dedicada /super_admin/dashboard responde com sucesso', async () => {
      const mockDashboard = {
        kpis: {
          totalAdministradores: 10,
          totalCds: 4,
          chamadosAbertos: 5,
          chamadosRegistrados: 3,
          chamadosEmAtendimento: 2,
          chamadosAtendidos: 15,
        },
        chamadosPorSituacao: {
          REGISTRADO: 3,
          EM_ATENDIMENTO: 2,
          ATENDIDO: 15,
        },
        chamadosPorCategoria: {
          DUVIDA: 8,
          SUGESTAO: 5,
          RECLAMACAO: 4,
          OUTRO: 3,
        },
        administradoresPorCd: [],
        chamadosRecentes: [],
        ultimaAtualizacao: '2026-11-02T16:00:00Z',
      }

      vi.mocked(api.get).mockResolvedValue({ data: mockDashboard })

      const result = await getDashboardData()
      expect(result).toEqual(mockDashboard)
      expect(api.get).toHaveBeenCalledWith('super_admin/dashboard', { params: undefined })
    })

    it('aplica agregação das rotas operacionais caso /super_admin/dashboard retorne 404', async () => {
      // Primeira chamada (dashboard agregado) falha com 404
      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url === 'super_admin/dashboard') {
          return Promise.reject(new Error('404 Not Found'))
        }
        if (url === 'super_admin/employees_admin') {
          return Promise.resolve({
            data: [
              { id: '1', nome: 'Admin 1', cd: [{ id: 'cd-1', nome: 'CD 1' }] },
              { id: '2', nome: 'Admin 2', cd: [{ id: 'cd-1', nome: 'CD 1' }] },
            ],
          })
        }
        if (url === 'cd') {
          return Promise.resolve({
            data: [{ id: 'cd-1', nome: 'CD 1' }],
          })
        }
        if (url === 'super_admin/support') {
          return Promise.resolve({
            data: [
              { id: '1', categoria: 'DUVIDA', status: 'REGISTRADO', dataHoraAbertura: '2026-11-01T10:00:00Z', descricao: 'Duvida' },
              { id: '2', categoria: 'RECLAMACAO', status: 'EM_ATENDIMENTO', dataHoraAbertura: '2026-11-02T10:00:00Z', descricao: 'Reclamacao' },
              { id: '3', categoria: 'SUGESTAO', status: 'ATENDIDO', dataHoraAbertura: '2026-10-30T10:00:00Z', descricao: 'Sugestao' },
            ],
          })
        }
        return Promise.reject(new Error('Unknown url'))
      })

      const result = await getDashboardData()
      expect(result.kpis.totalAdministradores).toBe(2)
      expect(result.kpis.totalCds).toBe(1)
      expect(result.kpis.chamadosAbertos).toBe(2) // 1 registrado + 1 em atendimento
      expect(result.kpis.chamadosRegistrados).toBe(1)
      expect(result.kpis.chamadosEmAtendimento).toBe(1)
      expect(result.kpis.chamadosAtendidos).toBe(1)
      expect(result.chamadosRecentes[0].id).toBe('2') // Mais recente primeiro
    })
  })
})
