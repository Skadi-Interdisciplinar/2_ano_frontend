import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../config/axiosConnection.ts'
import { DEFAULT_USER_PROFILE, DEFAULT_PROFILE_PREFERENCES } from '../data/profile.ts'
import { getPerfil, atualizarPreferencias, redefinirSenha } from './profile.ts'

vi.mock('../config/axiosConnection.ts', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
  },
}))

describe('profile service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.patch).mockReset()
    vi.mocked(api.put).mockReset()
  })

  describe('getPerfil', () => {
    it('retorna os dados do perfil quando a requisição é bem sucedida', async () => {
      const mockProfile = {
        id: '123',
        nome: 'Pedro Henrique',
        cargo: 'Super Administrador',
        usuario: 'pedhen.8002',
      }
      vi.mocked(api.get).mockResolvedValue({ data: mockProfile })

      const result = await getPerfil()
      expect(result).toEqual(mockProfile)
      expect(api.get).toHaveBeenCalledWith('perfil')
    })

    it('retorna o perfil padrão quando a API falha', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

      const result = await getPerfil()
      expect(result).toEqual(DEFAULT_USER_PROFILE)
    })
  })

  describe('atualizarPreferencias', () => {
    it('atualiza as preferências com sucesso', async () => {
      const novasPrefs = { modoEscuro: true }
      vi.mocked(api.patch).mockResolvedValue({ data: { ...DEFAULT_PROFILE_PREFERENCES, modoEscuro: true } })

      const result = await atualizarPreferencias(novasPrefs)
      expect(result.modoEscuro).toBe(true)
      expect(api.patch).toHaveBeenCalledWith('perfil/preferencias', novasPrefs)
    })

    it('aplica preferências localmente caso a API falhe', async () => {
      vi.mocked(api.patch).mockRejectedValue(new Error('Server error'))

      const result = await atualizarPreferencias({ modoEscuro: true })
      expect(result.modoEscuro).toBe(true)
    })
  })

  describe('redefinirSenha', () => {
    it('valida campos obrigatórios vazios', async () => {
      await expect(
        redefinirSenha({
          senhaAtual: '',
          novaSenha: '123',
          confirmarNovaSenha: '123',
        }),
      ).rejects.toThrow('Preencha todos os campos para continuar.')
    })

    it('valida divergência entre nova senha e confirmação', async () => {
      await expect(
        redefinirSenha({
          senhaAtual: 'senhaAtual123',
          novaSenha: 'novaSenha123',
          confirmarNovaSenha: 'outraSenha123',
        }),
      ).rejects.toThrow('A nova senha e a confirmação não coincidem.')
    })

    it('envia dados para o endpoint e conclui redefinição com sucesso', async () => {
      vi.mocked(api.put).mockResolvedValue({
        data: { message: 'Senha redefinida com sucesso!' },
      })

      const result = await redefinirSenha({
        senhaAtual: 'atual123',
        novaSenha: 'nova12345',
        confirmarNovaSenha: 'nova12345',
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Senha redefinida com sucesso!')
      expect(api.put).toHaveBeenCalledWith('perfil/redefinir-senha', {
        senhaAtual: 'atual123',
        novaSenha: 'nova12345',
        confirmarNovaSenha: 'nova12345',
      })
    })
  })
})
