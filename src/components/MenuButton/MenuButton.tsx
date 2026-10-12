import menu from '../../assets/admin/menu.svg'
import './MenuButton.css'

type MenuButtonProps = {
  expanded: boolean
  onClick: () => void
}

export function MenuButton({ expanded, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      className="menu-button"
      aria-label="Menu"
      aria-expanded={expanded}
      aria-controls="menu-lateral"
      onClick={onClick}
    >
      <img src={menu} alt="" width={40} height={23} />
    </button>
  )
}
