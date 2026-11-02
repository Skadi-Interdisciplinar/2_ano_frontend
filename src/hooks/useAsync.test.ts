import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsync } from './useAsync.ts'

describe('useAsync Hook', () => {
  it('inicializa com estado padrão: data null, isLoading false, error null', () => {
    const fn = vi.fn<() => Promise<string>>().mockResolvedValue('resultado')
    const { result } = renderHook(() => useAsync(fn))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('gerencia transição de loading e atualiza dados com sucesso', async () => {
    const fn = vi.fn<() => Promise<string>>().mockImplementation(
      async () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('dados-carregados'), 20)
        }),
    )

    const { result } = renderHook(() => useAsync(fn))

    let promise: Promise<string | null> | null = null
    act(() => {
      promise = result.current.execute()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()

    await act(async () => {
      await promise
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe('dados-carregados')
    expect(result.current.error).toBeNull()
  })

  it('captura e armazena erro caso a promessa rejeite', async () => {
    const fn = vi.fn<() => Promise<string>>().mockRejectedValue(new Error('Falha no carregamento'))
    const { result } = renderHook(() => useAsync(fn))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Falha no carregamento')
  })

  it('cancela execução ao desmontar via AbortController e evita atualização de estado', async () => {
    let capturedSignal: AbortSignal | null = null

    const fn = vi.fn<(signal: AbortSignal) => Promise<string>>().mockImplementation((signal: AbortSignal) => {
      capturedSignal = signal
      return new Promise<string>((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })

    const { result, unmount } = renderHook(() => useAsync(fn))

    act(() => {
      void result.current.execute()
    })

    expect(capturedSignal).not.toBeNull()
    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(false)

    unmount()

    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(true)
  })

  it('permite redefinir estado através de reset()', async () => {
    const fn = vi.fn<() => Promise<string>>().mockResolvedValue('ok')
    const { result } = renderHook(() => useAsync(fn))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBe('ok')

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })
})
