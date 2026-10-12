import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pagination } from './Pagination.tsx'

describe('Pagination', () => {
  it('mostra o intervalo da lista', () => {
    render(<Pagination label="0 - 20 of 55" />)

    expect(screen.getByText('0 - 20 of 55')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeTruthy()
  })
})
