import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

export type ConfirmDialogProps = {
  isOpen: boolean
  title?: string
  message?: string
  cancelText?: string
  confirmText?: string
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  title = 'Redefinir senha',
  message = 'Tem certeza de que quer redefinir sua senha?',
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Gerenciamento de foco programático avançado (WCAG 2.1 AA)
  useEffect(() => {
    if (!isOpen) return

    // Salva o elemento de origem para devolver o foco ao fechar
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Move o foco para o botão de confirmação ao abrir
    confirmButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }

      // Trap de foco dentro do diálogo
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
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
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog__content">
          <h2 id="confirm-dialog-title" className="confirm-dialog__title">
            {title}
          </h2>
          <p id="confirm-dialog-desc" className="confirm-dialog__message">
            {message}
          </p>
        </div>

        <div className="confirm-dialog__divider" />

        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__btn confirm-dialog__btn--cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <div className="confirm-dialog__actions-separator" />
          <button
            ref={confirmButtonRef}
            type="button"
            className="confirm-dialog__btn confirm-dialog__btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Confirmando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
