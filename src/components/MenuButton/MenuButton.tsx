import { forwardRef } from 'react'
import menu from '../../assets/admin/menu.svg'
import './MenuButton.css'

export type MenuButtonProps = {
  expanded: boolean
  onClick: () => void
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(
  { expanded, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className="menu-button"
      aria-label={expanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      aria-expanded={expanded}
      aria-controls="menu-lateral"
      aria-haspopup="true"
      onClick={onClick}
    >
      <img src={menu} alt="" width={40} height={23} />
    </button>
  )
})
