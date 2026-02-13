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
  formatHistoryMessage,
} from '@/lib/utils'

export default function SchoolTicketDetailClient({ ticket: initialTicket }) {
  const router = useRouter()
  const [ticket, setTicket] = useState(initialTicket)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  
  const isOverdue = isTicketOverdue(ticket.validUntil, ticket.status)
  const canProvideFeedback = ticket.status === 'CONCLUIDO_AGUARDANDO_FEEDBACK'

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/escola/dashboard"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Dashboard
        </Link>
      </div>

      {/* Header do chamado */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{getCategoryIcon(ticket.category)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">#{ticket.id.slice(0, 8)}</span>
                  <span className={`status-badge border ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{ticket.title}</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
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
                <span>Criado {getRelativeTime(ticket.createdAt)}</span>
              </div>

              {ticket.assignedTo && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-medium">
                    {ticket.assignedTo.user.name.charAt(0)}
                  </div>
                  <span>Atribuído para {ticket.assignedTo.user.name}</span>
                </div>
              )}
            </div>
          </div>

          {canProvideFeedback && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Enviar Feedback
            </button>
          )}
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
                  Este chamado passou da data de validade ({formatDate(ticket.validUntil, 'dd/MM/yyyy')})
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-600 mb-1">Data de Criação</p>
            <p className="text-sm font-medium text-slate-900">
              {formatDate(ticket.createdAt)}
            </p>
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
              <p className="text-sm font-medium text-slate-900">
                {formatDate(ticket.resolvedAt)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div className="card mb-6">
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

      {/* Feedback (se já foi enviado) */}
      {ticket.feedback && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Seu Feedback</h2>
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
            <span className="text-sm text-slate-600">
              {ticket.feedback.rating}/5 estrelas
            </span>
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
      {ticket.history.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Histórico</h2>
          <div className="space-y-4">
            {ticket.history.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-medium shrink-0">
                    {item.createdBy.charAt(0)}
                  </div>
                  {index < ticket.history.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{item.createdBy}</span>
                    <span className="text-xs text-slate-500">
                      {getRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{formatHistoryMessage(item.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Feedback */}
      {showFeedbackModal && (
        <FeedbackModal
          ticketId={ticket.id}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={(updatedTicket) => {
            setTicket(updatedTicket)
            setShowFeedbackModal(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function FeedbackModal({ ticketId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    finalStatus: 'FINALIZADO',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      setError('Por favor, selecione uma avaliação')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/tickets/${ticketId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar feedback')
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
          <div className="glass rounded-2xl p-8 w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Avaliar Atendimento</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Como você avalia o atendimento? *
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <svg
                        className={`w-12 h-12 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <p className="text-center text-sm text-slate-600 mt-2">
                    {formData.rating === 1 && 'Muito insatisfeito'}
                    {formData.rating === 2 && 'Insatisfeito'}
                    {formData.rating === 3 && 'Regular'}
                    {formData.rating === 4 && 'Satisfeito'}
                    {formData.rating === 5 && 'Muito satisfeito'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="finalStatus" className="block text-sm font-medium text-slate-700 mb-2">
                  Status Final do Chamado *
                </label>
                <select
                  id="finalStatus"
                  required
                  className="input-field"
                  value={formData.finalStatus}
                  onChange={(e) => setFormData({ ...formData, finalStatus: e.target.value })}
                >
                  <option value="FINALIZADO">Problema Resolvido</option>
                  <option value="NAO_RESOLVIDO">Problema Não Resolvido</option>
                  <option value="CANCELADO">Cancelar Chamado</option>
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
                  Comentários (opcional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Conte-nos mais sobre sua experiência..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
                  {loading ? 'Enviando...' : 'Enviar Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
