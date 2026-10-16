import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdministratorsScreen } from './AdministratorsScreen.tsx'

describe('AdministratorsScreen', () => {
  it('começa sem cards enquanto não há administradores', () => {
    render(<AdministratorsScreen />)

    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.getByText('0 - 0 of 0')).toBeTruthy()
  })

  it('mantém a lista vazia ao buscar', () => {
    render(<AdministratorsScreen />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar administrador' }), {
      target: { value: 'Marina' },
    })

    expect(screen.queryByRole('article')).toBeNull()
  })
})
