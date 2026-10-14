import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog.tsx'

describe('ConfirmDialog', () => {
  it('não renderiza nada quando isOpen é false', () => {
    const { container } = render(
      <ConfirmDialog isOpen={false} onCancel={vi.fn()} onConfirm={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza título, mensagem e botões quando isOpen é true', () => {
    render(<ConfirmDialog isOpen={true} onCancel={vi.fn()} onConfirm={vi.fn()} />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Redefinir senha' })).toBeTruthy()
    expect(
      screen.getByText('Tem certeza de que quer redefinir sua senha?'),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy()
  })

  it('aciona o callback onCancel ao clicar em Cancelar', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog isOpen={true} onCancel={onCancel} onConfirm={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('aciona o callback onConfirm ao clicar em Confirmar', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog isOpen={true} onCancel={vi.fn()} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('fecha o diálogo ao pressionar a tecla Escape', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog isOpen={true} onCancel={onCancel} onConfirm={vi.fn()} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
