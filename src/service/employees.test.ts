import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../config/axiosConnection.ts'
import { createAdministrador, deleteAdministrador, getCds, getFuncionarios, updateAdministrador } from './employees.ts'

vi.mock('../config/axiosConnection.ts', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
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

const updatePayload = {
  id: 10,
  nome: 'Enzo',
  username: 'enzo.admin',
  cpf: '12345678901',
  email: 'novo@email.com',
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
    vi.mocked(api.delete).mockReset()
  })

  it('busca os centros de distribuição', async () => {
    const cds = [{ id: 1, name: 'CD Osasco', cnpj: '12345678901234' }]
    vi.mocked(api.get).mockResolvedValue({ data: cds })

    await expect(getCds()).resolves.toEqual(cds)
    expect(api.get).toHaveBeenCalledWith('/cd')
  })

  it('busca os funcionários e devolve o corpo da resposta', async () => {
    const employees = [{ id: 1, nome: 'Ana' }]
    vi.mocked(api.get).mockResolvedValue({ data: employees })

    await expect(getFuncionarios()).resolves.toEqual(employees)
    expect(api.get).toHaveBeenCalledWith('super_admin/employees_admin')
  })

  it('cadastra um administrador em /auth/register', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: '' })

    await expect(createAdministrador(payload)).resolves.toEqual('')
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload)
  })

  it('atualiza um administrador pelo id no corpo e na URL', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: updatePayload })

    await expect(updateAdministrador(updatePayload)).resolves.toEqual(updatePayload)
    expect(api.put).toHaveBeenCalledWith('super_admin/employees_admin/10', updatePayload)
  })

  it('exclui um administrador pelo id', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: '' })

    await deleteAdministrador(10)
    expect(api.delete).toHaveBeenCalledWith('super_admin/employees_admin/10')
  })

  it('propaga a falha da requisição', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network Error'))

    await expect(getFuncionarios()).rejects.toThrow('Network Error')
  })
})
