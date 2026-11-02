import { useEffect } from 'react'
import './AdministratorDeleteDialog.css'

type AdministratorDeleteDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function AdministratorDeleteDialog({
  onCancel,
  onConfirm,
  isLoading = false,
}: AdministratorDeleteDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="administrator-delete-dialog__overlay">
      <div
        className="administrator-delete-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="administrator-delete-title"
      >
        <header className="administrator-delete-dialog__header">
          <button type="button" className="administrator-delete-dialog__close" aria-label="Fechar" onClick={onCancel}>
            ×
          </button>
        </header>
        <div className="administrator-delete-dialog__body">
          <p id="administrator-delete-title">Confirma a exclusão desse Administrador?</p>
          <div className="administrator-delete-dialog__actions">
            <button type="button" className="administrator-delete-dialog__cancel" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </button>
            <button type="button" className="administrator-delete-dialog__confirm" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
