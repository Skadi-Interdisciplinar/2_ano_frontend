import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const AdministratorsScreen = lazy(() =>
  import('./components/AdministratorsScreen/AdministratorsScreen.tsx').then((m) => ({
    default: m.AdministratorsScreen,
  })),
)
const ProfileScreen = lazy(() =>
  import('./components/ProfileScreen/ProfileScreen.tsx').then((m) => ({
    default: m.ProfileScreen,
  })),
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100vh',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#0f2e4f',
              color: '#ffffff',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            Carregando...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/perfil" replace />} />
          <Route path="/administradores" element={<AdministratorsScreen />} />
          <Route path="/perfil" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/perfil" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
