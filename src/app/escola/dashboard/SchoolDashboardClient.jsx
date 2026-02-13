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
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
          Bem-vindo(a), {user.school?.name || user.name}!
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Gerencie seus chamados de suporte técnico
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { value: stats.total, label: 'Total de Chamados', icon: '📋', color: 'blue' },
          { value: stats.abertos + stats.emAtendimento, label: 'Em Aberto', icon: '⏱️', color: 'yellow' },
          { value: stats.aguardandoFeedback, label: 'Ag. Feedback', icon: '💬', color: 'purple' },
          { value: stats.finalizados, label: 'Finalizados', icon: '✅', color: 'green' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`card bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200 hover:shadow-md transition-all duration-200 p-4 sm:p-5`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-${stat.color}-700 font-semibold mb-1 sm:mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-${stat.color}-900">
                  {stat.value}
                </p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações e filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        {/* Filtros - Mobile scroll */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 w-full sm:w-auto">
          <div className="flex gap-2 sm:flex-wrap flex-shrink-0 sm:flex-shrink">
            {['TODOS', 'ABERTOS', 'AGUARDANDO_FEEDBACK', 'FINALIZADOS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f === 'TODOS' && 'Todos'}
                {f === 'ABERTOS' && 'Em Aberto'}
                {f === 'AGUARDANDO_FEEDBACK' && 'Feedback'}
                {f === 'FINALIZADOS' && 'Finalizados'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2.5 text-sm sm:text-base font-semibold min-h-[44px] sm:min-h-auto rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Chamado</span>
        </button>
      </div>

      {/* Lista de chamados */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Nenhum chamado encontrado</h3>
          <p className="text-sm text-slate-600 mb-6 px-4">
            {filter === 'TODOS' 
              ? 'Você ainda não criou nenhum chamado.'
              : 'Não há chamados com este filtro.'}
          </p>
          {filter === 'TODOS' && (
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="btn-primary mx-auto px-6 py-3 sm:py-2.5 text-sm sm:text-base min-h-[44px] sm:min-h-auto"
            >
              Criar Primeiro Chamado
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Modal para criar um novo chamado */}
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
      <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4">
        <div className="flex min-h-full items-center justify-center">
          <div className="glass rounded-2xl p-6 sm:p-8 w-full max-w-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Novo Chamado</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Fechar"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                  Título do Chamado <span className="text-red-600">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={100}
                  className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                  placeholder="Ex: Computador da sala 5 não liga"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Categoria <span className="text-red-600">*</span>
                </label>
                <select
                  id="category"
                  required
                  className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={loading}
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
                  <label htmlFor="categoryDetail" className="block text-sm font-semibold text-slate-700 mb-2">
                    Detalhe a Categoria <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="categoryDetail"
                    type="text"
                    required
                    className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                    placeholder="Especifique qual tipo de problema"
                    value={formData.categoryDetail}
                    onChange={(e) => setFormData({ ...formData, categoryDetail: e.target.value })}
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 mb-2">
                  Prioridade
                </label>
                <select
                  id="priority"
                  className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  disabled={loading}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="NORMAL">Normal</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                  Descrição do Problema <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 resize-none"
                  placeholder="Descreva detalhadamente o problema encontrado..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 sm:py-3.5 rounded-lg text-sm animate-scale-in">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1 py-3 sm:py-2.5 text-base sm:text-sm font-semibold min-h-[44px] sm:min-h-auto"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-3 sm:py-2.5 text-base sm:text-sm font-semibold min-h-[44px] sm:min-h-auto"
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
