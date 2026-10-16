import { useEffect, useMemo, useState } from 'react'
import type { Administrator } from '../../data/administrators.ts'
import { AccessibilityButton } from '../../components/AccessibilityButton/AccessibilityButton.tsx'
import { AddButton } from '../../components/AddButton/AddButton.tsx'
import { BrandTitle } from '../../components/BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../../components/MenuButton/MenuButton.tsx'
import { Pagination } from '../../components/Pagination/Pagination.tsx'
import { SearchField } from '../../components/SearchField/SearchField.tsx'
import { SideNav } from '../../components/SideNav/SideNav.tsx'
import { StaffTable } from '../../components/StaffTable/StaffTable.tsx'
import './AdministratorsScreen.css'
import { getFuncionarios } from '../../service/employees.ts'

export function AdministratorsScreen() {
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [administrators, setAdministrators] = useState<Administrator[]>([])

  useEffect( () =>{
    async function fetchFuncionarios(){
      try{
        const response = await getFuncionarios()
        setAdministrators(response)
      }
      catch(error){
        console.error('Erro ao buscar funcionários:', error)
      }
    }
    fetchFuncionarios()

  },[])

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
        administrator.cd.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [administrators, query])

  return (
    <main className="administrators-screen">
      <header className="administrators-screen__header">
        <MenuButton expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
        <BrandTitle />
      </header>
      <div className="administrators-screen__body">
        {menuOpen ? <SideNav /> : null}
        <section className="administrators-screen__content">
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
              onClick={() => setMenuOpen(false)}
            />
          ) : null}
        </section>
      </div>
      <AccessibilityButton />
    </main>
  )
}
