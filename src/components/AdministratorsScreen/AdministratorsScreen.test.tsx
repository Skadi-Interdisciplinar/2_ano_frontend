import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../contexts/AuthContext.tsx'
import { AccessibilityProvider } from '../../contexts/AccessibilityContext.tsx'
import { AdministratorsScreen } from './AdministratorsScreen.tsx'

vi.mock('../../service/employees.ts', () => ({
  getFuncionarios: vi.fn().mockResolvedValue([]),
}))

function renderComponent() {
  return render(
    <MemoryRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <AdministratorsScreen />
        </AuthProvider>
      </AccessibilityProvider>
    </MemoryRouter>,
  )
}

describe('AdministratorsScreen', () => {
  it('começa sem cards enquanto não há administradores', () => {
    renderComponent()

    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.getByText('0 - 0 of 0')).toBeTruthy()
  })

  it('mantém a lista vazia ao buscar', () => {
    renderComponent()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar administrador' }), {
      target: { value: 'Marina' },
    })

    expect(screen.queryByRole('article')).toBeNull()
  })
})
