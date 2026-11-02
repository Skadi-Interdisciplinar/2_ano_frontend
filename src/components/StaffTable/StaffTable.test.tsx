import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { StaffTable } from './StaffTable.tsx'

const administrator: Administrator = {
  id: 'ana-souza',
  nome: 'Ana',
  username: 'Ana.souza',
  cpf: '10987654321',
  email: 'ana.souza@institutojef.org.br',
  nivelAcesso: 'ADMIN',
  cdGestor: null,
  cd: [{ id: 1, name: 'CD Osasco', cnpj: '12345678901234' }],
  codGestor: null,
}

describe('StaffTable', () => {
  it('lista um card para cada administrador', () => {
    const onDelete = vi.fn()
    render(<StaffTable administrators={[administrator]} onDelete={onDelete} onEdit={vi.fn()} />)

    expect(screen.queryByRole('columnheader', { name: 'CPF' })).toBeNull()
    expect(screen.queryByRole('columnheader', { name: 'Senha' })).toBeNull()
    expect(screen.getByRole('columnheader', { name: 'Gestor' })).toBeTruthy()
    expect(screen.getByRole('article', { name: 'Ana' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Excluir Ana' }))

    expect(onDelete).toHaveBeenCalledWith('ana-souza')
  })
})
