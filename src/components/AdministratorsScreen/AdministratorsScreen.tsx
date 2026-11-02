import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Administrator } from '../../data/administrators.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { AccessibilityButton } from '../AccessibilityButton/AccessibilityButton.tsx'
import { AddButton } from '../AddButton/AddButton.tsx'
import { BrandTitle } from '../BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../MenuButton/MenuButton.tsx'
import { Pagination } from '../Pagination/Pagination.tsx'
import { SearchField } from '../SearchField/SearchField.tsx'
import { SideNav } from '../SideNav/SideNav.tsx'
import { StaffTable } from '../StaffTable/StaffTable.tsx'
import './AdministratorsScreen.css'
import { getFuncionarios } from '../../service/employees.ts'

export function AdministratorsScreen() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [administrators, setAdministrators] = useState<Administrator[]>([])

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const response = await getFuncionarios()
        setAdministrators(response)
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error)
      }
    }
    void fetchFuncionarios()
  }, [])

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const handleNavigate = (section: 'administradores' | 'perfil' | 'dashboards' | 'chamados') => {
    if (section === 'dashboards') {
      navigate('/dashboards')
    } else if (section === 'perfil') {
      navigate('/perfil')
    } else if (section === 'chamados') {
      navigate('/chamados')
    } else if (section === 'administradores') {
      handleCloseMenu()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleCards = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return administrators

    return administrators.filter((administrator) =>
      [
        administrator.id,
        administrator.nome,
        administrator.username,
        administrator.email,
        administrator.acesso,
        administrator.cd,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [administrators, query])

  return (
    <div className="administrators-screen">
      {/* WCAG 2.1 AA: Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Landmark: Banner / Header */}
      <header className="administrators-screen__header">
        <MenuButton
          ref={menuButtonRef}
          expanded={menuOpen}
          onClick={handleToggleMenu}
        />
        <BrandTitle />
      </header>

      <div className="administrators-screen__body">
        {/* Landmark: Menu lateral */}
        {menuOpen ? (
          <SideNav
            currentSection="administradores"
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onClose={handleCloseMenu}
          />
        ) : null}

        {/* Landmark: Conteúdo principal */}
        <main className="administrators-screen__content" id="main-content" tabIndex={-1}>
          <div className="administrators-screen__toolbar">
            <SearchField value={query} onChange={setQuery} />
            <AddButton />
          </div>
          <StaffTable
            administrators={visibleCards}
            onDelete={(id) =>
              setAdministrators((current) => current.filter((administrator) => administrator.id !== id))
            }
          />
          <Pagination label={`0 - ${visibleCards.length} of ${administrators.length}`} />
          {menuOpen ? (
            <button
              type="button"
              className="administrators-screen__overlay"
              aria-label="Fechar menu"
              onClick={handleCloseMenu}
            />
          ) : null}
        </main>
      </div>

      {/* Landmark: Rodapé / Footer */}
      <footer className="administrators-screen__footer">
        <p>© 2026 Skadi · Gestão de Administradores · Todos os direitos reservados.</p>
      </footer>

      <AccessibilityButton />
    </div>
  )
}
