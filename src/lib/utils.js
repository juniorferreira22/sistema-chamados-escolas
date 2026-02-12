import { addDays, isWeekend, format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Calcula a data de validade do chamado (3 dias úteis)
 */
export function calculateValidUntil(startDate = new Date()) {
  let currentDate = new Date(startDate)
  let businessDaysAdded = 0

  while (businessDaysAdded < 3) {
    currentDate = addDays(currentDate, 1)
    
    if (!isWeekend(currentDate)) {
      businessDaysAdded++
    }
  }

  return currentDate
}

/**
 * Formata uma data no padrão brasileiro
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy HH:mm') {
  if (!date) return '-'
  return format(new Date(date), formatStr, { locale: ptBR })
}

/**
 * Retorna tempo relativo (ex: "há 2 horas")
 */
export function getRelativeTime(date) {
  if (!date) return '-'
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: ptBR 
  })
}

/**
 * Retorna a cor do status do chamado
 */
export function getStatusColor(status) {
  const colors = {
    ABERTO: 'bg-blue-100 text-blue-700 border-blue-200',
    EM_ATENDIMENTO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    CONCLUIDO_AGUARDANDO_FEEDBACK: 'bg-purple-100 text-purple-700 border-purple-200',
    PENDENTE_TERCEIROS: 'bg-orange-100 text-orange-700 border-orange-200',
    FINALIZADO: 'bg-green-100 text-green-700 border-green-200',
    CANCELADO: 'bg-gray-100 text-gray-700 border-gray-200',
    NAO_RESOLVIDO: 'bg-red-100 text-red-700 border-red-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Retorna o nome amigável do status
 */
export function getStatusLabel(status) {
  const labels = {
    ABERTO: 'Aberto',
    EM_ATENDIMENTO: 'Em Atendimento',
    CONCLUIDO_AGUARDANDO_FEEDBACK: 'Aguardando Feedback',
    PENDENTE_TERCEIROS: 'Pendente - Terceiros',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado',
    NAO_RESOLVIDO: 'Não Resolvido',
  }
  return labels[status] || status
}

/**
 * Retorna o nome amigável da categoria
 */
export function getCategoryLabel(category) {
  const labels = {
    SOFTWARE: 'Software/Aplicativos',
    HARDWARE: 'Hardware/Componentes',
    OFFICE: 'Pacote Office',
    IMPRESSORA: 'Impressoras',
    REDE: 'Problemas de Rede',
    OUTRO: 'Outro',
  }
  return labels[category] || category
}

/**
 * Retorna ícone da categoria
 */
export function getCategoryIcon(category) {
  const icons = {
    SOFTWARE: '💻',
    HARDWARE: '🔧',
    OFFICE: '📝',
    IMPRESSORA: '🖨️',
    REDE: '🌐',
    OUTRO: '📋',
  }
  return icons[category] || '📋'
}

/**
 * Verifica se o chamado está atrasado
 */
export function isTicketOverdue(validUntil, status) {
  if (['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(status)) {
    return false
  }
  return new Date() > new Date(validUntil)
}
