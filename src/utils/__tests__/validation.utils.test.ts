import { describe, expect, it } from 'vitest'
import { validarLogin, validarRedefinirSenha, sanitizeString } from '../validation.utils.ts'

describe('validation.utils', () => {
  it('sanitizeString remove espaços nas extremidades', () => {
    expect(sanitizeString('  usuario_teste   ')).toBe('usuario_teste')
  })

  it('valida credenciais corretas com sucesso', () => {
    const result = validarLogin({
      username: 'Bia.hins',
      password: 'Bia.123',
    })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejeita usuário vazio ou menor que 3 caracteres', () => {
    const result = validarLogin({
      username: 'ab',
      password: '123456',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.username).toBe('O usuário deve ter no mínimo 3 caracteres.')
  })

  it('rejeita senha vazia ou menor que 4 caracteres', () => {
    const result = validarLogin({
      username: 'Bia.hins',
      password: '12',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBe('A senha deve conter no mínimo 4 caracteres.')
  })

  it('valida redefinição de senha com dados corretos', () => {
    const result = validarRedefinirSenha({
      senhaAtual: 'Senha123',
      novaSenha: 'NovaSenha123',
      confirmarNovaSenha: 'NovaSenha123',
    })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejeita redefinição de senha com nova senha menor que 6 caracteres', () => {
    const result = validarRedefinirSenha({
      senhaAtual: 'Senha123',
      novaSenha: '12345',
      confirmarNovaSenha: '12345',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.novaSenha).toBe('A nova senha deve ter no mínimo 6 caracteres.')
  })

  it('rejeita redefinição de senha quando as senhas não coincidem', () => {
    const result = validarRedefinirSenha({
      senhaAtual: 'Senha123',
      novaSenha: 'NovaSenha123',
      confirmarNovaSenha: 'DiferenteSenha123',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.confirmarNovaSenha).toBe('A nova senha e a confirmação não coincidem.')
  })
})
