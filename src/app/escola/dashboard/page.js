import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Header from '@/components/Header'
import SchoolDashboardClient from './SchoolDashboardClient'

export default async function SchoolDashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  if (session.role !== 'SCHOOL') {
    redirect('/admin/dashboard')
  }

  // Buscar dados do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      school: true,
    },
  })

  // Buscar tickets da escola
  const tickets = await prisma.ticket.findMany({
    where: {
      createdById: session.userId,
    },
    include: {
      assignedTo: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      feedback: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Estatísticas
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'ABERTO').length,
    emAtendimento: tickets.filter(t => t.status === 'EM_ATENDIMENTO').length,
    aguardandoFeedback: tickets.filter(t => t.status === 'CONCLUIDO_AGUARDANDO_FEEDBACK').length,
    finalizados: tickets.filter(t => t.status === 'FINALIZADO').length,
  }

  return (
    <div className="min-h-screen">
      <Header user={user} title="Painel da Escola" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SchoolDashboardClient 
          user={user} 
          initialTickets={tickets}
          stats={stats}
        />
      </main>
    </div>
  )
}
