import { ErrorOutlined as ErrorIcon } from '@mui/icons-material'

export interface IErrorMessageProps {
  message?: string | null
}

export function ErrorMessage({ message }: IErrorMessageProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '1rem 1.4rem',
        backgroundColor: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #f87171',
        borderRadius: '0.8rem',
        fontSize: '1.3rem',
        fontWeight: 600,
        marginTop: '0.8rem',
      }}
    >
      <ErrorIcon fontSize="small" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
