import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon } from '@mui/icons-material'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b1e33',
        color: '#ffffff',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '7.2rem', margin: 0, fontWeight: 800, color: '#60a5fa' }}>404</h1>
      <h2 style={{ fontSize: '2.4rem', marginTop: '1rem', marginBottom: '1rem' }}>
        Página não encontrada
      </h2>
      <p style={{ fontSize: '1.6rem', color: '#cbd5e1', maxWidth: '44rem', marginBottom: '2.4rem' }}>
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '1rem',
          padding: '1.2rem 2.4rem',
          fontSize: '1.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 0.4rem 1.4rem rgba(37, 99, 235, 0.4)',
        }}
      >
        <HomeIcon fontSize="small" />
        Voltar para o Login
      </button>
    </main>
  )
}
