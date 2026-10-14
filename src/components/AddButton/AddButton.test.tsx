import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AddButton } from './AddButton.tsx'

describe('AddButton', () => {
  it('responde ao clique', () => {
    const onClick = vi.fn()
    render(<AddButton onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar administrador' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
