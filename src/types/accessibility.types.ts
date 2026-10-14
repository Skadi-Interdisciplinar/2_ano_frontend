export interface IAccessibilityPreferences {
  altoContraste: boolean
  textoGrande: boolean
  fonteDislexia: boolean
  sublinharLinks: boolean
}

export const PREFERENCIAS_PADRAO: IAccessibilityPreferences = {
  altoContraste: false,
  textoGrande: false,
  fonteDislexia: false,
  sublinharLinks: false,
}

export interface IVersionedStorage<T> {
  _versao: number
  dados: T
  timestamp: number
}

export type AccessibilityAction =
  | { type: 'TOGGLE_ALTO_CONTRASTE' }
  | { type: 'TOGGLE_TEXTO_GRANDE' }
  | { type: 'TOGGLE_FONTE_DISLEXIA' }
  | { type: 'TOGGLE_SUBLINHAR_LINKS' }
  | { type: 'RESTAURAR_PADRAO' }
  | { type: 'SET_PREFERENCIAS'; payload: IAccessibilityPreferences }

export interface IAccessibilityContext {
  preferences: IAccessibilityPreferences
  isModalOpen: boolean
  abrirModal: () => void
  fecharModal: () => void
  alternarAltoContraste: () => void
  alternarTextoGrande: () => void
  alternarFonteDislexia: () => void
  alternarSublinharLinks: () => void
  restaurarPadrao: () => void
}
