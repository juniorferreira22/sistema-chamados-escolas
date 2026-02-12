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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Bem-vindo(a), {user.name}!
        </h2>
        <p className="text-slate-600">
          Gerencie todos os chamados das escolas municipais
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-900 mb-1">{stats.total}</p>
            <p className="text-xs text-blue-700 font-medium">Total</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-900 mb-1">{stats.abertos}</p>
            <p className="text-xs text-yellow-700 font-medium">Abertos</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-900 mb-1">{stats.emAtendimento}</p>
            <p className="text-xs text-orange-700 font-medium">Em Atendimento</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-900 mb-1">{stats.aguardandoFeedback}</p>
            <p className="text-xs text-purple-700 font-medium">Ag. Feedback</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-900 mb-1">{stats.pendentes}</p>
            <p className="text-xs text-amber-700 font-medium">Pendentes</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-900 mb-1">{stats.atrasados}</p>
            <p className="text-xs text-red-700 font-medium">Atrasados</p>
          </div>
        </div>
      </div>

      {/* Busca e filtros */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar chamados..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'MEUS', 'NAO_ATRIBUIDOS', 'ATRASADOS', 'ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO_AGUARDANDO_FEEDBACK'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f === 'TODOS' && 'Todos'}
                {f === 'MEUS' && 'Meus'}
                {f === 'NAO_ATRIBUIDOS' && 'Não Atribuídos'}
                {f === 'ATRASADOS' && 'Atrasados'}
                {f === 'ABERTO' && 'Abertos'}
                {f === 'EM_ATENDIMENTO' && 'Em Atendimento'}
                {f === 'CONCLUIDO_AGUARDANDO_FEEDBACK' && 'Ag. Feedback'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Informação do filtro */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-600">
          Mostrando <strong>{filteredTickets.length}</strong> de <strong>{tickets.length}</strong> chamados
        </p>
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
          <p className="text-slate-600">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou filtros.'
              : 'Não há chamados com este filtro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} isAdmin={true} />
          ))}
        </div>
      )}
    </>
  )
}
