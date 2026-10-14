import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfileCard } from './ProfileCard.tsx'
import { DEFAULT_USER_PROFILE, DEFAULT_PROFILE_PREFERENCES } from '../../data/profile.ts'

describe('ProfileCard', () => {
  it('renderiza as informações do usuário e preferências', () => {
    const onOpenResetPassword = vi.fn()
    render(
      <ProfileCard
        profile={DEFAULT_USER_PROFILE}
        preferences={DEFAULT_PROFILE_PREFERENCES}
        onOpenResetPassword={onOpenResetPassword}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Pedro Henrique' })).toBeTruthy()
    expect(screen.getByText('Super Administrador')).toBeTruthy()
    expect(screen.getByText('pedhen.8002')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Preferências' })).toBeTruthy()
    expect(screen.getByText('Português - BR')).toBeTruthy()
  })

  it('chama o callback para abrir o fluxo de redefinição de senha', () => {
    const onOpenResetPassword = vi.fn()
    render(
      <ProfileCard
        profile={DEFAULT_USER_PROFILE}
        onOpenResetPassword={onOpenResetPassword}
      />,
    )

    const button = screen.getByRole('button', { name: 'Redefinir senha de acesso' })
    fireEvent.click(button)

    expect(onOpenResetPassword).toHaveBeenCalledTimes(1)
  })

  it('alterna o modo escuro ao clicar no switch', () => {
    const onToggleDarkMode = vi.fn()
    render(
      <ProfileCard
        profile={DEFAULT_USER_PROFILE}
        onOpenResetPassword={vi.fn()}
        onToggleDarkMode={onToggleDarkMode}
      />,
    )

    const switchBtn = screen.getByRole('switch', { name: 'Modo escuro' })
    expect(switchBtn.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(switchBtn)
    expect(switchBtn.getAttribute('aria-checked')).toBe('true')
    expect(onToggleDarkMode).toHaveBeenCalledWith(true)
  })
})
