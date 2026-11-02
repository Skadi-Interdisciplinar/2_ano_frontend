import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboards from './index.tsx'
import * as dashboardService from '../../services/dashboard.service.ts'
import { AuthProvider } from '../../contexts/AuthContext.tsx'
import { AccessibilityProvider } from '../../contexts/AccessibilityContext.tsx'
import type { IDashboardData } from '../../types/dashboard.types.ts'

const mockDashboardData: IDashboardData = {
  kpis: {
    totalAdministradores: 5,
    totalCds: 2,
    chamadosAbertos: 8,
    chamadosRegistrados: 3,
    chamadosEmAtendimento: 5,
    chamadosAtendidos: 12,
  },
  chamadosPorSituacao: {
    REGISTRADO: 3,
    EM_ATENDIMENTO: 5,
    ATENDIDO: 12,
  },
  chamadosPorCategoria: {
    DUVIDA: 6,
    SUGESTAO: 2,
    RECLAMACAO: 7,
    OUTRO: 5,
  },
  administradoresPorCd: [
    { cdId: '1', cdNome: 'CD Cajamar - SP', totalAdmins: 3 },
    { cdId: '2', cdNome: 'CD Extrema - MG', totalAdmins: 2 },
  ],
  chamadosRecentes: [
    {
      id: '101',
      categoria: 'DUVIDA',
      descricao: 'Dúvida de acesso ao terminal',
      status: 'REGISTRADO',
      dataHoraAbertura: '2026-11-02T10:00:00Z',
    },
    {
      id: '102',
      categoria: 'RECLAMACAO',
      descricao: 'Lentidão no carregamento',
      status: 'EM_ATENDIMENTO',
      dataHoraAbertura: '2026-11-02T11:00:00Z',
    },
    {
      id: '103',
      categoria: 'SUGESTAO',
      descricao: 'Sugestão de melhoria no fluxo',
      status: 'ATENDIDO',
      dataHoraAbertura: '2026-11-01T15:00:00Z',
    },
  ],
  ultimaAtualizacao: '2026-11-02T14:30:00.000Z',
}

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <Dashboards />
        </AuthProvider>
      </AccessibilityProvider>
    </MemoryRouter>,
  )
}

describe('Dashboards Page (SuperAdmin Operational Dashboard)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exibe loading e em seguida renderiza os cards de KPI operacionais', async () => {
    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData)

    renderWithProviders()

    expect(screen.getByText(/Carregando indicadores do dashboard operacional/i)).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByText('Administradores cadastrados')).toBeTruthy()
      expect(screen.getByText('Centros de distribuição cadastrados')).toBeTruthy()
      expect(screen.getByText('Chamados abertos')).toBeTruthy()
      expect(screen.getByText('Chamados registrados')).toBeTruthy()
      expect(screen.getByText('Chamados em atendimento')).toBeTruthy()
      expect(screen.getByText('Chamados atendidos')).toBeTruthy()
    })

    expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8').length).toBeGreaterThan(0)
    expect(screen.getAllByText('12').length).toBeGreaterThan(0)
  })

  it('renderiza os gráficos de situação e categoria com legendas textuais e atributos ARIA', async () => {
    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Chamados por Situação')).toBeTruthy()
      expect(screen.getByText('Chamados por Categoria')).toBeTruthy()
      expect(screen.getAllByText('Dúvida').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Sugestão').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Reclamação').length).toBeGreaterThan(0)
      expect(screen.getByText('Outro')).toBeTruthy()
    })
  })

  it('suporta abas com padrão WAI-ARIA para filtrar a tabela de chamados recentes', async () => {
    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/Chamados Recentes/i)).toBeTruthy()
    })

    // Verifica abas ARIA
    const tabTodos = screen.getByRole('tab', { name: /Todos/i })
    const tabAbertos = screen.getByRole('tab', { name: /Abertos/i })
    const tabAtendidos = screen.getByRole('tab', { name: /Atendidos/i })

    expect(tabTodos).toHaveProperty('ariaSelected', 'true')
    expect(tabAbertos).toHaveProperty('ariaSelected', 'false')

    // Na aba Todos, os 3 chamados aparecem
    expect(screen.getByText('#101')).toBeTruthy()
    expect(screen.getByText('#102')).toBeTruthy()
    expect(screen.getByText('#103')).toBeTruthy()

    // Clica na aba Abertos
    fireEvent.click(tabAbertos)
    expect(tabAbertos).toHaveProperty('ariaSelected', 'true')
    expect(screen.getByText('#101')).toBeTruthy()
    expect(screen.getByText('#102')).toBeTruthy()
    expect(screen.queryByText('#103')).toBeNull()

    // Clica na aba Atendidos
    fireEvent.click(tabAtendidos)
    expect(tabAtendidos).toHaveProperty('ariaSelected', 'true')
    expect(screen.queryByText('#101')).toBeNull()
    expect(screen.getByText('#103')).toBeTruthy()
  })

  it('exibe alerta de erro claro com botão de retry quando a API falha, sem converter em zeros falsos', async () => {
    vi.spyOn(dashboardService, 'getDashboardData').mockRejectedValueOnce(
      new Error('Erro 500: Falha no servidor operacional'),
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy()
      expect(screen.getByText(/Falha ao obter dados do dashboard/i)).toBeTruthy()
      expect(screen.getByText(/Erro 500: Falha no servidor operacional/i)).toBeTruthy()
    })

    // Clicar em tentar novamente
    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData)
    const retryBtn = screen.getByRole('button', { name: /Tentar novamente/i })
    fireEvent.click(retryBtn)

    await waitFor(() => {
      expect(screen.getByText('Administradores cadastrados')).toBeTruthy()
    })
  })

  it('possui link de pular para o conteúdo principal e landmarks semânticos', async () => {
    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValueOnce(mockDashboardData)

    renderWithProviders()

    expect(screen.getByRole('link', { name: /Pular para o conteúdo principal/i })).toBeTruthy()
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
  })
})
