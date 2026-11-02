import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { getDashboardData } from '../../services/dashboard.service.ts'
import type { IDashboardData } from '../../types/dashboard.types.ts'
import { MenuButton } from '../../components/MenuButton/MenuButton.tsx'
import { BrandTitle } from '../../components/BrandTitle/BrandTitle.tsx'
import { SideNav } from '../../components/SideNav/SideNav.tsx'
import { AccessibilityButton } from '../../components/AccessibilityButton/AccessibilityButton.tsx'
import { DashboardKpiCard } from '../../components/DashboardKpiCard/index.tsx'
import { StatusDonutChart } from '../../components/DashboardCharts/StatusDonutChart.tsx'
import { CategoryBarChart } from '../../components/DashboardCharts/CategoryBarChart.tsx'
import { DashboardRecentTable } from '../../components/DashboardRecentTable/index.tsx'
import { LoadingSpinner } from '../../components/LoadingSpinner/index.tsx'
import './styles.css'

export default function Dashboards() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getDashboardData()
      setDashboardData(data)
      setErrorMessage(null)
    } catch (err: unknown) {
      console.error('Falha ao carregar métricas do dashboard:', err)
      const msg = err instanceof Error ? err.message : 'Falha na conexão com os serviços do dashboard.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initialize() {
      try {
        const data = await getDashboardData()
        if (isMounted) {
          setDashboardData(data)
          setErrorMessage(null)
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error('Falha ao carregar métricas do dashboard:', err)
          const msg = err instanceof Error ? err.message : 'Falha na conexão com os serviços do dashboard.'
          setErrorMessage(msg)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initialize()
    return () => {
      isMounted = false
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
  }

  const handleRetry = async () => {
    setIsLoading(true)
    await fetchData()
  }

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const handleNavigate = (section: 'administradores' | 'perfil' | 'dashboards' | 'chamados') => {
    if (section === 'administradores') {
      navigate('/administradores')
    } else if (section === 'perfil') {
      navigate('/perfil')
    } else if (section === 'chamados') {
      navigate('/chamados')
    } else if (section === 'dashboards') {
      handleCloseMenu()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatHoraAtualizacao = (isoString?: string) => {
    if (!isoString) return ''
    try {
      const d = new Date(isoString)
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch {
      return ''
    }
  }

  const primeiroNome = user?.nome ? user.nome.trim().split(' ')[0] : 'Administrador'

  return (
    <div className="dashboard-page">
      {/* WCAG 2.1 AA: Link para pular direto ao conteúdo principal */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Landmark: Banner / Header */}
      <header className="dashboard-page__header">
        <MenuButton
          ref={menuButtonRef}
          expanded={menuOpen}
          onClick={handleToggleMenu}
        />
        <BrandTitle section="Dashboards" />
      </header>

      <div className="dashboard-page__body">
        {/* Landmark: Navegação lateral */}
        {menuOpen ? (
          <SideNav
            currentSection="dashboards"
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onClose={handleCloseMenu}
          />
        ) : null}

        {/* Landmark: Conteúdo principal */}
        <main className="dashboard-page__content" id="main-content" tabIndex={-1}>
          {/* Barra Superior de Visão Geral com Saudação e Botão Atualizar */}
          <div className="dashboard-page__overview-bar">
            <div>
              <h1 className="dashboard-page__main-title">Visão Geral</h1>
              <p className="dashboard-page__greeting">
                Olá, <strong>{primeiroNome}</strong>
                {dashboardData?.ultimaAtualizacao && (
                  <span className="dashboard-page__update-time">
                    {' '}· Atualizado às {formatHoraAtualizacao(dashboardData.ultimaAtualizacao)}
                  </span>
                )}
              </p>
            </div>

            <button
              type="button"
              className="dashboard-page__refresh-btn"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              aria-label="Atualizar métricas do dashboard"
            >
              <RefreshIcon className={isRefreshing ? 'dashboard-refresh-spin' : ''} fontSize="small" />
              <span>{isRefreshing ? 'Atualizando...' : 'Atualizar'}</span>
            </button>
          </div>

          {/* Feedback de Carregamento Inicial */}
          {isLoading ? (
            <div className="dashboard-page__state-box" role="status">
              <LoadingSpinner label="Carregando indicadores do dashboard operacional..." />
            </div>
          ) : errorMessage ? (
            /* Feedback de Erro: Não substitui a falha por zeros falsos */
            <div className="dashboard-page__state-box dashboard-page__state-box--error" role="alert">
              <p className="dashboard-page__error-title">Falha ao obter dados do dashboard</p>
              <p className="dashboard-page__error-desc">{errorMessage}</p>
              <button
                type="button"
                className="dashboard-page__retry-btn"
                onClick={handleRetry}
              >
                Tentar novamente
              </button>
            </div>
          ) : dashboardData ? (
            <>
              {/* 1. Grade de Cards de KPIs Operacionais (6 cards essenciais) */}
              <section className="dashboard-kpis-grid" aria-label="Indicadores operacionais chave">
                <DashboardKpiCard
                  title="Administradores cadastrados"
                  value={dashboardData.kpis.totalAdministradores}
                  description="Total de administradores no sistema"
                  linkTo="/administradores"
                  type="default"
                />
                <DashboardKpiCard
                  title="Centros de distribuição cadastrados"
                  value={dashboardData.kpis.totalCds}
                  description="Unidades de distribuição registradas"
                  type="default"
                />
                <DashboardKpiCard
                  title="Chamados abertos"
                  value={dashboardData.kpis.chamadosAbertos}
                  description="Registrados e em atendimento"
                  linkTo="/chamados"
                  type="warning"
                />
                <DashboardKpiCard
                  title="Chamados registrados"
                  value={dashboardData.kpis.chamadosRegistrados}
                  description="Aguardando início de suporte"
                  linkTo="/chamados"
                  type="warning"
                />
                <DashboardKpiCard
                  title="Chamados em atendimento"
                  value={dashboardData.kpis.chamadosEmAtendimento}
                  description="Sendo tratados pela equipe"
                  linkTo="/chamados"
                  type="info"
                />
                <DashboardKpiCard
                  title="Chamados atendidos"
                  value={dashboardData.kpis.chamadosAtendidos}
                  description="Resolvidos e concluídos"
                  linkTo="/chamados"
                  type="success"
                />
              </section>

              {/* 2. Seção de Gráficos (Situação e Categoria) */}
              <section className="dashboard-charts-grid" aria-label="Gráficos de solicitações de suporte">
                <StatusDonutChart data={dashboardData.chamadosPorSituacao} />
                <CategoryBarChart data={dashboardData.chamadosPorCategoria} />
              </section>

              {/* 3. Tabela de Solicitações Recentes com Abas ARIA */}
              <section className="dashboard-recent-section" aria-label="Fila de solicitações recentes">
                <DashboardRecentTable tickets={dashboardData.chamadosRecentes} />
              </section>

              {/* 4. Atalhos Administrativos */}
              <section className="dashboard-shortcuts-bar" aria-label="Atalhos administrativos rápidos">
                <Link to="/administradores" className="dashboard-shortcut-btn">
                  Gerenciar administradores
                </Link>
                <Link to="/chamados" className="dashboard-shortcut-btn dashboard-shortcut-btn--secondary">
                  Ver todos os chamados
                </Link>
              </section>
            </>
          ) : null}

          <AccessibilityButton />
        </main>
      </div>

      {/* Landmark: Rodapé / Footer */}
      <footer className="dashboard-page__footer">
        <p>© 2026 Skadi · Painel Operacional do SuperAdmin · Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
