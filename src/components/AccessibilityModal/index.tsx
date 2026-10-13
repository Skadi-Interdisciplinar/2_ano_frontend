import { useEffect, useRef } from 'react'
import {
  Contrast as ContrastIcon,
  FormatSize as FormatSizeIcon,
  Spellcheck as SpellcheckIcon,
  Visibility as VisibilityIcon,
  RestartAlt as RestartAltIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useAccessibility } from '../../contexts/AccessibilityContext.tsx'
import './styles.css'

export interface IAccessibilityModalProps {
  onClose?: () => void
}

export function AccessibilityModal({ onClose }: IAccessibilityModalProps) {
  const {
    isModalOpen,
    fecharModal,
    preferences,
    alternarAltoContraste,
    alternarTextoGrande,
    alternarFonteDislexia,
    alternarSublinharLinks,
    restaurarPadrao,
  } = useAccessibility()

  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      fecharModal()
    }
  }

  // Gerenciamento de foco programático (WCAG 2.1 AA)
  useEffect(() => {
    if (!isModalOpen) return

    // Salva o elemento que tinha o foco antes de abrir o modal
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Move o foco para o primeiro botão (fechar) ao abrir
    const closeButton = modalRef.current?.querySelector<HTMLButtonElement>('button')
    if (closeButton) {
      closeButton.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }

      // Trap de foco dentro do modal
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Devolve o foco ao elemento de origem ao fechar
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isModalOpen])

  if (!isModalOpen) return null

  return (
    <div
      className="a11y-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="a11y-modal-card"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-modal-title"
      >
        <header className="a11y-modal-header">
          <h2 id="a11y-modal-title" className="a11y-modal-title">
            Acessibilidade
          </h2>
          <button
            type="button"
            className="a11y-modal-close-btn"
            onClick={handleClose}
            aria-label="Fechar modal de acessibilidade"
          >
            <CloseIcon fontSize="small" />
          </button>
        </header>

        <main className="a11y-modal-body">
          {/* 1. Alto Contraste */}
          <div className="a11y-modal-item">
            <div className="a11y-item-info">
              <div className="a11y-item-icon-wrapper" aria-hidden="true">
                <ContrastIcon />
              </div>
              <div className="a11y-item-text">
                <label htmlFor="toggle-alto-contraste" className="a11y-item-title">
                  Alto contraste
                </label>
                <span className="a11y-item-desc">Cores fortes para melhor leitura</span>
              </div>
            </div>
            <label className="a11y-switch" htmlFor="toggle-alto-contraste">
              <input
                id="toggle-alto-contraste"
                type="checkbox"
                role="switch"
                aria-checked={preferences.altoContraste}
                checked={preferences.altoContraste}
                onChange={alternarAltoContraste}
              />
              <span className="a11y-slider" />
            </label>
          </div>

          {/* 2. Texto Grande */}
          <div className="a11y-modal-item">
            <div className="a11y-item-info">
              <div className="a11y-item-icon-wrapper" aria-hidden="true">
                <FormatSizeIcon />
              </div>
              <div className="a11y-item-text">
                <label htmlFor="toggle-texto-grande" className="a11y-item-title">
                  Texto grande
                </label>
                <span className="a11y-item-desc">Aumenta o tamanho da fonte</span>
              </div>
            </div>
            <label className="a11y-switch" htmlFor="toggle-texto-grande">
              <input
                id="toggle-texto-grande"
                type="checkbox"
                role="switch"
                aria-checked={preferences.textoGrande}
                checked={preferences.textoGrande}
                onChange={alternarTextoGrande}
              />
              <span className="a11y-slider" />
            </label>
          </div>

          {/* 3. Fonte para Dislexia */}
          <div className="a11y-modal-item">
            <div className="a11y-item-info">
              <div className="a11y-item-icon-wrapper" aria-hidden="true">
                <SpellcheckIcon />
              </div>
              <div className="a11y-item-text">
                <label htmlFor="toggle-fonte-dislexia" className="a11y-item-title">
                  Fonte para dislexia
                </label>
                <span className="a11y-item-desc">Mais fácil de ler</span>
              </div>
            </div>
            <label className="a11y-switch" htmlFor="toggle-fonte-dislexia">
              <input
                id="toggle-fonte-dislexia"
                type="checkbox"
                role="switch"
                aria-checked={preferences.fonteDislexia}
                checked={preferences.fonteDislexia}
                onChange={alternarFonteDislexia}
              />
              <span className="a11y-slider" />
            </label>
          </div>

          {/* 4. Sublinhar Links */}
          <div className="a11y-modal-item">
            <div className="a11y-item-info">
              <div className="a11y-item-icon-wrapper" aria-hidden="true">
                <VisibilityIcon />
              </div>
              <div className="a11y-item-text">
                <label htmlFor="toggle-sublinhar-links" className="a11y-item-title">
                  Sublinhar links
                </label>
                <span className="a11y-item-desc">Destaca todos os links</span>
              </div>
            </div>
            <label className="a11y-switch" htmlFor="toggle-sublinhar-links">
              <input
                id="toggle-sublinhar-links"
                type="checkbox"
                role="switch"
                aria-checked={preferences.sublinharLinks}
                checked={preferences.sublinharLinks}
                onChange={alternarSublinharLinks}
              />
              <span className="a11y-slider" />
            </label>
          </div>
        </main>

        <footer className="a11y-modal-footer">
          <button
            type="button"
            className="a11y-reset-btn"
            onClick={restaurarPadrao}
            aria-label="Restaurar configurações padrão de acessibilidade"
          >
            <RestartAltIcon />
            Restaurar padrão
          </button>
        </footer>
      </div>
    </div>
  )
}
