import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AccessibilityProvider } from './contexts/AccessibilityContext.tsx'
import { AccessibilityModal } from './components/AccessibilityModal/index.tsx'
import { PrivateRoute } from './components/PrivateRoute/index.tsx'
import { LoadingSpinner } from './components/LoadingSpinner/index.tsx'

const Login = lazy(() => import('./pages/Login/index.tsx'))
const Dashboards = lazy(() => import('./pages/Dashboards/index.tsx'))
const AdministratorsScreen = lazy(() =>
  import('./pages/AdministratorsScreen/AdministratorsScreen.tsx').then((m) => ({
    default: m.AdministratorsScreen,
  })),
)
const ProfileScreen = lazy(() => import('./pages/Profile/index.tsx'))
const SupportScreen = lazy(() =>
  import('./pages/SupportScreen/SupportScreen.tsx').then((m) => ({
    default: m.SupportScreen,
  })),
)
const EmployeeDetails = lazy(() => import('./pages/EmployeeDetails/index.tsx'))
const NotFound = lazy(() => import('./pages/NotFound/index.tsx'))

export default function App() {
  useEffect(() => {
    if (localStorage.getItem('skadi_dark_mode') === 'true') {
      document.documentElement.classList.add('dark-mode')
    }
  }, [])

  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <AccessibilityModal />
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
              {/* Redirecionamento da raiz para login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />

              {/* Rotas Privadas (protegidas por PrivateRoute via AuthContext) */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboards" element={<Dashboards />} />
                {/* Redirecionamento da rota legada /home para /dashboards */}
                <Route path="/home" element={<Navigate to="/dashboards" replace />} />
                <Route path="/perfil" element={<ProfileScreen />} />
                <Route path="/administradores" element={<AdministratorsScreen />} />
                <Route path="/chamados" element={<SupportScreen />} />
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
