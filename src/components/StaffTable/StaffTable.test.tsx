import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { StaffTable } from './StaffTable.tsx'

const administrator: Administrator = {
  id: 'ana-souza',
  nome: 'Ana',
  username: 'Ana.souza',
  email: 'ana.souza@institutojef.org.br',
  senha: '*******',
  acesso: 'Operador',
  cd: 'Belterra',
  gestor: 'Beatriz Hinsching',
}

describe('StaffTable', () => {
  it('lista um card para cada administrador', () => {
    const onDelete = vi.fn()
    render(<StaffTable administrators={[administrator]} onDelete={onDelete} />)

    expect(screen.getByRole('article', { name: 'Ana' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Excluir Ana' }))

    expect(onDelete).toHaveBeenCalledWith('ana-souza')
  })
})
