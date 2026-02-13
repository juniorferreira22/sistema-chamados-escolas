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
      <div className="group relative bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:border-gray-300 hover:shadow-lg cursor-pointer transition-all duration-300 active:scale-95 sm:active:scale-100 overflow-hidden">
        {/* Se efeito visual ao passar o mouse */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-blue-50/0 transition-all duration-300 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Título e informações principais */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl flex-shrink-0">{getCategoryIcon(ticket.category)}</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #{ticket.id.slice(0, 8)}
                </span>
              </div>
              <h3 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {ticket.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {ticket.description}
              </p>
            </div>
            
            <span className={`status-badge border ${getStatusColor(ticket.status)} shrink-0 text-xs font-semibold py-1.5 px-3 rounded-full whitespace-nowrap`}>
              {getStatusLabel(ticket.status)}
            </span>
          </div>

          {/* Dados complementares como categoria e data */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-max">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="truncate text-gray-600">{getCategoryLabel(ticket.category)}</span>
            </div>

            <div className="flex items-center gap-2 min-w-max">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate text-gray-600">{getRelativeTime(ticket.createdAt)}</span>
            </div>

            {isOverdue && (
              <div className="flex items-center gap-2 text-red-600 font-semibold min-w-max">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm">Atrasado</span>
              </div>
            )}

            {ticket.assignedTo && isAdmin && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0 ring-2 ring-blue-100/50">
                  {ticket.assignedTo.user.name.charAt(0)}
                </div>
                <span className="text-xs sm:text-sm font-medium text-blue-600 truncate">
                  {ticket.assignedTo.user.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Indicador de quantos dias faltam até vencer */}
          {!['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(ticket.status) && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                <span className="font-semibold">Válido até</span>
                <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatDate(ticket.validUntil, 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOverdue ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'
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
      </div>
    </Link>
  )
}
