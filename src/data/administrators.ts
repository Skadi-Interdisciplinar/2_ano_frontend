import type { Cd } from "./distributionCenter"

export interface Administrator {
  id: string
  nome: string
  username: string
  email: string
  senha: string
  acesso: string
  cd: Cd
  gestor: string
}





