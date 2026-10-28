import { AdministratorCard } from '../AdministratorCard/AdministratorCard.tsx'
import type { Administrator } from '../../data/administrators.ts'
import './StaffTable.css'

type StaffTableProps = {
  administrators: Administrator[]
  onDelete: (id: string | number) => void
  onEdit: (administrator: Administrator) => void
}

const columns = ['Nome', 'Username', 'CPF', 'E-mail', 'Senha', 'Acesso', 'CD']

export function StaffTable({ administrators, onDelete, onEdit }: StaffTableProps) {
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
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}
