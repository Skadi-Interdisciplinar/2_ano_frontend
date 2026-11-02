import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccessibilityModal } from './index.tsx'
import * as AccessibilityContext from '../../contexts/AccessibilityContext.tsx'

describe('AccessibilityModal', () => {
  it('não renderiza nada quando o modal está fechado', () => {
    const { container } = render(<AccessibilityModal />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza título, opções e responde ao fechamento quando aberto', () => {
    const fecharModal = vi.fn()
    const alternarAltoContraste = vi.fn()
    const restaurarPadrao = vi.fn()

    vi.spyOn(AccessibilityContext, 'useAccessibility').mockReturnValue({
      isModalOpen: true,
      fecharModal,
      abrirModal: vi.fn(),
      preferences: AccessibilityContext.PREFERENCIAS_PADRAO,
      alternarAltoContraste,
      alternarTextoGrande: vi.fn(),
      alternarFonteDislexia: vi.fn(),
      alternarSublinharLinks: vi.fn(),
      restaurarPadrao,
    })

    render(<AccessibilityModal />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Acessibilidade' })).toBeTruthy()
    expect(screen.getByText('Alto contraste')).toBeTruthy()
    expect(screen.getByText('Texto grande')).toBeTruthy()
    expect(screen.getByText('Fonte para dislexia')).toBeTruthy()
    expect(screen.getByText('Sublinhar links')).toBeTruthy()

    // Testar fechamento via botão
    const closeBtn = screen.getByRole('button', { name: 'Fechar modal de acessibilidade' })
    fireEvent.click(closeBtn)
    expect(fecharModal).toHaveBeenCalledTimes(1)

    // Testar alternância de alto contraste
    const toggleContraste = screen.getByLabelText('Alto contraste')
    fireEvent.click(toggleContraste)
    expect(alternarAltoContraste).toHaveBeenCalledTimes(1)

    // Testar restaurar padrão
    const resetBtn = screen.getByRole('button', { name: 'Restaurar configurações padrão de acessibilidade' })
    fireEvent.click(resetBtn)
    expect(restaurarPadrao).toHaveBeenCalledTimes(1)

    // Testar fechamento via tecla Escape
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(fecharModal).toHaveBeenCalledTimes(2)
  })
})
