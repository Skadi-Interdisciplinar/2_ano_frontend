import { AdministratorCard } from '../AdministratorCard/AdministratorCard.tsx'
import type { Administrator } from '../../data/administrators.ts'
import './StaffTable.css'

type StaffTableProps = {
  administrators: Administrator[]
  onDelete: (id: string) => void
}

const columns = ['Nome', 'Username', 'E-mail', 'Senha', 'Acesso', 'CD', 'Gestor']

export function StaffTable({ administrators, onDelete }: StaffTableProps) {
  return (
    <div className="staff-table">
      <div className="staff-table__header" role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
        <span className="staff-table__actions-label" role="columnheader">
          Ações
        </span>
      </div>
      <div className="staff-table__cards">
        {administrators.map((administrator) => (
          <AdministratorCard
            key={administrator.id}
            administrator={administrator}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
