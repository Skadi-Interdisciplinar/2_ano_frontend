export interface Administrator {
  id: string
  nome: string
  username: string
  email: string
  senha?: string
  acesso?: string
  cd?: string
  gestor?: string
}

export type IEmployee = Administrator

export interface IStaffTableProps {
  administrators: Administrator[]
  columns: string[]
}

export interface IEmployeeDetailsParams {
  id: string
}
