import { useState, useRef, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ISupportTicketItem } from '../../types/dashboard.types.ts'
import './styles.css'

export interface IDashboardRecentTableProps {
  tickets: ISupportTicketItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  DUVIDA: 'Dúvida',
  SUGESTAO: 'Sugestão',
  RECLAMACAO: 'Reclamação',
  OUTRO: 'Outro',
}

const STATUS_LABELS: Record<string, string> = {
  REGISTRADO: 'Registrado',
  EM_ATENDIMENTO: 'Em atendimento',
  ATENDIDO: 'Atendido',
}

type TabType = 'todos' | 'abertos' | 'atendidos'

interface ITabOption {
  id: TabType
  label: string
}

const TABS: ITabOption[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'abertos', label: 'Abertos (Pendentes)' },
  { id: 'atendidos', label: 'Atendidos' },
]

export function DashboardRecentTable({ tickets }: IDashboardRecentTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>('todos')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'abertos') {
      return t.status === 'REGISTRADO' || t.status === 'EM_ATENDIMENTO'
    }
    if (activeTab === 'atendidos') {
      return t.status === 'ATENDIDO'
    }
    return true
  })

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  // Navegação de teclado nas abas conforme WAI-ARIA
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex: number | null = null

    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % TABS.length
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + TABS.length) % TABS.length
    } else if (e.key === 'Home') {
      targetIndex = 0
    } else if (e.key === 'End') {
      targetIndex = TABS.length - 1
    }

    if (targetIndex !== null) {
      e.preventDefault()
      const nextTab = TABS[targetIndex]
      setActiveTab(nextTab.id)
      tabRefs.current[targetIndex]?.focus()
    }
  }

  return (
    <div className="recent-tickets-card">
      <div className="recent-tickets-card__header">
        <div>
          <h3 className="recent-tickets-card__title">Chamados Recentes</h3>
          <p className="recent-tickets-card__subtitle">Últimas solicitações registradas na plataforma</p>
        </div>
        <Link to="/chamados" className="recent-tickets-card__see-all" aria-label="Ver todos os chamados">
          Ver todos &rarr;
        </Link>
      </div>

      {/* Abas com padrão WAI-ARIA (role=tablist, role=tab, aria-selected, aria-controls) */}
      <div
        className="recent-tickets-tablist"
        role="tablist"
        aria-label="Filtrar chamados por situação"
      >
        {TABS.map((tab, index) => {
          const isSelected = activeTab === tab.id
          const count = tickets.filter((t) => {
            if (tab.id === 'abertos') return t.status === 'REGISTRADO' || t.status === 'EM_ATENDIMENTO'
            if (tab.id === 'atendidos') return t.status === 'ATENDIDO'
            return true
          }).length

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`tab-chamados-${tab.id}`}
              className={`recent-tickets-tab ${isSelected ? 'recent-tickets-tab--active' : ''}`}
              aria-selected={isSelected}
              aria-controls="panel-chamados-recentes"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      <div
        id="panel-chamados-recentes"
        role="tabpanel"
        aria-labelledby={`tab-chamados-${activeTab}`}
        tabIndex={0}
      >
        {filteredTickets.length === 0 ? (
          <div className="recent-tickets-card__empty" role="status">
            Nenhum chamado encontrado para o filtro selecionado.
          </div>
        ) : (
          <div className="recent-tickets-table-wrapper">
            <table className="recent-tickets-table" aria-label="Tabela de solicitações recentes de suporte">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Situação</th>
                  <th scope="col">Abertura</th>
                  <th scope="col" className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="font-semibold text-primary">#{ticket.id}</td>
                    <td>{CATEGORY_LABELS[ticket.categoria] || ticket.categoria}</td>
                    <td>
                      <span className={`status-badge status-badge--${ticket.status.toLowerCase().replace('_', '-')}`}>
                        {STATUS_LABELS[ticket.status] || ticket.status}
                      </span>
                    </td>
                    <td className="text-muted">{formatDate(ticket.dataHoraAbertura)}</td>
                    <td className="text-right">
                      <Link
                        to={`/chamados/${ticket.id}`}
                        className="recent-tickets-action-btn"
                        aria-label={`Abrir detalhes do chamado número ${ticket.id}`}
                      >
                        Abrir chamado
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
