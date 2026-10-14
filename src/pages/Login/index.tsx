import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowBackIosNew as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import type { ILoginCredentials } from '../../types/auth.types.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { validarLogin } from '../../utils/validation.utils.ts'
import { AccessibilityButton } from '../../components/AccessibilityButton/index.tsx'
import { AccessibilityModal } from '../../components/AccessibilityModal/index.tsx'
import { LoadingSpinner } from '../../components/LoadingSpinner/index.tsx'
import { ErrorMessage } from '../../components/ErrorMessage/index.tsx'
import skadiLogoWhite from '../../assets/skadi-logo-white.png'
import './styles.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  // Requisito 6: Estado local gerenciado com useState, campos relacionados agrupados em um único objeto
  const [credentials, setCredentials] = useState<ILoginCredentials>({
    usuario: '',
    senha: '',
    lembreMe: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ILoginCredentials, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleInputChange = (field: keyof ILoginCredentials, value: string | boolean) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
    if (serverError) {
      setServerError(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)

    // Requisito 22: Nenhum dado enviado ao serviço sem passar por função de validação tipada em src/utils/
    const validation = validarLogin(credentials)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      const success = await login(credentials)
      if (success) {
        navigate('/home', { replace: true })
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Credenciais inválidas. Verifique seu usuário e senha.'
      setServerError(message)
    }
  }

  return (
    <div className="login-page-container">
      {/* Botão Voltar */}
      <button
        type="button"
        className="login-back-button"
        onClick={() => navigate(-1)}
        aria-label="Voltar para a página anterior"
      >
        <ArrowBackIcon fontSize="small" />
      </button>

      <div className="login-content-wrapper">
        {/* Lado Esquerdo: Lobo Branco Skadi */}
        <div className="login-hero-side">
          <img
            src={skadiLogoWhite}
            alt="Logo Skadi - Lobo estilizado"
            className="login-hero-logo"
          />
        </div>

        {/* Lado Direito: Card de Login */}
        <div className="login-card-side">
          <main className="login-card">
            <header className="login-card-header">
              <h1 className="login-brand-title">S K A D I</h1>
              <p className="login-brand-subtitle">Área restrita</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Feedback de erro geral no DOM com role="alert" */}
              <ErrorMessage message={serverError} />

              {/* Campo Usuário */}
              <div className="login-field-group">
                <label htmlFor="login-usuario" className="login-label">
                  Usuário
                </label>
                <div className="login-input-wrapper">
                  <input
                    id="login-usuario"
                    name="usuario"
                    type="text"
                    className="login-input"
                    placeholder="Bia.hins"
                    value={credentials.usuario}
                    onChange={(e) => handleInputChange('usuario', e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors.usuario)}
                    aria-describedby={errors.usuario ? 'usuario-error' : undefined}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                {errors.usuario ? (
                  <span id="usuario-error" className="login-field-error" role="alert">
                    {errors.usuario}
                  </span>
                ) : null}
              </div>

              {/* Campo Senha */}
              <div className="login-field-group">
                <label htmlFor="login-senha" className="login-label">
                  Senha
                </label>
                <div className="login-input-wrapper">
                  <input
                    id="login-senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Bia.123"
                    value={credentials.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors.senha)}
                    aria-describedby={errors.senha ? 'senha-error' : undefined}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {errors.senha ? (
                  <span id="senha-error" className="login-field-error" role="alert">
                    {errors.senha}
                  </span>
                ) : null}
              </div>

              {/* Lembre-se de mim */}
              <div className="login-options-row">
                <label className="login-remember-label" htmlFor="login-lembrete">
                  <input
                    id="login-lembrete"
                    type="checkbox"
                    className="login-checkbox"
                    checked={credentials.lembreMe ?? false}
                    onChange={(e) => handleInputChange('lembreMe', e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Lembre-se de mim</span>
                </label>
              </div>

              {/* Botão Entrar ou Spinner */}
              {isLoading ? (
                <LoadingSpinner label="Autenticando..." />
              ) : (
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={isLoading}
                >
                  Entrar
                </button>
              )}
            </form>
          </main>
        </div>
      </div>

      {/* Botão e Modal de Acessibilidade */}
      <AccessibilityButton />
      <AccessibilityModal />
    </div>
  )
}
