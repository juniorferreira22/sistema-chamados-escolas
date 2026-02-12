'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getStatusColor,
  getStatusLabel,
  getCategoryLabel,
  getCategoryIcon,
  formatDate,
  getRelativeTime,
  isTicketOverdue,
} from '@/lib/utils'

export default function AdminTicketDetailClient({ ticket: initialTicket, technicians, currentTechnicianId }) {
  const router = useRouter()
  const [ticket, setTicket] = useState(initialTicket)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const isOverdue = isTicketOverdue(ticket.validUntil, ticket.status)

  const handleAssignTechnician = async (technicianId) => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: technicianId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atribuir técnico')
      }

      setTicket(data.ticket)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignToMe = () => {
    handleAssignTechnician(currentTechnicianId)
  }

  const handleStatusChange = async (newStatus) => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar status')
      }

      setTicket(data.ticket)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header do chamado */}
          <div className="card">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">{getCategoryIcon(ticket.category)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500">#{ticket.id.slice(0, 8)}</span>
                  <span className={`status-badge border ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{ticket.createdBy.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{getCategoryLabel(ticket.category)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{getRelativeTime(ticket.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {isOverdue && !['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(ticket.status) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-900">Chamado Atrasado</p>
                    <p className="text-sm text-red-700">
                      Passou da data de validade em {formatDate(ticket.validUntil, 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-600 mb-1">Criado em</p>
                <p className="text-sm font-medium text-slate-900">{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Válido até</p>
                <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                  {formatDate(ticket.validUntil, 'dd/MM/yyyy')}
                </p>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <p className="text-xs text-slate-600 mb-1">Resolvido em</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(ticket.resolvedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Descrição</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
            
            {ticket.categoryDetail && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Categoria detalhada:</strong> {ticket.categoryDetail}
                </p>
              </div>
            )}
          </div>

          {/* Informações da escola */}
          {ticket.createdBy.school && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informações da Escola</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{ticket.createdBy.school.address}</p>
                    {ticket.createdBy.school.district && (
                      <p className="text-sm text-slate-600">{ticket.createdBy.school.district}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm text-slate-700">{ticket.createdBy.school.phone}</p>
                </div>
                
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-slate-700">{ticket.createdBy.school.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {ticket.feedback && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Feedback da Escola</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= ticket.feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-600">{ticket.feedback.rating}/5 estrelas</span>
              </div>
              {ticket.feedback.comment && (
                <p className="text-slate-700">{ticket.feedback.comment}</p>
              )}
              <p className="text-xs text-slate-500 mt-3">
                Enviado em {formatDate(ticket.feedback.createdAt)}
              </p>
            </div>
          )}

          {/* Histórico */}
          {ticket.history?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Histórico</h2>
              <div className="space-y-4">
                {ticket.history?.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-medium shrink-0">
                        {item.createdBy.charAt(0)}
                      </div>
                      {index < ticket.history?.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{item.createdBy}</span>
                        <span className="text-xs text-slate-500">{getRelativeTime(item.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna lateral - Ações */}
        <div className="space-y-6">
          {/* Atribuição */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4">Atribuição</h3>
            
            {ticket.assignedTo ? (
              <div className="mb-4">
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {ticket.assignedTo.user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{ticket.assignedTo.user.name}</p>
                    <p className="text-sm text-slate-600">Responsável</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-3">Chamado não atribuído</p>
                <button
                  onClick={handleAssignToMe}
                  disabled={loading}
                  className="w-full btn-primary text-sm py-2"
                >
                  Atribuir para Mim
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Atribuir para:
              </label>
              <select
                className="input-field text-sm"
                value={ticket.assignedToId || ''}
                onChange={(e) => handleAssignTechnician(e.target.value || null)}
                disabled={loading}
              >
                <option value="">Sem atribuição</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4">Mudar Status</h3>
            <div className="space-y-2">
              {[
                { value: 'ABERTO', label: 'Aberto', color: 'blue' },
                { value: 'EM_ATENDIMENTO', label: 'Em Atendimento', color: 'yellow' },
                { value: 'CONCLUIDO_AGUARDANDO_FEEDBACK', label: 'Aguardando Feedback', color: 'purple' },
                { value: 'PENDENTE_TERCEIROS', label: 'Pendente - Terceiros', color: 'orange' },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={loading || ticket.status === status.value}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    ticket.status === status.value
                      ? `bg-${status.color}-100 text-${status.color}-700 border-2 border-${status.color}-300`
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="card bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-3">Informações</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Prioridade</span>
                <span className="font-medium text-slate-900">{ticket.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tempo em aberto</span>
                <span className="font-medium text-slate-900">
                  {getRelativeTime(ticket.createdAt).replace('há ', '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
