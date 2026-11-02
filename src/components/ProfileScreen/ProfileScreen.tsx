import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessibilityButton } from '../AccessibilityButton/AccessibilityButton.tsx'
import { BrandTitle } from '../BrandTitle/BrandTitle.tsx'
import { MenuButton } from '../MenuButton/MenuButton.tsx'
import { SideNav } from '../SideNav/SideNav.tsx'
import { ProfileCard } from '../ProfileCard/ProfileCard.tsx'
import { ResetPasswordModal } from '../ResetPasswordModal/ResetPasswordModal.tsx'
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog.tsx'
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_PREFERENCES,
  type IUserProfile,
  type IProfilePreferences,
  type IRedefinirSenhaPayload,
} from '../../data/profile.ts'
import { getPerfil, atualizarPreferencias, redefinirSenha } from '../../service/profile.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { carregarComVersao } from '../../utils/storage.utils.ts'
import type { IAuthUser } from '../../types/auth.types.ts'
import './ProfileScreen.css'

export function ProfileScreen() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'perfil' | 'redefinir-senha'>('perfil')

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
      } catch (err) {
        console.error('Falha ao carregar perfil:', err)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

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

  const handleStartResetPassword = (payload: IRedefinirSenhaPayload) => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao redefinir senha.'
      setToastMessage({ text: msg, type: 'error' })
      setShowConfirmDialog(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigate = (section: string) => {
    if (section === 'administradores') {
      navigate('/administradores')
    } else if (section === 'perfil') {
      setCurrentView('perfil')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className="profile-screen">
      <header className="profile-screen__header">
        <MenuButton expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
        <BrandTitle section="Perfil" />
      </header>

      <div className="profile-screen__body">
        {menuOpen ? (
          <SideNav
            currentSection="perfil"
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null}

        <section className="profile-screen__content">
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
                onOpenResetPassword={() => setCurrentView('redefinir-senha')}
                onToggleDarkMode={handleToggleDarkMode}
              />
            ) : (
              <ResetPasswordModal
                onBack={() => setCurrentView('perfil')}
                onSubmit={handleStartResetPassword}
                isLoading={isSubmitting}
              />
            )}
          </div>

          <AccessibilityButton />
        </section>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmResetPassword}
        isLoading={isSubmitting}
      />
    </main>
  )
}
