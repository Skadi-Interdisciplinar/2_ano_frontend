import { describe, it, expect } from 'vitest'
import { extrairInicialPrimeiroNome } from '../name.utils.ts'

describe('extrairInicialPrimeiroNome', () => {
  it('retorna a primeira letra do primeiro nome para nomes compostos', () => {
    expect(extrairInicialPrimeiroNome('Pedro Henrique')).toBe('P')
    expect(extrairInicialPrimeiroNome('Carlos Eduardo')).toBe('C')
    expect(extrairInicialPrimeiroNome('Maria Fernanda da Silva')).toBe('M')
  })

  it('lida com espaços extras antes, depois e entre palavras', () => {
    expect(extrairInicialPrimeiroNome('   ana clara   ')).toBe('A')
    expect(extrairInicialPrimeiroNome('\tjose\talves\n')).toBe('J')
  })

  it('converte para maiúscula se a entrada estiver em minúscula', () => {
    expect(extrairInicialPrimeiroNome('gustavo')).toBe('G')
  })

  it('retorna o fallback quando o nome é vazio, nulo ou indefinido', () => {
    expect(extrairInicialPrimeiroNome('')).toBe('U')
    expect(extrairInicialPrimeiroNome('   ')).toBe('U')
    expect(extrairInicialPrimeiroNome(undefined)).toBe('U')
    expect(extrairInicialPrimeiroNome(undefined, 'P')).toBe('P')
  })
})
