import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'
import App from './App.tsx'

describe('App component', () => {
  it('renderiza o App sem estourar exceção', async () => {
    window.history.pushState({}, 'Perfil', '/perfil')
    render(<App />)
    await screen.findByRole('heading', { name: 'SKADI|Perfil' })
  })
})
