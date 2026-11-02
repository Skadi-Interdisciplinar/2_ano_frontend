import { useEffect, useId, useState, type FormEvent } from 'react'
import {
  CATEGORIAS,
  STATUS_CHAMADO,
  rotuloCategoria,
  rotuloStatus,
  type CategoriaChamado,
  type Chamado,
  type ChamadoAbertura,
  type ChamadoEdicao,
  type StatusChamado,
} from '../../data/support.ts'
import './SupportFormModal.css'

type SupportFormModalProps = {
  mode: 'create' | 'edit'
  chamado?: Chamado | null
  onClose: () => void
  onSubmit: (payload: ChamadoAbertura | ChamadoEdicao) => void
  onStatusChange?: (status: StatusChamado) => void
  isLoading?: boolean
  serverError?: string | null
}

export function SupportFormModal({
  mode,
  chamado,
  onClose,
  onSubmit,
  onStatusChange,
  isLoading = false,
  serverError = null,
}: SupportFormModalProps) {
  const titleId = useId()
  const [categoria, setCategoria] = useState<CategoriaChamado>(chamado?.categoria ?? 'DUVIDA')
  const [descricao, setDescricao] = useState(chamado?.descricao ?? '')
  const [resposta, setResposta] = useState(chamado?.resposta ?? '')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const texto = descricao.trim()
    if (!categoria) {
      setErrorMessage('categoria: A categoria é obrigatória')
      return
    }
    if (!texto) {
      setErrorMessage('descricao: A descrição é obrigatória')
      return
    }

    setErrorMessage(null)
    if (mode === 'edit') {
      const edicao: ChamadoEdicao = {
        categoria,
        descricao: texto,
        resposta: resposta.trim() ? resposta.trim() : null,
      }
      onSubmit(edicao)
      return
    }

    const abertura: ChamadoAbertura = { categoria, descricao: texto }
    onSubmit(abertura)
  }

  return (
    <div className="support-form-modal__overlay">
      <div className="support-form-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="support-form-modal__header">
          <button type="button" className="support-form-modal__close" aria-label="Fechar" onClick={onClose}>
            ×
          </button>
          <h2 id={titleId} className="support-form-modal__title">
            {mode === 'create' ? 'Abrir chamado' : 'Atualizar chamado'}
          </h2>
        </header>
        <form className="support-form-modal__form" onSubmit={handleSubmit}>
          <div className="support-form-modal__panel">
            <label>
              Categoria
              <select value={categoria} onChange={(event) => setCategoria(event.target.value as CategoriaChamado)}>
                {CATEGORIAS.map((item) => (
                  <option key={item} value={item}>
                    {rotuloCategoria(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Descrição
              <textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} />
            </label>
            {mode === 'edit' && chamado ? (
              <>
                <label>
                  Status
                  <select
                    aria-label={`Status do chamado ${chamado.id}`}
                    value={chamado.status}
                    onChange={(event) => onStatusChange?.(event.target.value as StatusChamado)}
                  >
                    {STATUS_CHAMADO.map((status) => (
                      <option key={status} value={status}>
                        {rotuloStatus(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Resposta
                  <textarea value={resposta} onChange={(event) => setResposta(event.target.value)} />
                </label>
              </>
            ) : null}
            {errorMessage || serverError ? (
              <p className="support-form-modal__error" role="alert">
                {errorMessage || serverError}
              </p>
            ) : null}
            <div className="support-form-modal__actions">
              <button type="button" className="support-form-modal__cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="support-form-modal__confirm" disabled={isLoading}>
                {isLoading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
