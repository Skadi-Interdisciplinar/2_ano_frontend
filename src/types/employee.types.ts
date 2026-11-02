import type { Cd } from '../data/distributionCenter.ts'

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
  codGestor: CodGestor | null
  gestorNome?: string | null
  senha?: string
}

export type IEmployee = Administrator

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

export interface IStaffTableProps {
  administrators: Administrator[]
  columns?: string[]
  onDelete?: (id: string | number) => void
  onEdit?: (admin: Administrator) => void
}

export interface IEmployeeDetailsParams {
  id: string
}
