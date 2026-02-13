'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      {/* Header do chamado */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>

      </div>
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
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 group shadow-md"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Enviar Feedback</span>
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
                  className={`w-6 h-6 ${star <= ticket.feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
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
      {ticket?.history?.length > 0 && (
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

// eslint-disable-next-line no-unused-vars
function FeedbackModal({ ticketId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    finalStatus: 'FINALIZADO',
  })
  const [hoveredStar, setHoveredStar] = useState(0)

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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end md:items-center justify-center p-4 md:p-0">
          <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-lg animate-scale-in">
            {/* Se\u00e7\u00e3o de t\u00edtulo e fechamento da janela */}
            <div className="flex items-center justify-between px-6 md:px-8 py-6 md:py-7 border-b border-gray-200">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Avaliar Atendimento</h2>
                <p className="text-sm text-gray-600 mt-1">Sua opinião nos ajuda a melhorar</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo principal do formulário */}
            <div className="px-6 md:px-8 py-8 md:py-10">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seleção de estrelas para avaliação */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Avaliação *
                  </label>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-all duration-200 transform hover:scale-125 active:scale-110"
                      >
                        <svg
                          className={`w-14 h-14 transition-all duration-200 ${star <= (hoveredStar || formData.rating)
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                              : 'text-gray-300 hover:text-yellow-300'
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
                    <div className="text-center mt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {formData.rating === 1 && '😞 Muito insatisfeito'}
                        {formData.rating === 2 && '😟 Insatisfeito'}
                        {formData.rating === 3 && '😐 Regular'}
                        {formData.rating === 4 && '😊 Satisfeito'}
                        {formData.rating === 5 && '😄 Muito satisfeito'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Seleção de classificação final do chamado */}
                <div>
                  <label htmlFor="finalStatus" className="block text-sm font-semibold text-gray-900 mb-3">
                    Status Final do Chamado *
                  </label>
                  <select
                    id="finalStatus"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.finalStatus}
                    onChange={(e) => setFormData({ ...formData, finalStatus: e.target.value })}
                  >
                    <option value="FINALIZADO">✅ Problema Resolvido</option>
                    <option value="NAO_RESOLVIDO">❌ Problema Não Resolvido</option>
                    <option value="CANCELADO">⛔ Cancelar Chamado</option>
                  </select>
                </div>

                {/* Campo para observa\u00e7\u00f5es adicionais */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-3">
                    Comentários <span className="font-normal text-gray-500">(opcional)</span>
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Conte-nos mais sobre sua experiência com o atendimento..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  />
                </div>

                {/* Exib\u00e7\u00e3o de mensagem de erro se houver */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Se\u00e7\u00e3o com bot\u00f5es de a\u00e7\u00e3o (cancelar e enviar) */}
                <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading || formData.rating === 0}
                  >
                    {loading && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>{loading ? 'Enviando...' : 'Enviar Feedback'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
