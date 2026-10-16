import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { AdministratorCard } from './AdministratorCard.tsx'

const administrator: Administrator = {
  id: 'gustavo-munhoz',
  nome: 'Gustavo',
  username: 'Guh.munhoz',
  email: 'gustavo.munhoz@institutojef.org.br',
  senha: '*******',
  acesso: 'Admin',
  cd: { id: 1, name: 'Belterra', cnpj: '00.000.000/0001-00' },
  gestor: 'Beatriz Hinsching',
}

describe('AdministratorCard', () => {
  it('mostra os dados de um administrador e permite excluir o card', () => {
    const onDelete = vi.fn()
    render(<AdministratorCard administrator={administrator} onDelete={onDelete} />)

    expect(screen.getByRole('article', { name: 'Gustavo' })).toBeTruthy()
    expect(screen.getByText('Guh.munhoz')).toBeTruthy()
    expect(screen.getByText('Belterra')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Excluir Gustavo' }))

    expect(onDelete).toHaveBeenCalledWith('gustavo-munhoz')
  })
})
