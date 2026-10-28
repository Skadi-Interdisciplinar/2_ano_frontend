import type { Cd } from './distributionCenter.ts'

export interface Administrator {
  id: string | number
  nome: string
  username: string
  cpf: string
  email: string
  senha: string
  nivelAcesso: string
  cdGestor: Cd | null
  cd: Cd[] | null
  codGestor: number | null
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

const cdOsasco: Cd = { id: 1, name: 'CD Osasco', cnpj: '12345678000190' }
const cdCampinas: Cd = { id: 2, name: 'CD Campinas', cnpj: '98765432000110' }
const cdCuritiba: Cd = { id: 3, name: 'CD Curitiba', cnpj: '11222333000181' }

export const administradoresDeTeste: Administrator[] = [
  {
    id: 1,
    nome: 'Ana Souza',
    username: 'ana.souza',
    cpf: '10987654321',
    email: 'ana.souza@skadi.com',
    senha: '********',
    nivelAcesso: 'ADMIN',
    cdGestor: null,
    cd: [cdOsasco],
    codGestor: null,
  },
  {
    id: 2,
    nome: 'Marina Costa',
    username: 'marina.costa',
    cpf: '20876543210',
    email: 'marina.costa@skadi.com',
    senha: '********',
    nivelAcesso: 'ADMIN',
    cdGestor: null,
    cd: [cdCampinas, cdCuritiba],
    codGestor: null,
  },
  {
    id: 3,
    nome: 'Lucas Ferreira',
    username: 'lucas.ferreira',
    cpf: '30765432109',
    email: 'lucas.ferreira@skadi.com',
    senha: '********',
    nivelAcesso: 'ADMIN',
    cdGestor: null,
    cd: [cdCuritiba],
    codGestor: null,
  },
  {
    id: 4,
    nome: 'Beatriz Lima',
    username: 'beatriz.lima',
    cpf: '40654321098',
    email: 'beatriz.lima@skadi.com',
    senha: '********',
    nivelAcesso: 'ADMIN',
    cdGestor: null,
    cd: [cdOsasco, cdCampinas],
    codGestor: null,
  },
]
