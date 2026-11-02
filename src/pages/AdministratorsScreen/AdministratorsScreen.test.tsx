import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { deleteAdministrador, getCds, getFuncionarios } from '../../service/employees.ts'
import { AdministratorsScreen } from './AdministratorsScreen.tsx'

vi.mock('../../service/employees.ts', () => ({
  getFuncionarios: vi.fn(async () => []),
  getCds: vi.fn(async () => []),
  createAdministrador: vi.fn(),
  updateAdministrador: vi.fn(),
  deleteAdministrador: vi.fn(),
  mensagemDaApi: vi.fn((_error: unknown, fallback: string) => fallback),
}))

const administrator: Administrator = {
  id: 3,
  nome: 'Enzo Nascimento',
  username: 'enzo.n',
  cpf: '12345678901',
  email: 'enzo@email.com',
  nivelAcesso: 'ADMIN',
  cdGestor: null,
  cd: [{ id: 1, name: 'CD Osasco', cnpj: '12345678901234' }],
  codGestor: null,
}

describe('AdministratorsScreen', () => {
  beforeEach(() => {
    vi.mocked(getFuncionarios).mockReset()
    vi.mocked(getFuncionarios).mockResolvedValue([])
    vi.mocked(getCds).mockReset()
    vi.mocked(getCds).mockResolvedValue([])
    vi.mocked(deleteAdministrador).mockReset()
    vi.mocked(deleteAdministrador).mockResolvedValue(undefined)
  })

  it('mostra só os administradores devolvidos pela API', async () => {
    vi.mocked(getFuncionarios).mockResolvedValue([administrator])
    render(<AdministratorsScreen />)

    expect(await screen.findByRole('article', { name: 'Enzo Nascimento' })).toBeTruthy()
    expect(screen.queryByRole('columnheader', { name: 'Senha' })).toBeNull()
    expect(screen.getByText('0 - 1 of 1')).toBeTruthy()
  })

  it('fica vazia quando a API não devolve administradores', async () => {
    render(<AdministratorsScreen />)

    await waitFor(() => expect(getFuncionarios).toHaveBeenCalled())
    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.getByText('0 - 0 of 0')).toBeTruthy()
  })

  it('filtra a lista pela busca', async () => {
    vi.mocked(getFuncionarios).mockResolvedValue([
      administrator,
      { ...administrator, id: 4, nome: 'Marina Costa', username: 'marina.costa' },
    ])
    render(<AdministratorsScreen />)

    expect(await screen.findByRole('article', { name: 'Marina Costa' })).toBeTruthy()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar administrador' }), {
      target: { value: 'Marina' },
    })

    expect(screen.getByRole('article', { name: 'Marina Costa' })).toBeTruthy()
    expect(screen.queryByRole('article', { name: 'Enzo Nascimento' })).toBeNull()
  })

  it('pede confirmação antes de excluir e busca a lista de novo', async () => {
    vi.mocked(getFuncionarios).mockResolvedValueOnce([administrator]).mockResolvedValueOnce([])
    render(<AdministratorsScreen />)

    fireEvent.click(await screen.findByRole('button', { name: 'Excluir Enzo Nascimento' }))
    expect(screen.getByText('Confirma a exclusão desse Administrador?')).toBeTruthy()
    expect(deleteAdministrador).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => expect(deleteAdministrador).toHaveBeenCalledWith(3))
    await waitFor(() => expect(screen.queryByRole('article')).toBeNull())
  })
})
