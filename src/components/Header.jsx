'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header({ user, title }) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Marca da aplicação */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-sm">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-bold text-slate-900 truncate">{title}</h1>
              <p className="text-xs text-slate-600 truncate hidden sm:block">{user.name}</p>
            </div>
          </div>

          {/* Opções de navegación (desktop) */}
          <div className="hidden sm:block">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg hover:bg-white/50 transition-all duration-200"
                aria-expanded={showMenu}
                aria-label="Menu do usuário"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <svg
                  className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-scale-in">
                    <div className="p-4 border-b border-slate-100">
                      <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{user.login}</p>
                      <span className="inline-block mt-2 px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        {user.role === 'SCHOOL' ? 'Escola' : 'Técnico'}
                      </span>
                    </div>
                    
                    <div className="p-2">
                      {user.role === 'TECHNICIAN' && (
                        <Link href="/admin/cadastrar">
                          <div className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200 text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cadastrar novo
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Botão para abrir menu em telas pequenas */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/50 transition-all duration-200"
            aria-expanded={showMenu}
            aria-label="Abrir menu"
          >
            <svg
              className={`w-6 h-6 text-slate-600 transition-transform duration-200 ${
                showMenu ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Menu dropdown em dispositivos mobile */}
        {showMenu && (
          <div className="sm:hidden pb-4 border-t border-white/20 mt-3 animate-slide-down">
            <div className="flex items-center gap-3 mb-4 p-3 bg-white/30 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-600 truncate">{user.login}</p>
              </div>
            </div>
            <span className="inline-block px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded mb-3 ml-3">
              {user.role === 'SCHOOL' ? 'Escola' : 'Técnico'}
            </span>
            {user.role === 'TECHNICIAN' && (
              <Link href="/admin/cadastrar">
                <div className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200 text-sm mt-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Cadastrar novo
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm mt-2"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
