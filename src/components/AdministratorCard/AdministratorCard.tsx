import actions from '../../assets/admin/row-actions.svg'
import type { Administrator } from '../../data/administrators.ts'
import './AdministratorCard.css'

type AdministratorCardProps = {
  administrator: Administrator
  onDelete: (id: string) => void
}

export function AdministratorCard({ administrator, onDelete }: AdministratorCardProps) {
  return (
    <article className="administrator-card" aria-label={administrator.nome}>
      <p>{administrator.nome}</p>
      <p>{administrator.username}</p>
      <p>{administrator.email}</p>
      <p>{administrator.senha}</p>
      <p>{administrator.acesso}</p>
      <p>{administrator.cd}</p>
      <p>{administrator.gestor}</p>
      <div className="administrator-card__actions">
        <img src={actions} alt="" />
        <button type="button" aria-label={`Editar ${administrator.nome}`} />
        <button
          type="button"
          aria-label={`Excluir ${administrator.nome}`}
          onClick={() => onDelete(administrator.id)}
        />
      </div>
    </article>
  )
}
