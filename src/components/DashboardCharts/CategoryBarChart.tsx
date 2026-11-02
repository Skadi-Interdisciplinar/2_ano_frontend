import type { ISupportTicketCategory } from '../../types/dashboard.types.ts'
import './styles.css'

export interface ICategoryBarChartProps {
  data: Record<ISupportTicketCategory, number>
}

const CATEGORY_LABELS: Record<ISupportTicketCategory, string> = {
  DUVIDA: 'Dúvida',
  SUGESTAO: 'Sugestão',
  RECLAMACAO: 'Reclamação',
  OUTRO: 'Outro',
}

export function CategoryBarChart({ data }: ICategoryBarChartProps) {
  const categories: ISupportTicketCategory[] = ['DUVIDA', 'SUGESTAO', 'RECLAMACAO', 'OUTRO']
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)
  const maxVal = Math.max(...Object.values(data), 1)

  return (
    <div className="dashboard-chart-card">
      <h3 className="dashboard-chart-card__title">Chamados por Categoria</h3>
      <p className="dashboard-chart-card__subtitle">Distribuição por assunto relatado</p>

      {total === 0 ? (
        <div className="dashboard-chart-card__empty" role="status">
          Nenhuma solicitação de suporte registrada.
        </div>
      ) : (
        <div className="category-bar-chart" role="list" aria-label="Lista de chamados por categoria">
          {categories.map((cat) => {
            const val = data[cat] || 0
            const pct = Math.round((val / maxVal) * 100)
            const sharePct = total > 0 ? Math.round((val / total) * 100) : 0

            return (
              <div key={cat} className="category-bar-item" role="listitem">
                <div className="category-bar-item__header">
                  <span className="category-bar-item__label">{CATEGORY_LABELS[cat]}</span>
                  <span className="category-bar-item__count">
                    <strong>{val}</strong> ({sharePct}%)
                  </span>
                </div>
                <div className="category-bar-item__track" aria-hidden="true">
                  <div
                    className={`category-bar-item__fill category-bar-item__fill--${cat.toLowerCase()}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
