import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import actions from '../../assets/admin/row-actions.svg'
import { rotuloAcesso, rotuloGestor, type Administrator } from '../../data/administrators.ts'
import './AdministratorCard.css'

type AdministratorCardProps = {
  administrator: Administrator
  onDelete: (id: string | number) => void
  onEdit: (administrator: Administrator) => void
}

export function AdministratorCard({ administrator, onDelete, onEdit }: AdministratorCardProps) {
  const [cdsOpen, setCdsOpen] = useState(false)
  const [listPosition, setListPosition] = useState({ top: 0, left: 0 })
  const cdsRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const cds = administrator.cd ?? []
  const firstCd = cds[0]

  useEffect(() => {
    if (!cdsOpen) return

    const updatePosition = () => {
      const rect = cdsRef.current?.getBoundingClientRect()
      if (!rect) return
      setListPosition({ top: rect.bottom + 6, left: rect.left })
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (cdsRef.current?.contains(target) || listRef.current?.contains(target)) return
      setCdsOpen(false)
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [cdsOpen])

  return (
    <article className="administrator-card" aria-label={administrator.nome}>
      <p>{administrator.nome}</p>
      <p>{administrator.username}</p>
      <p>{administrator.email}</p>
      <p>{rotuloAcesso(administrator.nivelAcesso)}</p>
      <div className="administrator-card__cds" ref={cdsRef}>
        {cds.length > 0 ? (
          <button
            type="button"
            className="administrator-card__cds-trigger"
            aria-expanded={cdsOpen}
            aria-label={`Centros de distribuição de ${administrator.nome}`}
            onClick={() => setCdsOpen((open) => !open)}
          >
            <span>{firstCd?.name ?? ''}</span>
            <span className="administrator-card__cds-chevron" aria-hidden="true" />
          </button>
        ) : null}
        {cdsOpen
          ? createPortal(
              <ul
                ref={listRef}
                className="administrator-card__cds-list"
                style={{ top: listPosition.top, left: listPosition.left }}
              >
                {cds.map((cd) => (
                  <li key={cd.id}>{cd.name}</li>
                ))}
              </ul>,
              document.body,
            )
          : null}
      </div>
      <p>{rotuloGestor(administrator)}</p>
      <div className="administrator-card__actions">
        <img src={actions} alt="" />
        <button type="button" aria-label={`Editar ${administrator.nome}`} onClick={() => onEdit(administrator)} />
        <button
          type="button"
          aria-label={`Excluir ${administrator.nome}`}
          onClick={() => onDelete(administrator.id)}
        />
      </div>
    </article>
  )
}
