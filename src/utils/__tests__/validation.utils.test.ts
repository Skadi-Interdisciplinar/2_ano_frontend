import { describe, expect, it } from 'vitest'
import { validarLogin, sanitizeString } from '../validation.utils.ts'

describe('validation.utils', () => {
  it('sanitizeString remove espaços nas extremidades', () => {
    expect(sanitizeString('  usuario_teste   ')).toBe('usuario_teste')
  })

  it('valida credenciais corretas com sucesso', () => {
    const result = validarLogin({
      usuario: 'Bia.hins',
      senha: 'Bia.123',
    })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejeita usuário vazio ou menor que 3 caracteres', () => {
    const result = validarLogin({
      usuario: 'ab',
      senha: '123456',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.usuario).toBe('O usuário deve ter no mínimo 3 caracteres.')
  })

  it('rejeita senha vazia ou menor que 4 caracteres', () => {
    const result = validarLogin({
      usuario: 'Bia.hins',
      senha: '12',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.senha).toBe('A senha deve conter no mínimo 4 caracteres.')
  })
})
