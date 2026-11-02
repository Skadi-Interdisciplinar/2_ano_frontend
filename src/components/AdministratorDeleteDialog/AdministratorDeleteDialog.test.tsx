import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdministratorDeleteDialog } from './AdministratorDeleteDialog.tsx'

describe('AdministratorDeleteDialog', () => {
  it('pede confirmação e só exclui ao confirmar', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(<AdministratorDeleteDialog onCancel={onCancel} onConfirm={onConfirm} />)

    expect(screen.getByText('Confirma a exclusão desse Administrador?')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
