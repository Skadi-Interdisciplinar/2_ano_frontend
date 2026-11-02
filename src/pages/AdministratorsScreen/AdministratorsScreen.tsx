import { useEffect, useMemo, useState } from 'react'
import type { Administrator, AdministratorInput, AdministratorUpdate } from '../../data/administrators.ts'
import type { Cd } from '../../data/distributionCenter.ts'
import { AccessibilityButton } from '../../components/AccessibilityButton/AccessibilityButton.tsx'
import { AddButton } from '../../components/AddButton/AddButton.tsx'
import { AdministratorDeleteDialog } from '../../components/AdministratorDeleteDialog/AdministratorDeleteDialog.tsx'
import { AdministratorFormModal } from '../../components/AdministratorFormModal/AdministratorFormModal.tsx'
import { BrandTitle } from '../../components/BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../../components/MenuButton/MenuButton.tsx'
import { Pagination } from '../../components/Pagination/Pagination.tsx'
import { SearchField } from '../../components/SearchField/SearchField.tsx'
import { SideNav } from '../../components/SideNav/SideNav.tsx'
import { StaffTable } from '../../components/StaffTable/StaffTable.tsx'
import {
  createAdministrador,
  deleteAdministrador,
  getCds,
  getFuncionarios,
  mensagemDaApi,
  updateAdministrador,
} from '../../service/employees.ts'
import './AdministratorsScreen.css'

export function AdministratorsScreen() {
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [catalog, setCatalog] = useState<Cd[]>([])
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Administrator | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Administrator | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  async function loadAdministrators() {
    const response = await getFuncionarios()
    setAdministrators(Array.isArray(response) ? response : [])
  }

  useEffect(() => {
    async function load() {
      try {
        await loadAdministrators()
      } catch (error) {
        setAdministrators([])
        setPageError(mensagemDaApi(error, 'Não foi possível carregar os administradores.'))
      }

      try {
        const cds = await getCds()
        setCatalog(Array.isArray(cds) ? cds : [])
      } catch (error) {
        setCatalog([])
        setPageError((current) => current ?? mensagemDaApi(error, 'Não foi possível carregar os centros de distribuição.'))
      }
    }
    void load()
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
        administrator.gestorNome ?? '',
        ...(administrator.cd ?? []).map((cd) => cd.name),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [administrators, query])

  async function handleSubmit(payload: AdministratorInput | AdministratorUpdate) {
    setIsSaving(true)
    setFormError(null)
    try {
      if (modalMode === 'edit' && 'id' in payload) {
        await updateAdministrador(payload)
      } else {
        await createAdministrador(payload as AdministratorInput)
      }
      await loadAdministrators()
      setModalMode(null)
      setEditing(null)
      setPageError(null)
    } catch (error) {
      setFormError(mensagemDaApi(error, 'Não foi possível salvar o administrador.'))
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return

    setIsSaving(true)
    setPageError(null)
    try {
      await deleteAdministrador(pendingDelete.id)
      await loadAdministrators()
      setPendingDelete(null)
    } catch (error) {
      setPageError(mensagemDaApi(error, 'Não foi possível excluir o administrador.'))
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
                setFormError(null)
                setModalMode('create')
              }}
            />
          </div>
          {pageError ? (
            <p className="administrators-screen__error" role="alert">
              {pageError}
            </p>
          ) : null}
          <StaffTable
            administrators={visibleCards}
            onDelete={(id) => {
              const administrator = administrators.find((item) => item.id === id)
              if (administrator) setPendingDelete(administrator)
            }}
            onEdit={(administrator) => {
              setEditing(administrator)
              setFormError(null)
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
          availableCds={catalog}
          isLoading={isSaving}
          serverError={formError}
          onClose={() => {
            setModalMode(null)
            setEditing(null)
            setFormError(null)
          }}
          onSubmit={(payload) => {
            void handleSubmit(payload)
          }}
        />
      ) : null}
      {pendingDelete ? (
        <AdministratorDeleteDialog
          isLoading={isSaving}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            void confirmDelete()
          }}
        />
      ) : null}
    </main>
  )
}
