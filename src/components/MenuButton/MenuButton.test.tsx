import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MenuButton } from './MenuButton.tsx'

describe('MenuButton', () => {
  it('informa se o menu está aberto e responde ao clique', () => {
    const onClick = vi.fn()
    render(<MenuButton expanded onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveProperty('ariaExpanded', 'true')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
