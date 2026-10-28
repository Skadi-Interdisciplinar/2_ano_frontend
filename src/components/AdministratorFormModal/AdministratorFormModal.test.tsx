import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Administrator } from '../../data/administrators.ts'
import { AdministratorFormModal } from './AdministratorFormModal.tsx'

const administrator: Administrator = {
  id: 10,
  nome: 'Enzo',
  username: 'enzo.admin',
  cpf: '12345678901',
  email: 'enzo.admin@email.com',
  senha: 'senha',
  nivelAcesso: 'ADMIN',
  cdGestor: null,
  cd: [{ id: 1, name: 'CD Osasco', cnpj: '12345678901234' }],
  codGestor: 10,
}

const availableCds = [
  { id: 1, name: 'CD Osasco', cnpj: '12345678901234' },
  { id: 2, name: 'CD Belterra', cnpj: '00.000.000/0001-00' },
]

describe('AdministratorFormModal', () => {
  it('preenche os valores existentes e bloqueia o acesso ADMIN', () => {
    render(
      <AdministratorFormModal
        mode="edit"
        administrator={administrator}
        availableCds={availableCds}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByDisplayValue('Enzo')).toBeTruthy()
    expect(screen.getByDisplayValue('enzo.admin')).toBeTruthy()
    expect(screen.getByDisplayValue('12345678901')).toBeTruthy()
    expect(screen.getByDisplayValue('enzo.admin@email.com')).toBeTruthy()

    const acesso = screen.getByDisplayValue('ADMIN') as HTMLInputElement
    expect(acesso.disabled).toBe(true)
  })

  it('envia o administrador com a role ADMIN e os CDs escolhidos', () => {
    const onSubmit = vi.fn()
    render(
      <AdministratorFormModal
        mode="create"
        availableCds={availableCds}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Enzo' } })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'enzo.admin' } })
    fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '12345678901' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'enzo.admin@email.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha' } })
    fireEvent.click(screen.getByRole('button', { name: 'Centros de distribuição' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'CD Osasco' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'CD Belterra' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith({
      nome: 'Enzo',
      username: 'enzo.admin',
      cpf: '12345678901',
      email: 'enzo.admin@email.com',
      senha: 'senha',
      nivelAcesso: 'ADMIN',
      cdGestor: null,
      cd: availableCds,
      codGestor: null,
    })
  })
})
