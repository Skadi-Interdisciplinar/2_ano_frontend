import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import {
  PREFERENCIAS_PADRAO,
  type AccessibilityAction,
  type IAccessibilityContext,
  type IAccessibilityPreferences,
} from '../types/accessibility.types.ts'
import { carregarComVersao, salvarComVersao } from '../utils/storage.utils.ts'

const STORAGE_KEY = 'skadi_a11y_prefs'
const SCHEMA_VERSAO = 1

export { PREFERENCIAS_PADRAO }

/**
 * useReducer com State e Action tipados em union types.
 * Centraliza e resolve a complexidade de transições de estado das configurações de acessibilidade.
 */
function accessibilityReducer(
  state: IAccessibilityPreferences,
  action: AccessibilityAction,
): IAccessibilityPreferences {
  switch (action.type) {
    case 'TOGGLE_ALTO_CONTRASTE':
      return { ...state, altoContraste: !state.altoContraste }

    case 'TOGGLE_TEXTO_GRANDE':
      return { ...state, textoGrande: !state.textoGrande }

    case 'TOGGLE_FONTE_DISLEXIA':
      return { ...state, fonteDislexia: !state.fonteDislexia }

    case 'TOGGLE_SUBLINHAR_LINKS':
      return { ...state, sublinharLinks: !state.sublinharLinks }

    case 'RESTAURAR_PADRAO':
      return { ...PREFERENCIAS_PADRAO }

    case 'SET_PREFERENCIAS':
      return { ...action.payload }

    default:
      return state
  }
}

const AccessibilityContext = createContext<IAccessibilityContext | null>(null)

export interface IAccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: IAccessibilityProviderProps) {
  // Carrega configurações persistidas com schema versionado
  const [preferences, dispatch] = useReducer(
    accessibilityReducer,
    PREFERENCIAS_PADRAO,
    () => carregarComVersao<IAccessibilityPreferences>(STORAGE_KEY, SCHEMA_VERSAO, PREFERENCIAS_PADRAO),
  )

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Persiste sempre que houver alteração usando schema versionado (_versao) e chaves padrão a11y
  useEffect(() => {
    salvarComVersao(STORAGE_KEY, preferences, SCHEMA_VERSAO)

    // Persistência compatível com padrão a11y do repositório de referência
    localStorage.setItem('a11y_contraste', String(preferences.altoContraste))
    localStorage.setItem('a11y_texto', String(preferences.textoGrande))
    localStorage.setItem('a11y_dislexia', String(preferences.fonteDislexia))
    localStorage.setItem('a11y_links', String(preferences.sublinharLinks))

    // Aplica classes de acessibilidade globalmente no DOM (documentElement e body)
    const root = document.documentElement
    const body = document.body

    root.classList.toggle('a11y-high-contrast', preferences.altoContraste)
    root.classList.toggle('modo-alto-contraste', preferences.altoContraste)
    body.classList.toggle('modo-alto-contraste', preferences.altoContraste)

    root.classList.toggle('a11y-large-text', preferences.textoGrande)
    root.classList.toggle('modo-texto-grande', preferences.textoGrande)
    body.classList.toggle('modo-texto-grande', preferences.textoGrande)

    root.classList.toggle('a11y-dyslexic-font', preferences.fonteDislexia)
    root.classList.toggle('modo-dislexia', preferences.fonteDislexia)
    body.classList.toggle('modo-dislexia', preferences.fonteDislexia)

    root.classList.toggle('a11y-underline-links', preferences.sublinharLinks)
    root.classList.toggle('modo-sublinhar', preferences.sublinharLinks)
    body.classList.toggle('modo-sublinhar', preferences.sublinharLinks)
  }, [preferences])

  const abrirModal = useCallback(() => setIsModalOpen(true), [])
  const fecharModal = useCallback(() => setIsModalOpen(false), [])

  const alternarAltoContraste = useCallback(
    () => dispatch({ type: 'TOGGLE_ALTO_CONTRASTE' }),
    [],
  )

  const alternarTextoGrande = useCallback(
    () => dispatch({ type: 'TOGGLE_TEXTO_GRANDE' }),
    [],
  )

  const alternarFonteDislexia = useCallback(
    () => dispatch({ type: 'TOGGLE_FONTE_DISLEXIA' }),
    [],
  )

  const alternarSublinharLinks = useCallback(
    () => dispatch({ type: 'TOGGLE_SUBLINHAR_LINKS' }),
    [],
  )

  const restaurarPadrao = useCallback(
    () => dispatch({ type: 'RESTAURAR_PADRAO' }),
    [],
  )

  // useMemo para evitar renderizações desnecessárias de consumidores do contexto
  const value = useMemo<IAccessibilityContext>(
    () => ({
      preferences,
      isModalOpen,
      abrirModal,
      fecharModal,
      alternarAltoContraste,
      alternarTextoGrande,
      alternarFonteDislexia,
      alternarSublinharLinks,
      restaurarPadrao,
    }),
    [
      preferences,
      isModalOpen,
      abrirModal,
      fecharModal,
      alternarAltoContraste,
      alternarTextoGrande,
      alternarFonteDislexia,
      alternarSublinharLinks,
      restaurarPadrao,
    ],
  )

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility(): IAccessibilityContext {
  const context = useContext(AccessibilityContext)
  if (!context) {
    return {
      preferences: PREFERENCIAS_PADRAO,
      isModalOpen: false,
      abrirModal: () => {},
      fecharModal: () => {},
      alternarAltoContraste: () => {},
      alternarTextoGrande: () => {},
      alternarFonteDislexia: () => {},
      alternarSublinharLinks: () => {},
      restaurarPadrao: () => {},
    }
  }
  return context
}
