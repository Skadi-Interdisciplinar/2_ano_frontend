import type { Cd } from './distributionCenter.ts'

export interface CodGestor {
  id: number
  nome: string
  username: string
  email: string
  nivelAcesso: string
}

export interface Administrator {
  id: string | number
  nome: string
  username: string
  cpf: string
  email: string
  nivelAcesso: string
  cdGestor: Cd | null
  cd: Cd[] | null
  /** Nesta listagem de ADMIN vem sempre null. O objeto é o usuário gestor, usado só nesse papel. */
  codGestor: CodGestor | null
  gestorNome?: string | null
}

export function rotuloAcesso(nivel: string) {
  return nivel.toUpperCase() === 'ADMIN' ? 'Admin' : nivel
}

export function rotuloGestor(administrator?: Pick<Administrator, 'gestorNome' | 'cdGestor'> | null) {
  const nome = administrator?.gestorNome?.trim() || administrator?.cdGestor?.name?.trim()
  return nome || 'não possui'
}

export interface AdministratorInput {
  nome: string
  username: string
  cpf: string
  email: string
  senha: string
  nivelAcesso: 'ADMIN'
  cdGestor: null
  cd: Cd[]
  codGestor: null
}

export interface AdministratorUpdate {
  id: string | number
  nome: string
  username: string
  cpf: string
  email: string
  nivelAcesso: 'ADMIN'
  cdGestor: null
  cd: Cd[]
  codGestor: null
}
