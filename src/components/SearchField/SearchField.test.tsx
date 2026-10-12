import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SearchField } from './SearchField.tsx'

describe('SearchField', () => {
  it('informa o texto digitado', () => {
    const onChange = vi.fn()
    render(<SearchField value="" onChange={onChange} />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar administrador' }), {
      target: { value: 'Gustavo' },
    })

    expect(onChange).toHaveBeenCalledWith('Gustavo')
  })
})
