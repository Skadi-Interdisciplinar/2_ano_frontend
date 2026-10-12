import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandTitle } from './BrandTitle.tsx'

describe('BrandTitle', () => {
  it('mostra a marca e a seção de administradores', () => {
    render(<BrandTitle />)

    expect(screen.getByRole('heading', { name: 'SKADI|Administradores' })).toBeTruthy()
  })
})
