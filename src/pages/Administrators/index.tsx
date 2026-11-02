import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Administrator } from '../../types/employee.types.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { AccessibilityButton } from '../../components/AccessibilityButton/index.tsx'
import { AddButton } from '../../components/AddButton/index.tsx'
import { BrandTitle } from '../../components/BrandTitle/index.tsx'
import { MenuButton } from '../../components/MenuButton/index.tsx'
import { Pagination } from '../../components/Pagination/index.tsx'
import { SearchField } from '../../components/SearchField/index.tsx'
import { SideNav } from '../../components/SideNav/index.tsx'
import { StaffTable } from '../../components/StaffTable/index.tsx'
import { LoadingSpinner } from '../../components/LoadingSpinner/index.tsx'
import { ErrorMessage } from '../../components/ErrorMessage/index.tsx'
import { getFuncionarios } from '../../services/employee.service.ts'
import '../../components/AdministratorsScreen/AdministratorsScreen.css'

export default function AdministratorsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchFuncionarios() {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const response = await getFuncionarios()
        if (isMounted) {
          setAdministrators(response)
        }
      } catch (error: unknown) {
        if (isMounted) {
          const msg = error instanceof Error ? error.message : 'Erro ao buscar funcionários.'
          setErrorMessage(msg)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchFuncionarios()

    return () => {
      isMounted = false
    }
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

          {isLoading ? (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: '24rem' }}>
              <LoadingSpinner label="Carregando lista de administradores..." />
            </div>
          ) : errorMessage ? (
            <div style={{ padding: '2rem' }}>
              <ErrorMessage message={errorMessage} />
            </div>
          ) : (
            <>
              <StaffTable
                administrators={visibleCards}
                onDelete={(id) =>
                  setAdministrators((current) => current.filter((administrator) => administrator.id !== id))
                }
              />
              <Pagination label={`0 - ${visibleCards.length} of ${administrators.length}`} />
            </>
          )}

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

export { AdministratorsPage as AdministratorsScreen }
