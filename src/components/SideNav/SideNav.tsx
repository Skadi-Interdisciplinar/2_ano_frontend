import profile from '../../assets/admin/profile.svg'
import './SideNav.css'

type SideNavProps = {
  onLogout?: () => void
}

export function SideNav({ onLogout }: SideNavProps) {
  return (
    <nav className="side-nav" id="menu-lateral" aria-label="Menu lateral">
      <button type="button" className="side-nav__link">
        DASHBOARDS
      </button>
      <button type="button" className="side-nav__link side-nav__link--current" aria-current="page">
        ADMINISTRADORES
      </button>
      <button type="button" className="side-nav__link">
        CHAMADOS
      </button>
      <button type="button" className="side-nav__logout" onClick={onLogout}>
        Sair
      </button>
      <img className="side-nav__profile" src={profile} alt="" width={69} height={69} />
    </nav>
  )
}
