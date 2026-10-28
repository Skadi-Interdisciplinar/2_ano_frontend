import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { administradoresDeTeste } from '../../data/administrators.ts'
import { AdministratorsScreen } from './AdministratorsScreen.tsx'

vi.mock('../../service/employees.ts', () => ({
  getFuncionarios: vi.fn(async () => []),
  createAdministrador: vi.fn(),
  updateAdministrador: vi.fn(),
}))

describe('AdministratorsScreen', () => {
  it('mostra os usuários de teste enquanto a API não devolve administradores', () => {
    render(<AdministratorsScreen />)

    expect(screen.getAllByRole('article')).toHaveLength(administradoresDeTeste.length)
    expect(screen.getByRole('article', { name: 'Ana Souza' })).toBeTruthy()
    expect(screen.getByText(`0 - ${administradoresDeTeste.length} of ${administradoresDeTeste.length}`)).toBeTruthy()
  })

  it('filtra os usuários de teste pela busca', () => {
    render(<AdministratorsScreen />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar administrador' }), {
      target: { value: 'Marina' },
    })

    expect(screen.getByRole('article', { name: 'Marina Costa' })).toBeTruthy()
    expect(screen.queryByRole('article', { name: 'Ana Souza' })).toBeNull()
  })
})
