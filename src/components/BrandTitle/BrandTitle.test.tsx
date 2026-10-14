import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandTitle } from './BrandTitle.tsx'

describe('BrandTitle', () => {
  it('mostra a marca e a seção padrão de administradores', () => {
    render(<BrandTitle />)

    expect(screen.getByRole('heading', { name: 'SKADI|Administradores' })).toBeTruthy()
  })

  it('mostra a marca e a seção customizada de Perfil', () => {
    render(<BrandTitle section="Perfil" />)

    expect(screen.getByRole('heading', { name: 'SKADI|Perfil' })).toBeTruthy()
  })
})
