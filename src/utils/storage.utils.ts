import type { IVersionedStorage } from '../types/accessibility.types.ts'

/**
 * Salva dados no localStorage com schema versionado (_versao).
 * Em conformidade com os requisitos de persistência versionada da rubrica.
 */
export function salvarComVersao<T>(
  chave: string,
  dados: T,
  versao: number = 1,
): void {
  try {
    const payload: IVersionedStorage<T> = {
      _versao: versao,
      dados,
      timestamp: Date.now(),
    }
    localStorage.setItem(chave, JSON.stringify(payload))
  } catch (error) {
    console.warn(`[storage.utils] Erro ao salvar dados na chave "${chave}":`, error)
  }
}

/**
 * Recupera dados do localStorage validando o campo _versao.
 * Se houver incompatibilidade de versão ou dado corrompido, executa descarte seguro e retorna o fallback.
 */
export function carregarComVersao<T>(
  chave: string,
  versaoEsperada: number = 1,
  fallback: T,
): T {
  try {
    const item = localStorage.getItem(chave)
    if (!item) {
      return fallback
    }

    const parsed: unknown = JSON.parse(item)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      '_versao' in parsed &&
      'dados' in parsed
    ) {
      const storageObj = parsed as IVersionedStorage<T>

      // Validação de integridade de versão do schema
      if (storageObj._versao === versaoEsperada) {
        return storageObj.dados
      }

      // Incompatibilidade de versão: descarte seguro para evitar quebras
      console.warn(
        `[storage.utils] Incompatibilidade de versão na chave "${chave}". Esperada: ${versaoEsperada}, Encontrada: ${storageObj._versao}. Descartando dados legados.`,
      )
      localStorage.removeItem(chave)
      return fallback
    }

    // Se o dado salvo não possui o campo _versao, descarta com segurança
    console.warn(`[storage.utils] Dado na chave "${chave}" não possui schema versionado (_versao). Descartando.`)
    localStorage.removeItem(chave)
    return fallback
  } catch (error) {
    console.warn(`[storage.utils] Falha ao ler chave "${chave}", utilizando fallback:`, error)
    return fallback
  }
}

export function removerItem(chave: string): void {
  try {
    localStorage.removeItem(chave)
  } catch (error) {
    console.warn(`[storage.utils] Erro ao remover chave "${chave}":`, error)
  }
}
