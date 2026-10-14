import { useState, type FormEvent, type ChangeEvent } from 'react'
import type { IRedefinirSenhaPayload } from '../../data/profile.ts'
import './ResetPasswordModal.css'

export type ResetPasswordModalProps = {
  onBack: () => void
  onSubmit: (payload: IRedefinirSenhaPayload) => void
  isLoading?: boolean
}

export function ResetPasswordModal({ onBack, onSubmit, isLoading = false }: ResetPasswordModalProps) {
  const [formData, setFormData] = useState<IRedefinirSenhaPayload>({
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: '',
  })

  const [showPassword, setShowPassword] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const senhaAtual = formData.senhaAtual.trim()
    const novaSenha = formData.novaSenha.trim()
    const confirmarNovaSenha = formData.confirmarNovaSenha.trim()

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setErrorMessage('Preencha todos os campos para continuar.')
      return
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErrorMessage('A nova senha e a confirmação não coincidem.')
      return
    }

    setErrorMessage(null)
    onSubmit({ senhaAtual, novaSenha, confirmarNovaSenha })
  }

  return (
    <div className="reset-password-view" role="region" aria-label="Tela de redefinição de senha">
      <header className="reset-password-view__header">
        <button
          type="button"
          className="reset-password-view__back-button"
          onClick={onBack}
          aria-label="Voltar para o perfil"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="reset-password-view__header-text">
          <h2 className="reset-password-view__title">Redefinir senha</h2>
          <p className="reset-password-view__subtitle">Escolha uma combinação segura</p>
        </div>
      </header>

      <div className="reset-password-view__body">
        <form className="reset-password-view__form-card" onSubmit={handleSubmit} noValidate>
          <h3 className="reset-password-view__card-title">Redefina sua senha</h3>

          {errorMessage && (
            <div className="reset-password-view__alert" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="reset-password-view__field">
            <label htmlFor="field-senha-atual" className="reset-password-view__label">
              Senha atual
            </label>
            <div className="reset-password-view__input-wrapper">
              <input
                id="field-senha-atual"
                name="senhaAtual"
                type={showPassword.atual ? 'text' : 'password'}
                placeholder="Insira sua senha atual"
                value={formData.senhaAtual}
                onChange={handleChange}
                className="reset-password-view__input"
                required
              />
              <button
                type="button"
                className="reset-password-view__eye-button"
                onClick={() => setShowPassword((p) => ({ ...p, atual: !p.atual }))}
                aria-label={showPassword.atual ? 'Ocultar senha atual' : 'Mostrar senha atual'}
              >
                {showPassword.atual ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="reset-password-view__field">
            <label htmlFor="field-nova-senha" className="reset-password-view__label">
              Nova senha
            </label>
            <div className="reset-password-view__input-wrapper">
              <input
                id="field-nova-senha"
                name="novaSenha"
                type={showPassword.nova ? 'text' : 'password'}
                placeholder="Insira sua nova senha"
                value={formData.novaSenha}
                onChange={handleChange}
                className="reset-password-view__input"
                required
              />
              <button
                type="button"
                className="reset-password-view__eye-button"
                onClick={() => setShowPassword((p) => ({ ...p, nova: !p.nova }))}
                aria-label={showPassword.nova ? 'Ocultar nova senha' : 'Mostrar nova senha'}
              >
                {showPassword.nova ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="reset-password-view__field">
            <label htmlFor="field-repita-senha" className="reset-password-view__label">
              Repita a senha nova
            </label>
            <div className="reset-password-view__input-wrapper">
              <input
                id="field-repita-senha"
                name="confirmarNovaSenha"
                type={showPassword.confirmar ? 'text' : 'password'}
                placeholder="Confirme sua nova senha"
                value={formData.confirmarNovaSenha}
                onChange={handleChange}
                className="reset-password-view__input"
                required
              />
              <button
                type="button"
                className="reset-password-view__eye-button"
                onClick={() => setShowPassword((p) => ({ ...p, confirmar: !p.confirmar }))}
                aria-label={showPassword.confirmar ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
              >
                {showPassword.confirmar ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="reset-password-view__submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Confirmando...' : 'Confirmar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
