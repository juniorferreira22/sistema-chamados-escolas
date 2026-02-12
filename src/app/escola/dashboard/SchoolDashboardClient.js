'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TicketCard from '@/components/TicketCard'

export default function SchoolDashboardClient({ user, initialTickets, stats }) {
  const router = useRouter()
  const [tickets, setTickets] = useState(initialTickets)
  const [filter, setFilter] = useState('TODOS')
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'TODOS') return true
    if (filter === 'ABERTOS') return ['ABERTO', 'EM_ATENDIMENTO', 'PENDENTE_TERCEIROS'].includes(ticket.status)
    if (filter === 'AGUARDANDO_FEEDBACK') return ticket.status === 'CONCLUIDO_AGUARDANDO_FEEDBACK'
    if (filter === 'FINALIZADOS') return ['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(ticket.status)
    return ticket.status === filter
  })

  return (
    <>
      {/* Boas-vindas e estatísticas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Bem-vindo(a), {user.school?.address?.split(',')[0] || user.name}!
        </h2>
        <p className="text-slate-600">
          Gerencie seus chamados de suporte técnico
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Total de Chamados</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium mb-1">Em Aberto</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.abertos + stats.emAtendimento}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium mb-1">Aguardando Feedback</p>
              <p className="text-3xl font-bold text-purple-900">{stats.aguardandoFeedback}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium mb-1">Finalizados</p>
              <p className="text-3xl font-bold text-green-900">{stats.finalizados}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ações e filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['TODOS', 'ABERTOS', 'AGUARDANDO_FEEDBACK', 'FINALIZADOS'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f === 'TODOS' && 'Todos'}
              {f === 'ABERTOS' && 'Em Aberto'}
              {f === 'AGUARDANDO_FEEDBACK' && 'Aguardando Feedback'}
              {f === 'FINALIZADOS' && 'Finalizados'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Chamado
        </button>
      </div>

      {/* Lista de chamados */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum chamado encontrado</h3>
          <p className="text-slate-600 mb-6">
            {filter === 'TODOS' 
              ? 'Você ainda não criou nenhum chamado.'
              : 'Não há chamados com este filtro.'}
          </p>
          {filter === 'TODOS' && (
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="btn-primary"
            >
              Criar Primeiro Chamado
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Modal de novo chamado */}
      {showNewTicketModal && (
        <NewTicketModal
          onClose={() => setShowNewTicketModal(false)}
          onSuccess={(newTicket) => {
            setTickets([newTicket, ...tickets])
            setShowNewTicketModal(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function NewTicketModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    categoryDetail: '',
    priority: 'NORMAL',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar chamado')
      }

      onSuccess(data.ticket)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 w-full max-w-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Novo Chamado</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Título do Chamado *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={100}
                  className="input-field"
                  placeholder="Ex: Computador da sala 5 não liga"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria *
                </label>
                <select
                  id="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="SOFTWARE">Problemas com aplicativos ou sistemas (software)</option>
                  <option value="HARDWARE">Problemas com componentes de computadores (hardware)</option>
                  <option value="OFFICE">Problemas com pacote Office</option>
                  <option value="IMPRESSORA">Problemas com impressoras</option>
                  <option value="REDE">Problemas de rede</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              {formData.category === 'OUTRO' && (
                <div>
                  <label htmlFor="categoryDetail" className="block text-sm font-medium text-slate-700 mb-2">
                    Detalhe a Categoria *
                  </label>
                  <input
                    id="categoryDetail"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Especifique qual tipo de problema"
                    value={formData.categoryDetail}
                    onChange={(e) => setFormData({ ...formData, categoryDetail: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                  Prioridade
                </label>
                <select
                  id="priority"
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="NORMAL">Normal</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição do Problema *
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Descreva detalhadamente o problema encontrado..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Chamado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
