import { useEffect, useMemo, useState } from 'react'
import {
  administradoresDeTeste,
  type Administrator,
  type AdministratorInput,
} from '../../data/administrators.ts'
import type { Cd } from '../../data/distributionCenter.ts'
import { AccessibilityButton } from '../../components/AccessibilityButton/AccessibilityButton.tsx'
import { AddButton } from '../../components/AddButton/AddButton.tsx'
import { AdministratorFormModal } from '../../components/AdministratorFormModal/AdministratorFormModal.tsx'
import { BrandTitle } from '../../components/BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../../components/MenuButton/MenuButton.tsx'
import { Pagination } from '../../components/Pagination/Pagination.tsx'
import { SearchField } from '../../components/SearchField/SearchField.tsx'
import { SideNav } from '../../components/SideNav/SideNav.tsx'
import { StaffTable } from '../../components/StaffTable/StaffTable.tsx'
import {
  createAdministrador,
  getFuncionarios,
  updateAdministrador,
} from '../../service/employees.ts'
import './AdministratorsScreen.css'

function collectCds(administrators: Administrator[]): Cd[] {
  const cds = new Map<number, Cd>()
  for (const administrator of administrators) {
    for (const cd of administrator.cd ?? []) {
      cds.set(cd.id, cd)
    }
  }
  return [...cds.values()]
}

export function AdministratorsScreen() {
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [administrators, setAdministrators] = useState<Administrator[]>(administradoresDeTeste)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Administrator | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function loadAdministrators() {
    const response = await getFuncionarios()
    if (Array.isArray(response) && response.length > 0) {
      setAdministrators(response)
    }
  }

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        await loadAdministrators()
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error)
      }
    }
    fetchFuncionarios()
  }, [])

  const visibleCards = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return administrators

    return administrators.filter((administrator) =>
      [
        String(administrator.id),
        administrator.nome,
        administrator.username,
        administrator.cpf,
        administrator.email,
        administrator.nivelAcesso,
        ...(administrator.cd ?? []).map((cd) => cd.name),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [administrators, query])

  const availableCds = useMemo(() => collectCds(administrators), [administrators])

  async function handleSubmit(payload: AdministratorInput) {
    setIsSaving(true)
    try {
      if (modalMode === 'edit' && editing) {
        await updateAdministrador(editing.id, payload)
      } else {
        await createAdministrador(payload)
      }
      await loadAdministrators()
      setModalMode(null)
      setEditing(null)
    } catch (error) {
      console.error('Erro ao salvar administrador:', error)
    } finally {
      setIsSaving(false)
    }
  }

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
            <AddButton
              onClick={() => {
                setEditing(null)
                setModalMode('create')
              }}
            />
          </div>
          <StaffTable
            administrators={visibleCards}
            onDelete={(id) =>
              setAdministrators((current) => current.filter((administrator) => administrator.id !== id))
            }
            onEdit={(administrator) => {
              setEditing(administrator)
              setModalMode('edit')
            }}
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
      {modalMode ? (
        <AdministratorFormModal
          key={editing ? String(editing.id) : 'create'}
          mode={modalMode}
          administrator={editing}
          availableCds={availableCds}
          isLoading={isSaving}
          onClose={() => {
            setModalMode(null)
            setEditing(null)
          }}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  )
}
