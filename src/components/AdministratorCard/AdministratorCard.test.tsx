import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { AdministratorCard } from './AdministratorCard.tsx'

const administrator: Administrator = {
  id: 'gustavo-munhoz',
  nome: 'Gustavo',
  username: 'Guh.munhoz',
  cpf: '12345678901',
  email: 'gustavo.munhoz@institutojef.org.br',
  nivelAcesso: 'ADMIN',
  cdGestor: null,
  cd: [
    { id: 1, name: 'CD Osasco', cnpj: '12345678901234' },
    { id: 2, name: 'CD Belterra', cnpj: '00.000.000/0001-00' },
  ],
  codGestor: null,
}

describe('AdministratorCard', () => {
  it('mostra o primeiro CD e abre os demais ao clicar', () => {
    render(<AdministratorCard administrator={administrator} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByRole('article', { name: 'Gustavo' })).toBeTruthy()
    expect(screen.getByText('não possui')).toBeTruthy()
    expect(screen.getByText('CD Osasco')).toBeTruthy()
    expect(screen.queryByText('CD Belterra')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Centros de distribuição de Gustavo' }))

    expect(screen.getByText('CD Belterra')).toBeTruthy()
  })

  it('permite editar e excluir o card', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<AdministratorCard administrator={administrator} onDelete={onDelete} onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Editar Gustavo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Excluir Gustavo' }))

    expect(onEdit).toHaveBeenCalledWith(administrator)
    expect(onDelete).toHaveBeenCalledWith('gustavo-munhoz')
  })
})
