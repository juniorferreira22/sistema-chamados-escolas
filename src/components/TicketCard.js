'use client'

import Link from 'next/link'
import { 
  getStatusColor, 
  getStatusLabel, 
  getCategoryLabel, 
  getCategoryIcon,
  formatDate,
  getRelativeTime,
  isTicketOverdue 
} from '../lib/utils'

export default function TicketCard({ ticket, isAdmin = false }) {
  const isOverdue = isTicketOverdue(ticket.validUntil, ticket.status)
  const baseUrl = isAdmin ? '/admin' : '/escola'

  return (
    <Link href={`${baseUrl}/tickets/${ticket.id}`}>
      <div className="card hover:border-primary-300 cursor-pointer group">
        {/* Header do card */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
              <span className="text-xs text-slate-500">#{ticket.id.slice(0, 8)}</span>
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              {ticket.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {ticket.description}
            </p>
          </div>
          
          <span className={`status-badge border ${getStatusColor(ticket.status)} shrink-0`}>
            {getStatusLabel(ticket.status)}
          </span>
        </div>

        {/* Informações adicionais */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs">{getCategoryLabel(ticket.category)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">{getRelativeTime(ticket.createdAt)}</span>
          </div>

          {isOverdue && (
            <div className="flex items-center gap-1.5 text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-medium">Atrasado</span>
            </div>
          )}

          {ticket.assignedTo && isAdmin && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-medium">
                {ticket.assignedTo.user.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-primary-700">
                {ticket.assignedTo.user.name.split(' ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Barra de progresso de validade */}
        {!['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(ticket.status) && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Válido até</span>
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {formatDate(ticket.validUntil, 'dd/MM/yyyy')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isOverdue ? 'bg-red-500' : 'bg-primary-500'
                }`}
                style={{
                  width: isOverdue ? '100%' : `${Math.min(
                    ((new Date() - new Date(ticket.createdAt)) / 
                    (new Date(ticket.validUntil) - new Date(ticket.createdAt))) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
