import { useEffect } from 'react'
import './SupportDeleteDialog.css'

type SupportDeleteDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function SupportDeleteDialog({ onCancel, onConfirm, isLoading = false }: SupportDeleteDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="support-delete-dialog__overlay">
      <div className="support-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="support-delete-title">
        <header className="support-delete-dialog__header">
          <button type="button" className="support-delete-dialog__close" aria-label="Fechar" onClick={onCancel}>
            ×
          </button>
        </header>
        <div className="support-delete-dialog__body">
          <p id="support-delete-title">Confirma a exclusão desse chamado?</p>
          <div className="support-delete-dialog__actions">
            <button type="button" className="support-delete-dialog__cancel" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </button>
            <button type="button" className="support-delete-dialog__confirm" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
