import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App.tsx'
import { salvarComVersao } from './utils/storage.utils.ts'
// Pré-carregamento dos módulos para evitar lentidão de dynamic import no jsdom sob carga de CPU
import './pages/Login/index.tsx'
import './pages/Profile/index.tsx'

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it(
    'redireciona para /login ao tentar acessar rota privada desautenticado',
    async () => {
      window.history.pushState({}, 'Perfil', '/perfil')
      render(<App />)

      // Permite o ciclo de redirecionamento assíncrono do React Router
      await new Promise((r) => setTimeout(r, 50))

      // PrivateRoute intercepta e redireciona para login
      const heading = await screen.findByRole(
        'heading',
        { name: /S K A D I/i },
        { timeout: 25000 },
      )
      expect(heading).toBeTruthy()
    },
    90000,
  )

  it('renderiza o Perfil quando autenticado via PrivateRoute', async () => {
    salvarComVersao('skadi_token', 'fake-token-123', 1)
    salvarComVersao(
      'skadi_user',
      {
        id: 1,
        nome: 'Administrador Teste',
        usuario: 'admin.teste',
        email: 'admin@skadi.com',
        nivelAcesso: 'SUPER_ADMIN',
      },
      1,
    )

    window.history.pushState({}, 'Perfil', '/perfil')
    render(<App />)

    const heading = await screen.findByRole('heading', { name: 'SKADI|Perfil' })
    expect(heading).toBeTruthy()
  })
})
