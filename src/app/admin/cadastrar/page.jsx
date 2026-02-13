import CreateRegisterClient from './CreateRegisterClient'

export const metadata = {
  title: 'Cadastrar novo',
}

export default function CadastrarPage() {
  return (
    <main className="max-w-3xl mx-auto p-0">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Cadastrar novo</h2>
        <p className="text-base text-gray-600">Adicione um Usuário, Técnico ou Escola ao sistema</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Formulário de cadastro</h3>
        <p className="text-sm text-gray-500 mb-6">Preencha os dados abaixo e clique em Cadastrar</p>
        <CreateRegisterClient />
      </div>
    </main>
  )
}
