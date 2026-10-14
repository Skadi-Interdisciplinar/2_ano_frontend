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
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    confirmButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay" role="presentation" onClick={onCancel}>
      <div
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
