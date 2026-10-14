import { describe, expect, it, beforeEach } from 'vitest'
import { salvarComVersao, carregarComVersao } from '../storage.utils.ts'

describe('storage.utils (schema versionado)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('salva e recupera dados com o campo _versao correto', () => {
    const dados = { tema: 'escuro', fonte: 'grande' }
    salvarComVersao('teste_chave', dados, 1)

    const recuperado = carregarComVersao('teste_chave', 1, null)
    expect(recuperado).toEqual(dados)
  })

  it('descarta dados legados e retorna fallback quando há incompatibilidade de versão', () => {
    // Salva versão 1
    salvarComVersao('teste_versao', { config: 'antiga' }, 1)

    // Tenta carregar esperando versão 2
    const fallback = { config: 'padrao' }
    const recuperado = carregarComVersao('teste_versao', 2, fallback)

    expect(recuperado).toEqual(fallback)
    // Verifica se o item incompatível foi expurgado do localStorage
    expect(localStorage.getItem('teste_versao')).toBeNull()
  })

  it('retorna fallback se a chave não existir', () => {
    const fallback = { ativo: false }
    const recuperado = carregarComVersao('inexistente', 1, fallback)
    expect(recuperado).toEqual(fallback)
  })
})
