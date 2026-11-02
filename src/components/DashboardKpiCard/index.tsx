import { Link } from 'react-router-dom'
import './styles.css'

export interface IDashboardKpiCardProps {
  title: string
  value: number | string
  description?: string
  linkTo?: string
  type?: 'default' | 'info' | 'warning' | 'success' | 'alert'
  ariaLabel?: string
}

export function DashboardKpiCard({
  title,
  value,
  description,
  linkTo,
  type = 'default',
  ariaLabel,
}: IDashboardKpiCardProps) {
  const content = (
    <div className={`dashboard-kpi-card dashboard-kpi-card--${type}`}>
      <div className="dashboard-kpi-card__header">
        <h3 className="dashboard-kpi-card__title">{title}</h3>
      </div>
      <div className="dashboard-kpi-card__body">
        <span className="dashboard-kpi-card__value">{value}</span>
        {description && <p className="dashboard-kpi-card__desc">{description}</p>}
      </div>
      {linkTo && (
        <span className="dashboard-kpi-card__action" aria-hidden="true">
          Ver detalhes &rarr;
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="dashboard-kpi-card__link"
        aria-label={ariaLabel || `${title}: ${value}. Clique para ver detalhes.`}
      >
        {content}
      </Link>
    )
  }

  return content
}
