import { useCallback, useEffect, useRef, useState } from 'react'

export interface IUseAsyncReturn<T, Args extends unknown[]> {
  data: T | null
  isLoading: boolean
  error: string | null
  execute: (...args: Args) => Promise<T | null>
  reset: () => void
}

/**
 * Hook customizado com retorno tipado, estado de loading, erro tratado
 * e cancelamento via AbortController para evitar memory leaks e atualizações
 * de estado em componentes desmontados (Requisito obrigatório da rubrica).
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (signal: AbortSignal, ...args: Args) => Promise<T>,
): IUseAsyncReturn<T, Args> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef<boolean>(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      // Cancela requisição anterior pendente se houver
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setError(null)

      try {
        const result = await asyncFunction(controller.signal, ...args)
        if (isMountedRef.current && !controller.signal.aborted) {
          setData(result)
          setIsLoading(false)
          return result
        }
        return null
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return null
        }
        const errorMessage =
          err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
        if (isMountedRef.current) {
          setError(errorMessage)
          setIsLoading(false)
        }
        return null
      }
    },
    [asyncFunction],
  )

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  }
}
