import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResetPasswordModal } from './ResetPasswordModal.tsx'

describe('ResetPasswordModal', () => {
  it('renderiza o cabeçalho e todos os campos com os labels corretos', () => {
    render(<ResetPasswordModal onBack={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Redefinir senha' })).toBeTruthy()
    expect(screen.getByText('Escolha uma combinação segura')).toBeTruthy()
    expect(screen.getByText('Senha atual')).toBeTruthy()
    expect(screen.getByText('Nova senha')).toBeTruthy()
    expect(screen.getByText('Repita a senha nova')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirmar nova senha' })).toBeTruthy()
  })

  it('exibe erro caso algum campo esteja vazio', () => {
    const onSubmit = vi.fn()
    render(<ResetPasswordModal onBack={vi.fn()} onSubmit={onSubmit} />)

    const submitBtn = screen.getByRole('button', { name: 'Confirmar nova senha' })
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Preencha todos os campos para continuar.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exibe erro se a nova senha e a confirmação não coincidirem', () => {
    const onSubmit = vi.fn()
    render(<ResetPasswordModal onBack={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Insira sua senha atual'), {
      target: { value: 'antiga123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Insira sua nova senha'), {
      target: { value: 'nova12345' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirme sua nova senha'), {
      target: { value: 'diferente123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar nova senha' }))

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('A nova senha e a confirmação não coincidem.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submete os dados corretamente quando todos os campos são válidos', () => {
    const onSubmit = vi.fn()
    render(<ResetPasswordModal onBack={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Insira sua senha atual'), {
      target: { value: 'antiga123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Insira sua nova senha'), {
      target: { value: 'segura123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirme sua nova senha'), {
      target: { value: 'segura123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar nova senha' }))

    expect(onSubmit).toHaveBeenCalledWith({
      senhaAtual: 'antiga123',
      novaSenha: 'segura123',
      confirmarNovaSenha: 'segura123',
    })
  })

  it('aciona o botão de voltar', () => {
    const onBack = vi.fn()
    render(<ResetPasswordModal onBack={onBack} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para o perfil' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
