import actions from '../../assets/admin/row-actions.svg'
import { STATUS_CHAMADO, rotuloCategoria, rotuloStatus, type Chamado, type StatusChamado } from '../../data/support.ts'
import './SupportTable.css'

type SupportTableProps = {
  chamados: Chamado[]
  onDelete: (chamado: Chamado) => void
  onEdit: (chamado: Chamado) => void
  onStatusChange: (chamado: Chamado, status: StatusChamado) => void
}

const columns = ['Categoria', 'Descrição', 'Status', 'Resposta']

export function SupportTable({ chamados, onDelete, onEdit, onStatusChange }: SupportTableProps) {
  return (
    <div className="support-table">
      <div className="support-table__header" role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
        <span className="support-table__actions-label" role="columnheader">
          Ações
        </span>
      </div>
      <div className="support-table__cards">
        {chamados.map((chamado) => (
          <article key={chamado.id} className="support-table__row" aria-label={rotuloCategoria(chamado.categoria)}>
            <p>{rotuloCategoria(chamado.categoria)}</p>
            <p>{chamado.descricao}</p>
            <label className="support-table__status">
              <span className="support-table__status-label">Status</span>
              <select
                aria-label={`Status do chamado ${chamado.id}`}
                value={chamado.status}
                onChange={(event) => onStatusChange(chamado, event.target.value as StatusChamado)}
              >
                {STATUS_CHAMADO.map((status) => (
                  <option key={status} value={status}>
                    {rotuloStatus(status)}
                  </option>
                ))}
              </select>
            </label>
            <p>{chamado.resposta?.trim() || '--'}</p>
            <div className="support-table__actions">
              <img src={actions} alt="" />
              <button type="button" aria-label={`Editar chamado ${chamado.id}`} onClick={() => onEdit(chamado)} />
              <button type="button" aria-label={`Excluir chamado ${chamado.id}`} onClick={() => onDelete(chamado)} />
        </div>
      </article>
        ))}
      </div>
    </div>
  )
}
