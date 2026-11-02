import { useEffect, useRef } from 'react'
import profile from '../../assets/admin/profile.svg'
import './SideNav.css'

export type SideNavProps = {
  currentSection?: 'administradores' | 'perfil' | 'dashboards' | 'chamados'
  onNavigate?: (section: 'administradores' | 'perfil' | 'dashboards' | 'chamados') => void
  onLogout?: () => void
  onClose?: () => void
}

export function SideNav({
  currentSection = 'administradores',
  onNavigate,
  onLogout,
  onClose,
}: SideNavProps) {
  const navRef = useRef<HTMLElement | null>(null)

  // Gerenciamento de teclado: Fechar no Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <nav
      ref={navRef}
      className="side-nav"
      id="menu-lateral"
      aria-label="Menu lateral principal"
    >
      <button
        type="button"
        className={`side-nav__link ${currentSection === 'dashboards' ? 'side-nav__link--current' : ''}`}
        aria-current={currentSection === 'dashboards' ? 'page' : undefined}
        onClick={() => onNavigate?.('dashboards')}
      >
        DASHBOARDS
      </button>
      <button
        type="button"
        className={`side-nav__link ${currentSection === 'administradores' ? 'side-nav__link--current' : ''}`}
        aria-current={currentSection === 'administradores' ? 'page' : undefined}
        onClick={() => onNavigate?.('administradores')}
      >
        ADMINISTRADORES
      </button>
      <button
        type="button"
        className={`side-nav__link ${currentSection === 'chamados' ? 'side-nav__link--current' : ''}`}
        aria-current={currentSection === 'chamados' ? 'page' : undefined}
        onClick={() => onNavigate?.('chamados')}
      >
        CHAMADOS
      </button>
      <button type="button" className="side-nav__logout" onClick={onLogout}>
        Sair
      </button>
      <button
        type="button"
        className={`side-nav__profile-btn ${currentSection === 'perfil' ? 'side-nav__profile-btn--current' : ''}`}
        onClick={() => onNavigate?.('perfil')}
        aria-label="Meu Perfil"
      >
        <img className="side-nav__profile" src={profile} alt="" width={69} height={69} />
      </button>
    </nav>
  )
}
