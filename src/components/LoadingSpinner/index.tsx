import { CircularProgress } from '@mui/material'

export interface ILoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Carregando...' }: ILoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1.6rem',
        color: '#0b2540',
      }}
    >
      <CircularProgress size={24} color="inherit" />
      <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>{label}</span>
    </div>
  )
}
