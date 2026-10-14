import { useState } from 'react'
import type { IUserProfile, IProfilePreferences } from '../../data/profile.ts'
import './ProfileCard.css'

export type ProfileCardProps = {
  profile: IUserProfile
  preferences?: IProfilePreferences
  onOpenResetPassword: () => void
  onToggleDarkMode?: (enabled: boolean) => void
}

export function ProfileCard({
  profile,
  preferences,
  onOpenResetPassword,
  onToggleDarkMode,
}: ProfileCardProps) {
  const [darkMode, setDarkMode] = useState(preferences?.modoEscuro ?? false)

  const handleToggle = () => {
    const next = !darkMode
    setDarkMode(next)
    onToggleDarkMode?.(next)
  }

  return (
    <article className="profile-card" aria-label="Informações do perfil">
      <div className="profile-card__left">
        <div className="profile-card__avatar-row">
          <div className="profile-card__avatar" aria-hidden="true">
            {profile.avatar ?? profile.nome.charAt(0).toUpperCase()}
          </div>
          <div className="profile-card__user-info">
            <h2 className="profile-card__name">{profile.nome}</h2>
            <p className="profile-card__role">{profile.cargo}</p>
            <div className="profile-card__username-row">
              <svg
                className="profile-card__user-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="profile-card__username">{profile.usuario}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="profile-card__reset-button"
          onClick={onOpenResetPassword}
          aria-label="Redefinir senha de acesso"
        >
          <span>Redefinir senha</span>
          <svg
            className="profile-card__chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="profile-card__divider" role="separator" aria-orientation="vertical" />

      <div className="profile-card__right">
        <h3 className="profile-card__preferences-title">Preferências</h3>

        <div className="profile-card__preference-item">
          <span className="profile-card__pref-label" id="label-dark-mode">Modo escuro</span>
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-labelledby="label-dark-mode"
            className={`profile-card__switch ${darkMode ? 'profile-card__switch--active' : ''}`}
            onClick={handleToggle}
          >
            <span className="profile-card__switch-handle" />
          </button>
        </div>

        <div className="profile-card__preference-item">
          <span className="profile-card__pref-label">Idioma</span>
          <span className="profile-card__pref-value">{preferences?.idioma ?? 'Português - BR'}</span>
        </div>
      </div>
    </article>
  )
}
