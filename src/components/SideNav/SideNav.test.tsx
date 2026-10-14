import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SideNav } from './SideNav.tsx'

describe('SideNav', () => {
  it('marca administradores como a página atual', () => {
    render(<SideNav />)

    expect(screen.getByRole('button', { name: 'ADMINISTRADORES' })).toHaveProperty(
      'ariaCurrent',
      'page',
    )
    expect(screen.getByRole('button', { name: 'DASHBOARDS' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'CHAMADOS' })).toBeTruthy()
  })

  it('dispara a saída', () => {
    const onLogout = vi.fn()
    render(<SideNav onLogout={onLogout} />)

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(onLogout).toHaveBeenCalledOnce()
  })

  it('permite navegar para o perfil ao clicar no botão do perfil', () => {
    const onNavigate = vi.fn()
    render(<SideNav onNavigate={onNavigate} />)

    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))
    expect(onNavigate).toHaveBeenCalledWith('perfil')
  })
})
