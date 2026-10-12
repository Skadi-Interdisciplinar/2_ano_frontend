import icon from '../../assets/admin/accessibility.svg'
import './AccessibilityButton.css'

type AccessibilityButtonProps = {
  onClick?: () => void
}

export function AccessibilityButton({ onClick }: AccessibilityButtonProps) {
  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Acessibilidade"
      onClick={onClick}
    >
      <img src={icon} alt="" width={44} height={47} />
    </button>
  )
}
