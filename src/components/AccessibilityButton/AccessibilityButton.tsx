import icon from '../../assets/admin/accessibility.svg'
import { useAccessibility } from '../../contexts/AccessibilityContext.tsx'
import './AccessibilityButton.css'

export type AccessibilityButtonProps = {
  onClick?: () => void
}

export function AccessibilityButton({ onClick }: AccessibilityButtonProps) {
  const { abrirModal, isModalOpen } = useAccessibility()
  const handleClick = onClick ?? abrirModal

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Acessibilidade"
      aria-haspopup="dialog"
      aria-expanded={isModalOpen}
      onClick={handleClick}
    >
      <img src={icon} alt="" width={44} height={47} />
    </button>
  )
}
