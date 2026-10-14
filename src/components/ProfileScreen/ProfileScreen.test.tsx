import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ProfileScreen } from './ProfileScreen.tsx'

vi.mock('../../service/profile.ts', () => ({
  getPerfil: vi.fn().mockResolvedValue({
    id: 'super-admin-01',
    nome: 'Pedro Henrique',
    cargo: 'Super Administrador',
    usuario: 'pedhen.8002',
    unidade: 'JBS Belterra',
    email: 'pedro.henrique@skadi.com',
    avatar: 'P',
  }),
  atualizarPreferencias: vi.fn().mockResolvedValue({
    modoEscuro: false,
    idioma: 'Português - BR',
  }),
  redefinirSenha: vi.fn().mockResolvedValue({
    success: true,
    message: 'Senha redefinida com sucesso!',
  }),
}))

describe('ProfileScreen', () => {
  it('renderiza o cabeçalho com a seção Perfil e o card de perfil', async () => {
    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'SKADI|Perfil' })).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pedro Henrique' })).toBeTruthy()
    })
  })

  it('alterna para a tela de redefinição de senha ao clicar no botão', async () => {
    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Redefinir senha de acesso' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha de acesso' }))

    expect(screen.getByRole('heading', { name: 'Redefinir senha' })).toBeTruthy()
    expect(screen.getByText('Escolha uma combinação segura')).toBeTruthy()
  })

  it('exibe o diálogo de confirmação após preenchimento válido e permite confirmar', async () => {
    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Redefinir senha de acesso' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha de acesso' }))

    fireEvent.change(screen.getByPlaceholderText('Insira sua senha atual'), {
      target: { value: 'antiga123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Insira sua nova senha'), {
      target: { value: 'nova12345' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirme sua nova senha'), {
      target: { value: 'nova12345' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar nova senha' }))

    expect(
      screen.getByText('Tem certeza de que quer redefinir sua senha?'),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(screen.getByText('Senha redefinida com sucesso!')).toBeTruthy()
    })
  })
})
