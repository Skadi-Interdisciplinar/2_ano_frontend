import api from '../config/axiosConnection.ts'
import type {
  IDashboardData,
  ISupportTicketItem,
  ICdItem,
  IUserMe,
  ISupportTicketStatus,
  ISupportTicketCategory,
  IAdminPerCd,
} from '../types/dashboard.types.ts'

/**
 * Consulta a identidade e permissão real do usuário autenticado no backend.
 */
export const getMe = async (): Promise<IUserMe> => {
  try {
    const response = await api.get('me')
    return response.data as IUserMe
  } catch (error) {
    console.warn('Endpoint /me indisponível ou falhou:', error)
    throw error
  }
}

/**
 * Consulta a lista de centros de distribuição cadastrados.
 */
export const getCds = async (): Promise<ICdItem[]> => {
  try {
    const response = await api.get('cd')
    if (Array.isArray(response.data)) {
      return response.data as ICdItem[]
    }
    return []
  } catch (error) {
    console.warn('Endpoint /cd indisponível ou falhou:', error)
    throw error
  }
}

/**
 * Consulta a lista de solicitações de suporte.
 */
export const getChamadosSuporte = async (): Promise<ISupportTicketItem[]> => {
  try {
    const response = await api.get('super_admin/support')
    if (Array.isArray(response.data)) {
      return response.data as ISupportTicketItem[]
    }
    return []
  } catch (error) {
    console.warn('Endpoint /super_admin/support indisponível ou falhou:', error)
    throw error
  }
}

/**
 * Carrega os dados consolidados do dashboard.
 * Tenta primeiro o endpoint agregado otimizado GET /super_admin/dashboard.
 * Caso ainda não esteja deployado (404), executa agregação no cliente via chamadas paralelas.
 */
export const getDashboardData = async (periodo?: string): Promise<IDashboardData> => {
  try {
    const response = await api.get<IDashboardData>('super_admin/dashboard', {
      params: periodo ? { periodo } : undefined,
    })
    if (response.data && response.data.kpis) {
      return response.data
    }
  } catch (err: unknown) {
    // Se for erro de rede/servidor diferente de 404, loga e tenta fallback
    console.warn('Endpoint /super_admin/dashboard não disponível, aplicando agregação de rotas operacionais:', err)
  }

  // Fallback: consome rotas operacionais existentes e agrega os dados
  try {
    const [employeesRes, cdsRes, ticketsRes] = await Promise.all([
      api.get('super_admin/employees_admin').catch(() => ({ data: [] })),
      api.get('cd').catch(() => ({ data: [] })),
      api.get('super_admin/support').catch(() => ({ data: [] })),
    ])

    const rawAdmins = Array.isArray(employeesRes.data) ? employeesRes.data : []
    const rawCds = Array.isArray(cdsRes.data) ? cdsRes.data : []
    const rawTickets: ISupportTicketItem[] = Array.isArray(ticketsRes.data) ? ticketsRes.data : []

    // 1. Contagens de situação
    let regist = 0
    let emAtend = 0
    let atendidos = 0

    const porCategoria: Record<ISupportTicketCategory, number> = {
      DUVIDA: 0,
      SUGESTAO: 0,
      RECLAMACAO: 0,
      OUTRO: 0,
    }

    rawTickets.forEach((ticket) => {
      // Contagem por situação
      if (ticket.status === 'REGISTRADO') regist++
      else if (ticket.status === 'EM_ATENDIMENTO') emAtend++
      else if (ticket.status === 'ATENDIDO') atendidos++

      // Contagem por categoria
      if (ticket.categoria && ticket.categoria in porCategoria) {
        porCategoria[ticket.categoria]++
      } else {
        porCategoria.OUTRO++
      }
    })

    // 2. Administradores por CD (vínculos)
    const cdMap = new Map<string, { cdNome: string; count: number }>()
    rawCds.forEach((cd: { id?: string; nome?: string }) => {
      if (cd.id) {
        cdMap.set(String(cd.id), { cdNome: cd.nome || `CD #${cd.id}`, count: 0 })
      }
    })

    rawAdmins.forEach((adm: { cd?: Array<{ id?: string; nome?: string }> | string }) => {
      if (Array.isArray(adm.cd)) {
        adm.cd.forEach((c) => {
          if (c && c.id) {
            const entry = cdMap.get(String(c.id))
            if (entry) entry.count++
            else cdMap.set(String(c.id), { cdNome: c.nome || `CD #${c.id}`, count: 1 })
          }
        })
      }
    })

    const administradoresPorCd: IAdminPerCd[] = Array.from(cdMap.entries()).map(([cdId, data]) => ({
      cdId,
      cdNome: data.cdNome,
      totalAdmins: data.count,
    }))

    // 3. Chamados recentes ordenados por dataHoraAbertura decrescente
    const chamadosRecentes = [...rawTickets]
      .sort((a, b) => {
        const dateA = a.dataHoraAbertura ? new Date(a.dataHoraAbertura).getTime() : 0
        const dateB = b.dataHoraAbertura ? new Date(b.dataHoraAbertura).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 5)

    const porSituacao: Record<ISupportTicketStatus, number> = {
      REGISTRADO: regist,
      EM_ATENDIMENTO: emAtend,
      ATENDIDO: atendidos,
    }

    return {
      kpis: {
        totalAdministradores: rawAdmins.length,
        totalCds: rawCds.length,
        chamadosAbertos: regist + emAtend,
        chamadosRegistrados: regist,
        chamadosEmAtendimento: emAtend,
        chamadosAtendidos: atendidos,
      },
      chamadosPorSituacao: porSituacao,
      chamadosPorCategoria: porCategoria,
      administradoresPorCd,
      chamadosRecentes,
      ultimaAtualizacao: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Falha ao processar agregação de dados do dashboard:', error)
    throw new Error('Não foi possível carregar os dados do dashboard. Verifique sua conexão com o servidor.', {
      cause: error,
    })
  }
}
