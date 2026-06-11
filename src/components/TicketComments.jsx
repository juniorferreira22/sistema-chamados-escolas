'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatDate, getRelativeTime } from '@/lib/utils'

export default function TicketComments({ ticket, onCommentsChange, currentUserId, canComment = true }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const comments = [...(ticket.comments || [])].sort(
    (first, second) => new Date(first.createdAt) - new Date(second.createdAt)
  )

  const refreshComments = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setRefreshing(true)
    }

    try {
      const res = await fetch(`/api/tickets/${ticket.id}`)

      if (!res.ok) return

      const data = await res.json()

      onCommentsChange(data.ticket.comments || [])
    } catch (err) {
      console.error('Erro ao atualizar comentários:', err)
    } finally {
      if (showLoading) {
        setRefreshing(false)
      }
    }
  }, [onCommentsChange, ticket.id])

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      refreshComments()
    }, 2500)

    return () => globalThis.clearInterval(intervalId)
  }, [refreshComments])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const message = content.trim()

    if (!message) {
      setError('Digite uma mensagem para enviar')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar comentário')
      }

      setContent('')
      onCommentsChange(data.comments)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Conversa do Chamado</h2>
          <p className="text-sm text-slate-600">Use este espaço para dúvidas, atualizações e o que foi feito.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-3 py-1">
            {comments.length} {comments.length === 1 ? 'mensagem' : 'mensagens'}
          </span>
          <button
            type="button"
            onClick={() => refreshComments(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Atualizar conversa"
          >
            <svg className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5.64 18.36A9 9 0 0018.36 5.64M18.36 5.64H14M18.36 5.64V10M18.36 5.64A9 9 0 005.64 18.36M5.64 18.36H10M5.64 18.36V14" />
            </svg>
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 mb-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-medium text-slate-700">Nenhuma mensagem ainda</p>
            <p className="text-sm text-slate-500 mt-1">O técnico e a escola podem conversar por aqui.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMine = comment.authorId === currentUserId

            return (
              <div key={comment.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  isMine
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${isMine ? 'text-primary-50' : 'text-slate-700'}`}>
                      {comment.author}
                    </span>
                    <span className={`text-[11px] ${isMine ? 'text-primary-100' : 'text-slate-500'}`}>
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                  <p className={`text-[11px] mt-2 ${isMine ? 'text-primary-100' : 'text-slate-500'}`}>
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {canComment && (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            className="input-field resize-none text-sm"
            placeholder="Escreva uma mensagem para a conversa do chamado..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary px-5 py-3 sm:self-end disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}
    </div>
  )
}
