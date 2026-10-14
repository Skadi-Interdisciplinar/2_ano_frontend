import { AccessibleForward as AccessibleIcon } from '@mui/icons-material'
import { useAccessibility } from '../../contexts/AccessibilityContext.tsx'
import './styles.css'

export function AccessibilityButton() {
  const { abrirModal, isModalOpen } = useAccessibility()

  return (
    <button
      type="button"
      className="a11y-floating-trigger"
      onClick={abrirModal}
      aria-label="Opções de acessibilidade"
      aria-haspopup="dialog"
      aria-expanded={isModalOpen}
    >
      <AccessibleIcon fontSize="medium" />
    </button>
  )
}
