import { useNavigate, useParams } from 'react-router-dom'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { AccessibilityButton } from '../../components/AccessibilityButton/index.tsx'
import { AccessibilityModal } from '../../components/AccessibilityModal/index.tsx'

export default function EmployeeDetails() {
  const navigate = useNavigate()
  // Requisito 9: Parâmetros de rota recuperados com useParams com verificação de presença antes do uso
  const { id } = useParams<{ id: string }>()

  // Tratamento obrigatório caso o parâmetro de rota seja undefined ou vazio
  if (!id || id.trim() === '') {
    return (
      <main style={{ padding: '3.2rem', textAlign: 'center' }}>
        <p role="alert" style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.6rem' }}>
          Identificador do colaborador não fornecido ou inválido.
        </p>
        <button
          type="button"
          onClick={() => navigate('/home')}
          style={{
            marginTop: '1.6rem',
            padding: '1rem 2rem',
            backgroundColor: '#0b2540',
            color: '#fff',
            border: 'none',
            borderRadius: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Voltar para a listagem
        </button>
      </main>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '3.2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginBottom: '2.4rem' }}>
        <button
          type="button"
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '0.8rem',
            padding: '0.8rem 1.6rem',
            cursor: 'pointer',
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#0b2540',
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Voltar
        </button>
        <h1 style={{ margin: 0, fontSize: '2.2rem', color: '#0b2540' }}>
          Detalhes do Colaborador #{id}
        </h1>
      </header>

      <main
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.6rem',
          padding: '2.4rem',
          boxShadow: '0 0.4rem 1.2rem rgba(0, 0, 0, 0.05)',
          maxWidth: '60rem',
        }}
      >
        <p style={{ fontSize: '1.5rem', color: '#334155' }}>
          <strong>ID do Registro:</strong> {id}
        </p>
        <p style={{ fontSize: '1.5rem', color: '#334155' }}>
          <strong>Status:</strong> Ativo no sistema
        </p>
      </main>

      <AccessibilityButton />
      <AccessibilityModal />
    </div>
  )
}
