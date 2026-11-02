export const CATEGORIAS = ['DUVIDA', 'SUGESTAO', 'RECLAMACAO', 'OUTRO'] as const
export const STATUS_CHAMADO = ['REGISTRADO', 'EM_ATENDIMENTO', 'ATENDIDO'] as const

export type CategoriaChamado = (typeof CATEGORIAS)[number]
export type StatusChamado = (typeof STATUS_CHAMADO)[number]

export interface Chamado {
  id: number
  codUsuarioSolicitante: number
  categoria: CategoriaChamado
  descricao: string
  status: StatusChamado
  dataHoraAbertura: string
  dataHoraEncerramento: string | null
  resposta: string | null
  codUsuarioResponsavel: number | null
}

export interface ChamadoAbertura {
  categoria: CategoriaChamado
  descricao: string
}

export interface ChamadoEdicao {
  categoria: CategoriaChamado
  descricao: string
  resposta: string | null
}

export function rotuloCategoria(categoria: string) {
  switch (categoria) {
    case 'DUVIDA':
      return 'Dúvida'
    case 'SUGESTAO':
      return 'Sugestão'
    case 'RECLAMACAO':
      return 'Reclamação'
    case 'OUTRO':
      return 'Outro'
    default:
      return categoria
  }
}

export function rotuloStatus(status: string) {
  switch (status) {
    case 'REGISTRADO':
      return 'Registrado'
    case 'EM_ATENDIMENTO':
      return 'Em atendimento'
    case 'ATENDIDO':
      return 'Atendido'
    default:
      return status
  }
}

export function ehSuperAdmin(cargo?: string | null) {
  return cargo?.trim().toUpperCase() === 'SUPER_ADMIN'
}
