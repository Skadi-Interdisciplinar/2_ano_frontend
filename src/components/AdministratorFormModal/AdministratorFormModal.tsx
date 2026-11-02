import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { rotuloAcesso, rotuloGestor, type Administrator, type AdministratorInput, type AdministratorUpdate } from '../../data/administrators.ts'
import type { Cd } from '../../data/distributionCenter.ts'
import './AdministratorFormModal.css'

function cpfDigits(value: string) {
  return value.replace(/\D/g, '')
}

export type AdministratorFormModalProps = {
  mode: 'create' | 'edit'
  administrator?: Administrator | null
  availableCds: Cd[]
  onClose: () => void
  onSubmit: (payload: AdministratorInput | AdministratorUpdate) => void
  isLoading?: boolean
  serverError?: string | null
}

export function AdministratorFormModal({
  mode,
  administrator,
  availableCds,
  onClose,
  onSubmit,
  isLoading = false,
  serverError = null,
}: AdministratorFormModalProps) {
  const titleId = useId()
  const cdsLabelId = useId()
  const cdsListId = useId()
  const cdsRef = useRef<HTMLDivElement>(null)
  const [nome, setNome] = useState(administrator?.nome ?? '')
  const [username, setUsername] = useState(administrator?.username ?? '')
  const [cpf, setCpf] = useState(administrator?.cpf ?? '')
  const [email, setEmail] = useState(administrator?.email ?? '')
  const [senha, setSenha] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (administrator?.cd ?? []).map((cd) => String(cd.id)),
  )
  const [cdsOpen, setCdsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedCds = availableCds.filter((cd) => selectedIds.includes(String(cd.id)))
  const cdsSummary = selectedCds.length > 0 ? selectedCds[0].name : 'Selecione os centros'

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (cdsOpen) {
        setCdsOpen(false)
        return
      }
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cdsOpen, onClose])

  useEffect(() => {
    if (!cdsOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!cdsRef.current?.contains(event.target as Node)) {
        setCdsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [cdsOpen])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const cpfNumeros = cpfDigits(cpf)
    const payload = {
      nome: nome.trim(),
      username: username.trim(),
      cpf: cpfNumeros,
      email: email.trim(),
    }

    if (!payload.nome || !payload.username || !payload.cpf || !payload.email) {
      setErrorMessage('Preencha todos os campos para continuar.')
      return
    }

    if (payload.cpf.length !== 11) {
      setErrorMessage('O CPF deve ter 11 caracteres.')
      return
    }

    const cd = availableCds.filter((item) => selectedIds.includes(String(item.id)))

    if (mode === 'edit') {
      if (administrator == null) return
      setErrorMessage(null)
      const update: AdministratorUpdate = {
        id: administrator.id,
        ...payload,
        nivelAcesso: 'ADMIN',
        cdGestor: null,
        cd: cd.length > 0 ? cd : (administrator.cd ?? []),
        codGestor: null,
      }
      onSubmit(update)
      return
    }

    const senhaInformada = senha.trim()
    if (!senhaInformada) {
      setErrorMessage('Preencha todos os campos para continuar.')
      return
    }

    setErrorMessage(null)
    const create: AdministratorInput = {
      ...payload,
      senha: senhaInformada,
      nivelAcesso: 'ADMIN',
      cdGestor: null,
      cd,
      codGestor: null,
    }
    onSubmit(create)
  }

  return (
    <div className="administrator-form-modal__overlay">
      <div
        className="administrator-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="administrator-form-modal__header">
          <button type="button" className="administrator-form-modal__close" aria-label="Fechar" onClick={onClose}>
            ×
          </button>
          <h2 id={titleId} className="administrator-form-modal__title">
            {mode === 'create' ? 'Adicionar administrador' : 'Atualizar administrador'}
          </h2>
        </header>
        <form className="administrator-form-modal__form" onSubmit={handleSubmit}>
          <div className="administrator-form-modal__panel">
            <div className="administrator-form-modal__grid">
              <label>
                Nome
                <input value={nome} onChange={(event) => setNome(event.target.value)} />
              </label>
              <label>
                Username
                <input value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                E-mail
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  value={mode === 'edit' ? '*******' : senha}
                  onChange={(event) => setSenha(event.target.value)}
                  disabled={mode === 'edit'}
                  readOnly={mode === 'edit'}
                />
              </label>
              <label>
                Acesso
                <input value={rotuloAcesso('ADMIN')} disabled readOnly />
              </label>
              <div className="administrator-form-modal__cds" ref={cdsRef}>
                <span id={cdsLabelId} className="administrator-form-modal__cd-label">
                  CD
                </span>
                <button
                  type="button"
                  className="administrator-form-modal__cd-trigger"
                  aria-label="Centros de distribuição"
                  aria-expanded={cdsOpen}
                  aria-controls={cdsListId}
                  disabled={availableCds.length === 0}
                  onClick={() => setCdsOpen((open) => !open)}
                >
                  <span className={selectedCds.length === 0 ? 'administrator-form-modal__cd-placeholder' : undefined}>
                    {availableCds.length === 0 ? 'Nenhum centro disponível' : cdsSummary}
                  </span>
                  <span className="administrator-form-modal__cd-chevron" aria-hidden="true" />
                </button>
                {cdsOpen ? (
                  <ul id={cdsListId} className="administrator-form-modal__cd-menu">
                    {availableCds.map((cd) => {
                      const id = String(cd.id)
                      const checked = selectedIds.includes(id)
                      return (
                        <li key={cd.id}>
                          <label className="administrator-form-modal__cd-option">
                            <input
                              type="checkbox"
                              name="cd"
                              value={id}
                              checked={checked}
                              onChange={() =>
                                setSelectedIds((current) =>
                                  checked ? current.filter((item) => item !== id) : [...current, id],
                                )
                              }
                            />
                            <span>{cd.name}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>
              <label className="administrator-form-modal__full">
                Gestor
                <input value={rotuloGestor(administrator)} disabled readOnly />
              </label>
              <label className="administrator-form-modal__full">
                CPF
                <input value={cpf} onChange={(event) => setCpf(event.target.value)} inputMode="numeric" />
              </label>
            </div>
            {errorMessage || serverError ? (
              <p className="administrator-form-modal__error" role="alert">
                {errorMessage || serverError}
              </p>
            ) : null}
            <div className="administrator-form-modal__actions">
              <button type="button" className="administrator-form-modal__cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="administrator-form-modal__confirm" disabled={isLoading}>
                {isLoading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
