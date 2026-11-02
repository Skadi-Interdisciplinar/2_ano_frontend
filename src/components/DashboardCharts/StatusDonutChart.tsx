import type { ISupportTicketStatus } from '../../types/dashboard.types.ts'
import './styles.css'

export interface IStatusDonutChartProps {
  data: Record<ISupportTicketStatus, number>
}

export function StatusDonutChart({ data }: IStatusDonutChartProps) {
  const regist = data.REGISTRADO || 0
  const emAtend = data.EM_ATENDIMENTO || 0
  const atendidos = data.ATENDIDO || 0
  const total = regist + emAtend + atendidos

  // Cálculo de arcos SVG para o donut
  const radius = 60
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const registPercent = total > 0 ? regist / total : 0
  const emAtendPercent = total > 0 ? emAtend / total : 0
  const atendidosPercent = total > 0 ? atendidos / total : 0

  const registStroke = registPercent * circumference
  const emAtendStroke = emAtendPercent * circumference
  const atendidosStroke = atendidosPercent * circumference

  const registOffset = 0
  const emAtendOffset = -(registStroke)
  const atendidosOffset = -(registStroke + emAtendStroke)

  const formatPct = (val: number) => (total > 0 ? `${Math.round((val / total) * 100)}%` : '0%')

  return (
    <div className="dashboard-chart-card">
      <h3 className="dashboard-chart-card__title">Chamados por Situação</h3>
      <p className="dashboard-chart-card__subtitle">Distribuição por status operacional</p>

      {total === 0 ? (
        <div className="dashboard-chart-card__empty" role="status">
          Nenhuma solicitação de suporte registrada.
        </div>
      ) : (
        <div className="status-donut-chart">
          <div
            className="status-donut-chart__graphic"
            role="img"
            aria-label={`Gráfico de situação dos chamados: ${regist} Registrados (${formatPct(regist)}), ${emAtend} Em atendimento (${formatPct(emAtend)}), ${atendidos} Atendidos (${formatPct(atendidos)}). Total: ${total}.`}
          >
            <svg viewBox="0 0 160 160" className="status-donut-chart__svg">
              {/* Círculo de fundo */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--chart-bg-track, #e2e8f0)"
                strokeWidth={strokeWidth}
              />
              {/* Segmento: Atendidos (Verde) */}
              {atendidos > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${atendidosStroke} ${circumference}`}
                  strokeDashoffset={atendidosOffset}
                  transform="rotate(-90 80 80)"
                />
              )}
              {/* Segmento: Em atendimento (Azul) */}
              {emAtend > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${emAtendStroke} ${circumference}`}
                  strokeDashoffset={emAtendOffset}
                  transform="rotate(-90 80 80)"
                />
              )}
              {/* Segmento: Registrado (Âmbar/Laranja) */}
              {regist > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${registStroke} ${circumference}`}
                  strokeDashoffset={registOffset}
                  transform="rotate(-90 80 80)"
                />
              )}
            </svg>
            <div className="status-donut-chart__center">
              <span className="status-donut-chart__center-val">{total}</span>
              <span className="status-donut-chart__center-label">Total</span>
            </div>
          </div>

          <ul className="status-donut-chart__legend" aria-label="Legenda por situação">
            <li className="status-donut-legend-item">
              <span className="status-donut-legend-item__dot status-donut-legend-item__dot--registrado" />
              <div className="status-donut-legend-item__info">
                <span className="status-donut-legend-item__label">Registrados</span>
                <span className="status-donut-legend-item__vals">
                  <strong>{regist}</strong> ({formatPct(regist)})
                </span>
              </div>
            </li>
            <li className="status-donut-legend-item">
              <span className="status-donut-legend-item__dot status-donut-legend-item__dot--em-atendimento" />
              <div className="status-donut-legend-item__info">
                <span className="status-donut-legend-item__label">Em atendimento</span>
                <span className="status-donut-legend-item__vals">
                  <strong>{emAtend}</strong> ({formatPct(emAtend)})
                </span>
              </div>
            </li>
            <li className="status-donut-legend-item">
              <span className="status-donut-legend-item__dot status-donut-legend-item__dot--atendido" />
              <div className="status-donut-legend-item__info">
                <span className="status-donut-legend-item__label">Atendidos</span>
                <span className="status-donut-legend-item__vals">
                  <strong>{atendidos}</strong> ({formatPct(atendidos)})
                </span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
