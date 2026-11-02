import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.tsx'
import type { Chamado } from '../../data/support.ts'
import {
  abrirChamado,
  alterarStatusChamado,
  buscarChamado,
  editarChamado,
  listarChamados,
} from '../../service/support.ts'
import { SupportScreen } from './SupportScreen.tsx'

vi.mock('../../contexts/AuthContext.tsx', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../service/support.ts', () => ({
  abrirChamado: vi.fn(),
  listarChamados: vi.fn(async () => []),
  buscarChamado: vi.fn(),
  editarChamado: vi.fn(),
  alterarStatusChamado: vi.fn(),
  excluirChamado: vi.fn(),
}))

vi.mock('../../service/employees.ts', () => ({
  mensagemDaApi: (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback,
}))

const chamado: Chamado = {
  id: 1,
  codUsuarioSolicitante: 4,
  categoria: 'DUVIDA',
  descricao: 'Não consigo abrir o relatório.',
  status: 'REGISTRADO',
  dataHoraAbertura: '2026-10-29T08:25:00',
  dataHoraEncerramento: null,
  resposta: null,
  codUsuarioResponsavel: null,
}

function renderScreen() {
  return render(
    <MemoryRouter>
      <SupportScreen />
    </MemoryRouter>,
  )
}

describe('SupportScreen', () => {
  beforeEach(() => {
    vi.mocked(listarChamados).mockReset()
    vi.mocked(listarChamados).mockResolvedValue([])
    vi.mocked(abrirChamado).mockReset()
    vi.mocked(buscarChamado).mockReset()
    vi.mocked(editarChamado).mockReset()
    vi.mocked(alterarStatusChamado).mockReset()
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', nome: 'Enzo', usuario: 'enzo', cargo: 'SUPER_ADMIN' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('fica vazia quando a API não devolve chamados', async () => {
    renderScreen()

    await waitFor(() => expect(listarChamados).toHaveBeenCalled())
    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.getByText('0 - 0 of 0')).toBeTruthy()
  })

  it('mostra a tabela quando o login não traz cargo e a listagem responde', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '11', nome: 'usuario11', usuario: 'usuario11' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listarChamados).mockResolvedValue([chamado])
    renderScreen()

    expect(await screen.findByText('0 - 1 of 1')).toBeTruthy()
    expect(screen.queryByRole('article', { name: 'Chamado aberto' })).toBeNull()
  })

  it('recarrega a tabela depois de abrir um chamado', async () => {
    vi.mocked(abrirChamado).mockResolvedValue(chamado)
    vi.mocked(listarChamados).mockResolvedValueOnce([]).mockResolvedValueOnce([chamado])
    renderScreen()

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar chamado' }))
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Não consigo abrir o relatório.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() =>
      expect(abrirChamado).toHaveBeenCalledWith({
        categoria: 'DUVIDA',
        descricao: 'Não consigo abrir o relatório.',
      }),
    )
    expect(await screen.findByText('Não consigo abrir o relatório.')).toBeTruthy()
    expect(screen.queryByRole('article', { name: 'Chamado aberto' })).toBeNull()
    expect(screen.getByText('0 - 1 of 1')).toBeTruthy()
  })

  it('chama o patch ao trocar o status', async () => {
    vi.mocked(listarChamados).mockResolvedValue([chamado])
    vi.mocked(alterarStatusChamado).mockResolvedValue({ ...chamado, status: 'ATENDIDO' })
    renderScreen()

    fireEvent.change(await screen.findByLabelText('Status do chamado 1'), { target: { value: 'ATENDIDO' } })

    await waitFor(() => expect(alterarStatusChamado).toHaveBeenCalledWith(1, 'ATENDIDO'))
  })

  it('confirma a edição sem enviar o status', async () => {
    vi.mocked(listarChamados).mockResolvedValue([chamado])
    vi.mocked(buscarChamado).mockResolvedValue(chamado)
    vi.mocked(editarChamado).mockResolvedValue({
      ...chamado,
      categoria: 'RECLAMACAO',
      descricao: 'O relatório continua indisponível.',
      resposta: 'Estamos verificando.',
    })
    renderScreen()

    fireEvent.click(await screen.findByRole('button', { name: 'Editar chamado 1' }))
    fireEvent.change(await screen.findByLabelText('Descrição'), {
      target: { value: 'O relatório continua indisponível.' },
    })
    fireEvent.change(screen.getByLabelText('Resposta'), { target: { value: 'Estamos verificando.' } })
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'RECLAMACAO' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() =>
      expect(editarChamado).toHaveBeenCalledWith(1, {
        categoria: 'RECLAMACAO',
        descricao: 'O relatório continua indisponível.',
        resposta: 'Estamos verificando.',
      }),
    )
    expect(alterarStatusChamado).not.toHaveBeenCalled()
  })

  it('mostra a message da API no formulário', async () => {
    vi.mocked(abrirChamado).mockRejectedValue(new Error('O chamado deve ser aberto com o status REGISTRADO'))
    renderScreen()

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar chamado' }))
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Texto' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(await screen.findByText('O chamado deve ser aberto com o status REGISTRADO')).toBeTruthy()
  })
})
