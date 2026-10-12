import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccessibilityButton } from './AccessibilityButton.tsx'

describe('AccessibilityButton', () => {
  it('responde ao clique', () => {
    const onClick = vi.fn()
    render(<AccessibilityButton onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Acessibilidade' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
