import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../config/axiosConnection.ts'
import { createAdministrador, getFuncionarios, updateAdministrador } from './employees.ts'

vi.mock('../config/axiosConnection.ts', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const payload = {
  nome: 'Enzo',
  username: 'enzo.admin',
  cpf: '12345678901',
  email: 'enzo.admin@email.com',
  senha: 'senha',
  nivelAcesso: 'ADMIN' as const,
  cdGestor: null,
  cd: [{ id: 1, name: 'CD Osasco', cnpj: '12345678901234' }],
  codGestor: null,
}

describe('employees service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.put).mockReset()
  })

  it('busca os funcionários e devolve o corpo da resposta', async () => {
    const employees = [{ id: '1', nome: 'Ana' }]
    vi.mocked(api.get).mockResolvedValue({ data: employees })

    await expect(getFuncionarios()).resolves.toEqual(employees)
    expect(api.get).toHaveBeenCalledWith('super_admin/employees_admin')
  })

  it('cadastra um administrador em /auth/register', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })

    await expect(createAdministrador(payload)).resolves.toEqual({ id: 1 })
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload)
  })

  it('atualiza um administrador sem alterar o caminho da role', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: payload })

    await expect(updateAdministrador(10, payload)).resolves.toEqual(payload)
    expect(api.put).toHaveBeenCalledWith('super_admin/employees_admin/10', payload)
  })

  it('propaga a falha da requisição', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network Error'))

    await expect(getFuncionarios()).rejects.toThrow('Network Error')
  })
})
