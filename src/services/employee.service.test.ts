import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './api.ts'
import { getFuncionarios } from './employee.service.ts'

vi.mock('./api.ts', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('employee.service - getFuncionarios', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  it('busca os funcionários e devolve o corpo da resposta', async () => {
    const employees = [{ id: '1', nome: 'Ana', username: 'ana', email: 'ana@email.com' }]
    vi.mocked(api.get).mockResolvedValue({ data: employees })

    await expect(getFuncionarios()).resolves.toEqual(employees)
    expect(api.get).toHaveBeenCalledWith('super_admin/employees_admin')
  })

  it('propaga a falha da requisição', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network Error'))

    await expect(getFuncionarios()).rejects.toThrow('Network Error')
  })
})
