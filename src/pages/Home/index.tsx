import { Link, useNavigate } from 'react-router-dom'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { AccessibilityButton } from '../../components/AccessibilityButton/index.tsx'
import { AccessibilityModal } from '../../components/AccessibilityModal/index.tsx'
import skadiLogoWhite from '../../assets/skadi-logo-white.png'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          backgroundColor: '#0b2540',
          color: '#ffffff',
          padding: '1.6rem 3.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 0.4rem 1.2rem rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
          <img src={skadiLogoWhite} alt="Logo Skadi" style={{ height: '3.6rem', width: 'auto' }} />
          <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.15em', fontWeight: 700 }}>
            SKADI
          </h1>
        </div>

        <nav aria-label="Menu principal" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '1.4rem', color: '#cbd5e1' }}>
            Olá, <strong>{user?.usuario ?? 'Administrador'}</strong>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.8rem',
              padding: '0.8rem 1.4rem',
              fontSize: '1.3rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogoutIcon fontSize="small" />
            Sair
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '3.2rem', maxWidth: '120rem', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <section
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.6rem',
            padding: '3.2rem',
            boxShadow: '0 0.4rem 1.6rem rgba(0,0,0,0.06)',
            marginBottom: '2.4rem',
          }}
        >
          <h2 style={{ fontSize: '2.4rem', color: '#0b2540', marginTop: 0 }}>
            Painel Administrativo
          </h2>
          <p style={{ fontSize: '1.5rem', color: '#475569', lineHeight: 1.6 }}>
            Bem-vindo à plataforma de monitoramento e gestão da Skadi. Selecione um colaborador abaixo para visualizar seus detalhes através do parâmetro de rota.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            <Link
              to="/funcionarios/1"
              style={{
                display: 'inline-block',
                padding: '1rem 1.8rem',
                backgroundColor: '#0b2540',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '0.8rem',
                fontWeight: 600,
                fontSize: '1.4rem',
              }}
            >
              Ver Colaborador #1
            </Link>
            <Link
              to="/funcionarios/2"
              style={{
                display: 'inline-block',
                padding: '1rem 1.8rem',
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '0.8rem',
                fontWeight: 600,
                fontSize: '1.4rem',
              }}
            >
              Ver Colaborador #2
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1.3rem',
          color: '#64748b',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <p style={{ margin: 0 }}>© 2026 Skadi - Todos os direitos reservados.</p>
      </footer>

      <AccessibilityButton />
      <AccessibilityModal />
    </div>
  )
}
