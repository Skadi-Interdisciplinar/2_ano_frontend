import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessibilityButton } from '../../components/AccessibilityButton/index.tsx'
import { BrandTitle } from '../../components/BrandTitle/index.tsx'
import { MenuButton } from '../../components/MenuButton/index.tsx'
import { SideNav } from '../../components/SideNav/index.tsx'
import { ProfileCard } from '../../components/ProfileCard/index.tsx'
import { ResetPasswordModal } from '../../components/ResetPasswordModal/index.tsx'
import { ConfirmDialog } from '../../components/ConfirmDialog/index.tsx'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_PREFERENCES,
} from '../../data/profile.ts'
import type {
  IUserProfile,
  IProfilePreferences,
  IRedefinirSenhaPayload,
} from '../../types/profile.types.ts'
import {
  getPerfil,
  atualizarPreferencias,
  redefinirSenha,
} from '../../services/profile.service.ts'
import { validarRedefinirSenha } from '../../utils/validation.utils.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { carregarComVersao } from '../../utils/storage.utils.ts'
import type { IAuthUser } from '../../types/auth.types.ts'
import '../../components/ProfileScreen/ProfileScreen.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'perfil' | 'redefinir-senha'>('perfil')

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null)

  // Inicializa com os dados do usuário autenticado do AuthContext / localStorage versionado
  const [profile, setProfile] = useState<IUserProfile>(() => {
    const savedUser = user ?? carregarComVersao<IAuthUser | null>('skadi_user', 1, null)
    if (savedUser) {
      return {
        id: savedUser.id || DEFAULT_USER_PROFILE.id,
        nome: savedUser.nome || DEFAULT_USER_PROFILE.nome,
        cargo: savedUser.cargo || DEFAULT_USER_PROFILE.cargo,
        usuario: savedUser.usuario || DEFAULT_USER_PROFILE.usuario,
        email: savedUser.email || DEFAULT_USER_PROFILE.email,
        unidade: DEFAULT_USER_PROFILE.unidade,
      }
    }
    return DEFAULT_USER_PROFILE
  })

  const [preferences, setPreferences] = useState<IProfilePreferences>(() => {
    const isDark =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('skadi_dark_mode') === 'true'
        : false
    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      modoEscuro: isDark,
    }
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<IRedefinirSenhaPayload | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Combina o perfil carregado com o usuário autenticado atual sem cascateamento de renders
  const activeProfile = useMemo<IUserProfile>(() => {
    return {
      ...profile,
      id: user?.id || profile.id,
      nome: user?.nome || profile.nome,
      cargo: user?.cargo || profile.cargo,
      usuario: user?.usuario || profile.usuario,
      email: user?.email || profile.email,
    }
  }, [profile, user])

  // Busca dados adicionais do perfil caso disponíveis no backend
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const userProfile = await getPerfil()
        if (isMounted && userProfile) {
          setProfile((prev) => ({
            ...prev,
            ...userProfile,
          }))
        }
      } catch (err: unknown) {
        console.error('Falha ao carregar perfil:', err)
      }
    }

    void loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const handleToggleDarkMode = async (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, modoEscuro: enabled }))
    if (enabled) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('skadi_dark_mode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('skadi_dark_mode', 'false')
    }
    await atualizarPreferencias({ modoEscuro: enabled })
  }

  const handleOpenResetPassword = () => {
    lastActiveTriggerRef.current = document.activeElement as HTMLElement
    setCurrentView('redefinir-senha')
  }

  const handleBackToProfile = () => {
    setCurrentView('perfil')
    setTimeout(() => {
      lastActiveTriggerRef.current?.focus()
    }, 50)
  }

  const handleStartResetPassword = (payload: IRedefinirSenhaPayload) => {
    // Validação tipada via utils antes de prosseguir
    const validation = validarRedefinirSenha(payload)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] ?? 'Dados inválidos.'
      setToastMessage({ text: firstError, type: 'error' })
      return
    }
    setPendingPayload(payload)
    setShowConfirmDialog(true)
  }

  const handleConfirmResetPassword = async () => {
    if (!pendingPayload) return

    setIsSubmitting(true)
    try {
      const res = await redefinirSenha(pendingPayload)
      setShowConfirmDialog(false)
      setPendingPayload(null)
      setCurrentView('perfil')
      setToastMessage({ text: res.message, type: 'success' })
      setTimeout(() => setToastMessage(null), 5000)
      lastActiveTriggerRef.current?.focus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao redefinir senha.'
      setToastMessage({ text: msg, type: 'error' })
      setShowConfirmDialog(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigate = (section: string) => {
    if (section === 'dashboards') {
      navigate('/dashboards')
    } else if (section === 'administradores') {
      navigate('/administradores')
    } else if (section === 'perfil') {
      setCurrentView('perfil')
      handleCloseMenu()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-screen">
      {/* WCAG 2.1 AA: Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Landmark: Banner / Header */}
      <header className="profile-screen__header">
        <MenuButton
          ref={menuButtonRef}
          expanded={menuOpen}
          onClick={handleToggleMenu}
        />
        <BrandTitle section="Perfil" />
      </header>

      <div className="profile-screen__body">
        {/* Landmark: Menu lateral */}
        {menuOpen ? (
          <SideNav
            currentSection="perfil"
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onClose={handleCloseMenu}
          />
        ) : null}

        {/* Landmark: Conteúdo principal */}
        <main className="profile-screen__content" id="main-content" tabIndex={-1}>
          {toastMessage && (
            <div
              className={`profile-screen__toast profile-screen__toast--${toastMessage.type}`}
              role="status"
              aria-live="polite"
            >
              {toastMessage.text}
            </div>
          )}

          <div className="profile-screen__view-container">
            {currentView === 'perfil' ? (
              <ProfileCard
                profile={activeProfile}
                preferences={preferences}
                onOpenResetPassword={handleOpenResetPassword}
                onToggleDarkMode={handleToggleDarkMode}
              />
            ) : (
              <ResetPasswordModal
                onBack={handleBackToProfile}
                onSubmit={handleStartResetPassword}
                isLoading={isSubmitting}
              />
            )}
          </div>

          <AccessibilityButton />
        </main>
      </div>

      {/* Landmark: Rodapé / Footer */}
      <footer className="profile-screen__footer">
        <p>© 2026 Skadi · Meu Perfil · Todos os direitos reservados.</p>
      </footer>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmResetPassword}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export { ProfilePage as ProfileScreen }
