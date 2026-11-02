import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../config/axiosConnection.ts'
import { mensagemDaApi } from './employees.ts'
import {
  abrirChamado,
  alterarStatusChamado,
  buscarChamado,
  editarChamado,
  excluirChamado,
  listarChamados,
} from './support.ts'

vi.mock('../config/axiosConnection.ts', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const chamado = {
  id: 1,
  codUsuarioSolicitante: 4,
  categoria: 'DUVIDA' as const,
  descricao: 'Não consigo abrir o relatório.',
  status: 'REGISTRADO' as const,
  dataHoraAbertura: '2026-10-29T08:25:00',
  dataHoraEncerramento: null,
  resposta: null,
  codUsuarioResponsavel: null,
}

describe('support service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.put).mockReset()
    vi.mocked(api.patch).mockReset()
    vi.mocked(api.delete).mockReset()
  })

  it('abre um chamado só com categoria e descrição', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: chamado })
    const corpo = { categoria: 'DUVIDA' as const, descricao: 'Não consigo abrir o relatório.' }

    await expect(abrirChamado(corpo)).resolves.toEqual(chamado)
    expect(api.post).toHaveBeenCalledWith('/support', corpo)
  })

  it('lista todos os chamados do super admin', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [chamado] })

    await expect(listarChamados()).resolves.toEqual([chamado])
    expect(api.get).toHaveBeenCalledWith('/super_admin/support')
  })

  it('busca um chamado pelo id', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: chamado })

    await expect(buscarChamado(1)).resolves.toEqual(chamado)
    expect(api.get).toHaveBeenCalledWith('/super_admin/support/1')
  })

  it('edita só categoria, descrição e resposta', async () => {
    const corpo = {
      categoria: 'RECLAMACAO' as const,
      descricao: 'O relatório continua indisponível.',
      resposta: 'Estamos verificando.',
    }
    vi.mocked(api.put).mockResolvedValue({ data: { ...chamado, ...corpo } })

    await editarChamado(1, corpo)
    expect(api.put).toHaveBeenCalledWith('/super_admin/support/1', corpo)
  })

  it('altera o status em uma chamada separada', async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: { ...chamado, status: 'ATENDIDO' } })

    await alterarStatusChamado(1, 'ATENDIDO')
    expect(api.patch).toHaveBeenCalledWith('/super_admin/support/1/status', { status: 'ATENDIDO' })
  })

  it('exclui um chamado pelo id', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: '' })

    await excluirChamado(1)
    expect(api.delete).toHaveBeenCalledWith('/super_admin/support/1')
  })
})

describe('mensagemDaApi', () => {
  it('usa a message da API e um texto fixo quando o corpo vem vazio', () => {
    const comMensagem = new axios.AxiosError('Request failed')
    comMensagem.response = {
      data: { message: 'categoria: A categoria é obrigatória' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    }
    expect(mensagemDaApi(comMensagem, 'fallback')).toBe('categoria: A categoria é obrigatória')

    const semCorpo = new axios.AxiosError('Request failed')
    semCorpo.response = {
      data: undefined,
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    }
    expect(mensagemDaApi(semCorpo, 'fallback')).toBe('Não autenticado.')

    semCorpo.response.status = 403
    expect(mensagemDaApi(semCorpo, 'fallback')).toBe('Acesso negado.')
  })
})
