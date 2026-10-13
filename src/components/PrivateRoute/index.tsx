import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { LoadingSpinner } from '../LoadingSpinner/index.tsx'

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <LoadingSpinner label="Validando credenciais..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
