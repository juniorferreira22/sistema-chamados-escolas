'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TicketCard from '../../../components/TicketCard'
import { isTicketOverdue } from '../../../lib/utils'

export default function AdminDashboardClient({ user, technician, initialTickets, technicians, stats }) {
  const router = useRouter()
  const [tickets, setTickets] = useState(initialTickets)
  const [filter, setFilter] = useState('TODOS')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTickets = tickets.filter(ticket => {
    // Filtro de busca
    const matchesSearch = searchTerm === '' || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Filtros de status
    if (filter === 'TODOS') return true
    if (filter === 'MEUS') return ticket.assignedToId === technician.id
    if (filter === 'NAO_ATRIBUIDOS') return !ticket.assignedToId
    if (filter === 'ATRASADOS') {
      return !['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(ticket.status) &&
        isTicketOverdue(ticket.validUntil, ticket.status)
    }
    if (filter === 'ABERTOS_ATENDIMENTO') {
      return ['ABERTO', 'EM_ATENDIMENTO', 'PENDENTE_TERCEIROS'].includes(ticket.status)
    }
    return ticket.status === filter
  })

  return (
    <>
      {/* Boas-vindas */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
          Bem-vindo(a), {user.name}!
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Gerencie todos os chamados das escolas municipais
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
        {[
          { value: stats.total, label: 'Total', icon: '📋', bg: 'blue' },
          { value: stats.abertos, label: 'Abertos', icon: '📂', bg: 'yellow' },
          { value: stats.emAtendimento, label: 'Em Atend.', icon: '⚙️', bg: 'orange' },
          { value: stats.aguardandoFeedback, label: 'Feedback', icon: '💬', bg: 'purple' },
          { value: stats.pendentes, label: 'Pendentes', icon: '⏳', bg: 'amber' },
          { value: stats.atrasados, label: 'Atrasados', icon: '⚠️', bg: 'red' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`card bg-gradient-to-br from-${stat.bg}-50 to-${stat.bg}-100 border-${stat.bg}-200 p-3 sm:p-4 hover:shadow-md transition-all duration-200`}
          >
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-${stat.bg}-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-${stat.bg}-700 font-medium truncate">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Busca e filtros */}
      <div className="card mb-6 p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-col md:flex-row md:gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar chamados..."
                className="input-field pl-10 text-sm h-10 sm:h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros - Horizontal scroll em mobile */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 md:flex md:flex-wrap md:gap-2">
            <div className="flex gap-2 sm:flex-wrap">
              {['TODOS', 'MEUS', 'NAO_ATRIBUIDOS', 'ATRASADOS', 'ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO_AGUARDANDO_FEEDBACK'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
                    filter === f
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {f === 'TODOS' && 'Todos'}
                  {f === 'MEUS' && 'Meus'}
                  {f === 'NAO_ATRIBUIDOS' && 'N/Atrib'}
                  {f === 'ATRASADOS' && 'Atrasados'}
                  {f === 'ABERTO' && 'Abertos'}
                  {f === 'EM_ATENDIMENTO' && 'Em Atend'}
                  {f === 'CONCLUIDO_AGUARDANDO_FEEDBACK' && 'Ag. Feedback'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Informação do filtro */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs sm:text-sm text-slate-600">
          Mostrando <strong>{filteredTickets.length}</strong> de <strong>{tickets.length}</strong> chamados
        </p>
      </div>

      {/* Lista de chamados */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">Nenhum chamado encontrado</h3>
          <p className="text-sm text-slate-600 px-4">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou filtros.'
              : 'Não há chamados com este filtro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} isAdmin={true} />
          ))}
        </div>
      )}
    </>
  )
}
