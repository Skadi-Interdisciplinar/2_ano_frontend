import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessibilityButton } from '../../components/AccessibilityButton/AccessibilityButton.tsx'
import { AddButton } from '../../components/AddButton/AddButton.tsx'
import { BrandTitle } from '../../components/BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../../components/MenuButton/MenuButton.tsx'
import { Pagination } from '../../components/Pagination/Pagination.tsx'
import { SearchField } from '../../components/SearchField/SearchField.tsx'
import { SideNav } from '../../components/SideNav/SideNav.tsx'
import { SupportDeleteDialog } from '../../components/SupportDeleteDialog/SupportDeleteDialog.tsx'
import { SupportFormModal } from '../../components/SupportFormModal/SupportFormModal.tsx'
import { SupportTable } from '../../components/SupportTable/SupportTable.tsx'
import { useAuth } from '../../contexts/AuthContext.tsx'
import {
  ehSuperAdmin,
  rotuloCategoria,
  rotuloStatus,
  type Chamado,
  type ChamadoAbertura,
  type ChamadoEdicao,
  type StatusChamado,
} from '../../data/support.ts'
import { mensagemDaApi } from '../../service/employees.ts'
import {
  abrirChamado,
  alterarStatusChamado,
  buscarChamado,
  editarChamado,
  excluirChamado,
  listarChamados,
} from '../../service/support.ts'
import './SupportScreen.css'

export function SupportScreen() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const superAdmin = ehSuperAdmin(user?.cargo)
  const [menuOpen, setMenuOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [criado, setCriado] = useState<Chamado | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Chamado | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Chamado | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  async function loadChamados() {
    const response = await listarChamados()
    setChamados(response)
  }

  useEffect(() => {
    if (!superAdmin) return
    async function load() {
      try {
        await loadChamados()
      } catch (error) {
        setChamados([])
        setPageError(mensagemDaApi(error, 'Não foi possível carregar os chamados.'))
      }
    }
    void load()
  }, [superAdmin])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return chamados
    return chamados.filter((chamado) =>
      [rotuloCategoria(chamado.categoria), chamado.descricao, rotuloStatus(chamado.status), chamado.resposta ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [chamados, query])

  function replaceChamado(updated: Chamado) {
    setChamados((current) => current.map((chamado) => (chamado.id === updated.id ? updated : chamado)))
    setEditing((current) => (current?.id === updated.id ? updated : current))
  }

  async function handleSubmit(payload: ChamadoAbertura | ChamadoEdicao) {
    setIsSaving(true)
    setFormError(null)
    try {
      if (modalMode === 'edit' && editing) {
        replaceChamado(await editarChamado(editing.id, payload as ChamadoEdicao))
      } else {
        const created = await abrirChamado(payload as ChamadoAbertura)
        if (superAdmin) {
          await loadChamados()
        } else {
          setCriado(created)
        }
      }
      setModalMode(null)
      setEditing(null)
      setPageError(null)
    } catch (error) {
      setFormError(mensagemDaApi(error, 'Não foi possível salvar o chamado.'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatus(chamado: Chamado, status: StatusChamado) {
    if (chamado.status === status) return
    setPageError(null)
    setFormError(null)
    try {
      const updated = await alterarStatusChamado(chamado.id, status)
      replaceChamado(updated)
    } catch (error) {
      const message = mensagemDaApi(error, 'Não foi possível alterar o status.')
      if (editing?.id === chamado.id) setFormError(message)
      else setPageError(message)
    }
  }

  async function openEdit(chamado: Chamado) {
    setPageError(null)
    setFormError(null)
    try {
      const fresh = await buscarChamado(chamado.id)
      setEditing(fresh)
      setModalMode('edit')
    } catch (error) {
      setPageError(mensagemDaApi(error, 'Não foi possível carregar o chamado.'))
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setIsSaving(true)
    setPageError(null)
    try {
      await excluirChamado(pendingDelete.id)
      await loadChamados()
      setPendingDelete(null)
    } catch (error) {
      setPageError(mensagemDaApi(error, 'Não foi possível excluir o chamado.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="support-screen">
      <header className="support-screen__header">
        <MenuButton expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
        <BrandTitle section="Chamados" />
      </header>
      <div className="support-screen__body">
        {menuOpen ? (
          <SideNav
            currentSection="chamados"
            onLogout={() => {
              logout()
              navigate('/login')
            }}
            onNavigate={(section) => {
              if (section === 'administradores') navigate('/administradores')
              if (section === 'perfil') navigate('/perfil')
              if (section === 'dashboards') navigate('/home')
            }}
          />
        ) : null}
        <section className="support-screen__content">
          <div className="support-screen__toolbar">
            {superAdmin ? <SearchField value={query} onChange={setQuery} label="Buscar chamado" /> : <span />}
            <AddButton
              label="Adicionar chamado"
              onClick={() => {
                setEditing(null)
                setFormError(null)
                setModalMode('create')
              }}
            />
          </div>
          {pageError ? (
            <p className="support-screen__error" role="alert">
              {pageError}
            </p>
          ) : null}
          {superAdmin ? (
            <>
              <SupportTable
                chamados={visible}
                onDelete={setPendingDelete}
                onEdit={(chamado) => {
                  void openEdit(chamado)
                }}
                onStatusChange={(chamado, status) => {
                  void handleStatus(chamado, status)
                }}
              />
              <Pagination label={`0 - ${visible.length} of ${chamados.length}`} />
            </>
          ) : criado ? (
            <article className="support-screen__created" aria-label="Chamado aberto">
              <h2>Chamado aberto</h2>
              <p>Categoria: {rotuloCategoria(criado.categoria)}</p>
              <p>Descrição: {criado.descricao}</p>
              <p>Status: {rotuloStatus(criado.status)}</p>
              <p>Abertura: {criado.dataHoraAbertura}</p>
              <p>Resposta: {criado.resposta ?? '--'}</p>
            </article>
          ) : null}
          {menuOpen ? (
            <button
              type="button"
              className="support-screen__overlay"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            />
          ) : null}
        </section>
      </div>
      <AccessibilityButton />
      {modalMode ? (
        <SupportFormModal
          key={editing ? String(editing.id) : 'create'}
          mode={modalMode}
          chamado={editing}
          isLoading={isSaving}
          serverError={formError}
          onClose={() => {
            setModalMode(null)
            setEditing(null)
            setFormError(null)
          }}
          onStatusChange={(status) => {
            if (editing) void handleStatus(editing, status)
          }}
          onSubmit={(payload) => {
            void handleSubmit(payload)
          }}
        />
      ) : null}
      {pendingDelete ? (
        <SupportDeleteDialog
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
