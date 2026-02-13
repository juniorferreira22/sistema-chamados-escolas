"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboardClient from '../app/admin/dashboard/AdminDashboardClient'
import CreateRegisterClient from '../app/admin/cadastrar/CreateRegisterClient'
import AdminTicketDetailClient from '../app/admin/tickets/[id]/AdminTicketDetailClient'
import TicketCard from './TicketCard'

export default function AdminShell({ user, initialTickets, technicians }) {
  const router = useRouter()
  const [view, setView] = useState('dashboard')
  const [previousView, setPreviousView] = useState('dashboard')
  const [tickets, setTickets] = useState(initialTickets || [])
  const [activeTicket, setActiveTicket] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const openTicket = (ticket, fromView = 'dashboard') => {
    setActiveTicket(ticket)
    setPreviousView(fromView)
    setView('ticket')
  }

  const goBack = () => {
    setView(previousView)
    setActiveTicket(null)
  }

  const getInitials = (name = '') => {
    if (!name) return '?'
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/')
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      setLoggingOut(false)
    }
  }

  

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cadastrar', label: 'Cadastrar' },
    { id: 'tickets', label: 'Tickets' },
  ]

  const renderContent = () => {
    if (view === 'dashboard') {
      return (
        <AdminDashboardClient
          user={user}
          technician={user.technician}
          initialTickets={tickets}
          technicians={technicians}
          onTicketClick={openTicket}
          stats={{
            total: tickets.length,
            abertos: tickets.filter(t => t.status === 'ABERTO').length,
            emAtendimento: tickets.filter(t => t.status === 'EM_ATENDIMENTO').length,
            pendentes: tickets.filter(t => t.status === 'PENDENTE_TERCEIROS').length,
            aguardandoFeedback: tickets.filter(t => t.status === 'CONCLUIDO_AGUARDANDO_FEEDBACK').length,
            atrasados: tickets.filter(t => !['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(t.status) && new Date() > new Date(t.validUntil)).length,
          }}
        />
      )
    }

    if (view === 'cadastrar') {
      return <CreateRegisterClient />
    }

    if (view === 'tickets') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map(t => (
            <div
              key={t.id}
              onClick={() => openTicket(t, 'tickets')}
              className="cursor-pointer transition-transform hover:scale-105"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openTicket(t, 'tickets')}
            >
              <TicketCard ticket={t} isAdmin={true} />
            </div>
          ))}
        </div>
      )
    }

    if (view === 'ticket' && activeTicket) {
      return <AdminTicketDetailClient ticket={activeTicket} technicians={technicians} currentTechnicianId={user.technician?.id} />
    }

    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barra de navegação principal fixo no topo */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logotipo e marca da aplicação */}
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Sistema Chamados</h1>
                <p className="text-xs text-gray-500 leading-none">Gestão de Tickets</p>
              </div>
            </div>

            {/* Menu de navegação do painel (visível só na versão desktop) */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 border-l border-gray-200/50 pl-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setPreviousView(view); setView(item.id); setActiveTicket(null); setMobileMenuOpen(false); }}
                  className={`relative text-sm font-semibold transition-colors duration-200 pb-1 ${
                    view === item.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {view === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Seção da direita: menu mobile e user info */}
          <div className="flex items-center gap-6">
            {/* Botão para abrir menu em dispositivos mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100/80 transition-colors duration-200"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Linha divisória entre menu mobile e info do usuário */}
            <div className="hidden sm:block w-px h-6 bg-gray-200/50" />

            {/* Informações do usuário logado e botão de sair */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Foto de perfil com inicial do nome */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold flex items-center justify-center ring-2 ring-blue-100/50">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden sm:flex flex-col">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{user?.role?.toLowerCase() === 'admin' ? 'Admin' : 'Técnico'}</p>
                </div>
              </div>
              
              {/* Botão para fazer logout (desktop) */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sair da conta"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu de navegação mobile (dropdown com opções) */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setPreviousView(view); setView(item.id); setActiveTicket(null); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    view === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="my-3 border-t border-gray-100" />
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                disabled={loggingOut}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {loggingOut ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Seção principal com conteúdo das páginas */}
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Botão para voltar quando visualizando detalhes de um ticket */}
          {view === 'ticket' && activeTicket && (
            <button
              onClick={goBack}
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 mb-8 px-3 py-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
