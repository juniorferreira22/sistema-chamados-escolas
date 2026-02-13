'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      // Redireciona para o painel correto conforme o tipo de usuário logado
      if (data.user.role === 'SCHOOL') {
        router.push('/escola/dashboard')
      } else if (data.user.role === 'TECHNICIAN') {
        router.push('/admin/dashboard')
      }
      
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      {/* Efeito de fundo com bolas desfocadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 sm:w-72 sm:h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 sm:w-96 sm:h-96 bg-accent-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Título e ícone da aplicação */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Sistema de Chamados
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">Escolas Municipais</p>
        </div>

        {/* Formulário de login */}
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label
                htmlFor="login"
                className="block text-sm font-semibold text-slate-700 mb-2.5"
              >
                Login
              </label>
              <input
                id="login"
                type="text"
                required
                className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                placeholder="Digite seu login"
                value={formData.login}
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2.5"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-field text-base sm:text-sm px-4 py-3 sm:py-3.5 min-h-[44px]"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base animate-scale-in">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base sm:text-sm font-semibold py-3 sm:py-3.5 min-h-[48px] rounded-lg mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-slate-200">
            <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
              Credenciais fornecidas pela Secretaria de Educação de Guariba.
            </p>
          </div>
        </div>

        {/* Informações de contato e suporte */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600 px-2">
          <p className="mb-1">Em caso de problemas com acesso, contate:</p>
          <p className="font-semibold text-primary-600">
            suporteseceducguariba@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
