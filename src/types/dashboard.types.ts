export type ISupportTicketStatus = 'REGISTRADO' | 'EM_ATENDIMENTO' | 'ATENDIDO'

export type ISupportTicketCategory = 'DUVIDA' | 'SUGESTAO' | 'RECLAMACAO' | 'OUTRO'

export interface ISupportTicketItem {
  id: string
  solicitanteId?: string
  solicitanteNome?: string
  categoria: ISupportTicketCategory
  descricao: string
  status: ISupportTicketStatus
  dataHoraAbertura: string
  dataHoraEncerramento?: string
  resposta?: string
  responsavelId?: string
  responsavelNome?: string
}

export interface ICdItem {
  id: string
  nome: string
  localizacao?: string
}

export interface IDashboardKpis {
  totalAdministradores: number
  totalCds: number
  chamadosAbertos: number
  chamadosRegistrados: number
  chamadosEmAtendimento: number
  chamadosAtendidos: number
}

export interface IAdminPerCd {
  cdId: string
  cdNome: string
  totalAdmins: number
}

export interface IDashboardData {
  kpis: IDashboardKpis
  chamadosPorSituacao: Record<ISupportTicketStatus, number>
  chamadosPorCategoria: Record<ISupportTicketCategory, number>
  administradoresPorCd: IAdminPerCd[]
  chamadosRecentes: ISupportTicketItem[]
  ultimaAtualizacao: string
}

export interface IUserMe {
  id: string
  nome: string
  username: string
  email?: string
  nivelAcesso?: string
  cargo?: string
  unidade?: string
}
