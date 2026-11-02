import type {
  CodGestor,
  Administrator,
  AdministratorInput,
  AdministratorUpdate,
} from '../types/employee.types.ts'

export type { CodGestor, Administrator, AdministratorInput, AdministratorUpdate }

export function rotuloAcesso(nivel: string) {
  return nivel.toUpperCase() === 'ADMIN' ? 'Admin' : nivel
}

export function rotuloGestor(administrator?: Pick<Administrator, 'gestorNome' | 'cdGestor'> | null) {
  const nome = administrator?.gestorNome?.trim() || administrator?.cdGestor?.name?.trim()
  return nome || 'não possui'
}
