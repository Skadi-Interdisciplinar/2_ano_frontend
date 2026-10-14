import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AccessibilityProvider } from './contexts/AccessibilityContext.tsx'
import { PrivateRoute } from './components/PrivateRoute/index.tsx'
import { LoadingSpinner } from './components/LoadingSpinner/index.tsx'

const Login = lazy(() => import('./pages/Login/index.tsx'))
const Home = lazy(() => import('./pages/Home/index.tsx'))
const AdministratorsScreen = lazy(() =>
  import('./components/AdministratorsScreen/AdministratorsScreen.tsx').then((m) => ({
    default: m.AdministratorsScreen,
  })),
)
const EmployeeDetails = lazy(() => import('./pages/EmployeeDetails/index.tsx'))
const NotFound = lazy(() => import('./pages/NotFound/index.tsx'))

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <Suspense
            fallback={
              <div
                style={{
                  minHeight: '100vh',
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: '#0b1e33',
                  color: '#ffffff',
                }}
              >
                <LoadingSpinner label="Carregando módulo da aplicação..." />
              </div>
            }
          >
            <Routes>
              {/* Redirecionamento da raiz */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Rota pública de Login */}
              <Route path="/login" element={<Login />} />

              {/* Rotas Privadas */}
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/administradores" element={<AdministratorsScreen />} />
                <Route path="/funcionarios/:id" element={<EmployeeDetails />} />
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  )
}