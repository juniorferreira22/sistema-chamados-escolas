'use client'

import { useState } from 'react'
import TicketCard from '../../../components/TicketCard'
import { isTicketOverdue } from '../../../lib/utils'

export default function AdminDashboardClient({ user, technician, initialTickets, technicians, stats, onTicketClick }) {
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

    // Aplica filtros de status nos tickets
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
      <div className="mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Bem-vindo(a), {user.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-base text-gray-600">
          Gerencie todos os chamados das escolas municipais
        </p>
      </div>

      {/* Card com as estatísticas principais dos tickets */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {[
          { value: stats.total, label: 'Total', icon: '📋', color: 'blue' },
          { value: stats.abertos, label: 'Abertos', icon: '📂', color: 'yellow' },
          { value: stats.emAtendimento, label: 'Em Atend.', icon: '⚙️', color: 'orange' },
          { value: stats.aguardandoFeedback, label: 'Feedback', icon: '💬', color: 'purple' },
          { value: stats.pendentes, label: 'Pendentes', icon: '⏳', color: 'amber' },
          { value: stats.atrasados, label: 'Atrasados', icon: '⚠️', color: 'red' },
        ].map((stat, idx) => {
          const colorClasses = {
            blue: { bg: 'bg-blue-50', border: 'border-blue-100', num: 'text-blue-700', label: 'text-blue-600' },
            yellow: { bg: 'bg-yellow-50', border: 'border-yellow-100', num: 'text-yellow-700', label: 'text-yellow-600' },
            orange: { bg: 'bg-orange-50', border: 'border-orange-100', num: 'text-orange-700', label: 'text-orange-600' },
            purple: { bg: 'bg-purple-50', border: 'border-purple-100', num: 'text-purple-700', label: 'text-purple-600' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-100', num: 'text-amber-700', label: 'text-amber-600' },
            red: { bg: 'bg-red-50', border: 'border-red-100', num: 'text-red-700', label: 'text-red-600' },
          }
          const colors = colorClasses[stat.color]
          
          return (
            <div
              key={idx}
              className={`${colors.bg} border ${colors.border} rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl mb-2">{stat.icon}</span>
                <p className={`${colors.num} text-2xl sm:text-3xl font-bold mb-1`}>
                  {stat.value}
                </p>
                <p className={`${colors.label} text-xs sm:text-sm font-semibold`}>
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Área de busca e filtros de tickets */}
      <div className="mb-8">
        <div className="space-y-4 mb-6">
          {/* Busca */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar chamados, escolas, técnicos..."
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {['TODOS', 'MEUS', 'NAO_ATRIBUIDOS', 'ATRASADOS', 'ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO_AGUARDANDO_FEEDBACK'].map((f) => {
            const labels = {
              'TODOS': 'Todos',
              'MEUS': 'Meus Chamados',
              'NAO_ATRIBUIDOS': 'Não Atribuídos',
              'ATRASADOS': 'Atrasados',
              'ABERTO': 'Abertos',
              'EM_ATENDIMENTO': 'Em Atendimento',
              'CONCLUIDO_AGUARDANDO_FEEDBACK': 'Aguardando Feedback',
            }
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {labels[f]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contagem de resultados */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{filteredTickets.length}</span> de <span className="font-semibold text-gray-900">{tickets.length}</span> chamados
        </p>
      </div>

      {/* Lista de chamados */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Nenhum chamado encontrado</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto px-4">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou filtros.'
              : 'Não há chamados com este filtro. Volte mais tarde.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onTicketClick?.(ticket)}
              className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onTicketClick?.(ticket)}
            >
              <TicketCard ticket={ticket} isAdmin={true} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
