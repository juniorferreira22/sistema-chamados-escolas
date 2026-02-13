"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRegisterClient() {
  const router = useRouter()
  const [type, setType] = useState('user')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('SCHOOL')
  const [extra, setExtra] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, login, password, name, role, extra }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro' })
      } else {
        setMessage({ type: 'success', text: 'Cadastro realizadocom sucesso' })
        // Limpar os campos do formul\u00e1rio
        setLogin('')
        setPassword('')
        setName('')
        setExtra({})
        // Atualizar a tela com os novos dados
        router.refresh()
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao contatar servidor' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">Tipo de conta</label>
        <div className="inline-flex rounded-lg bg-gray-100 p-1 gap-1">
          <button type="button" onClick={() => setType('user')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>Usuário</button>
          <button type="button" onClick={() => setType('technician')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'technician' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>Técnico</button>
          <button type="button" onClick={() => setType('school')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'school' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>Escola</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Login</label>
          <input required value={login} onChange={(e) => setLogin(e.target.value)} placeholder="nome.usuario" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Senha</label>
          <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Nome</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        </div>
      </div>

      {type === 'user' && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Papel</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <option value="SCHOOL">Escola</option>
            <option value="TECHNICIAN">Técnico</option>
          </select>
        </div>
      )}

      {type === 'technician' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Cargo / Função</label>
            <input value={extra.occupation || ''} onChange={(e) => setExtra({ ...extra, occupation: e.target.value })} placeholder="Ex: Suporte TI" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Telefone</label>
            <input value={extra.phone || ''} onChange={(e) => setExtra({ ...extra, phone: e.target.value })} placeholder="(00) 00000-0000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
            <input value={extra.email || ''} onChange={(e) => setExtra({ ...extra, email: e.target.value })} placeholder="email@exemplo.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
        </div>
      )}

      {type === 'school' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Endereço</label>
            <input value={extra.address || ''} onChange={(e) => setExtra({ ...extra, address: e.target.value })} placeholder="Rua, número, bairro" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Telefone</label>
            <input value={extra.phone || ''} onChange={(e) => setExtra({ ...extra, phone: e.target.value })} placeholder="(00) 00000-0000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
            <input value={extra.email || ''} onChange={(e) => setExtra({ ...extra, email: e.target.value })} placeholder="contato@escola.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Distrito / Região</label>
            <input value={extra.district || ''} onChange={(e) => setExtra({ ...extra, district: e.target.value })} placeholder="Distrito" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">INEP</label>
            <input value={extra.inep || ''} onChange={(e) => setExtra({ ...extra, inep: e.target.value })} placeholder="Código INEP" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-gray-500">Campos com * são obrigatórios</div>
        <div className="flex gap-3">
          <button type="button" onClick={() => { setLogin(''); setPassword(''); setName(''); setExtra({}); setMessage(null); }} className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors">
            Limpar
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Enviando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </form>
  )
}
