import { redirect } from 'next/navigation'
import { getSession } from '../../../lib/auth'
import prisma from '../../../lib/prisma'
import Header from '../../../components/Header'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  if (session.role !== 'TECHNICIAN') {
    redirect('/escola/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      technician: true,
    },
  })

  // Buscar todos os tickets
  const tickets = await prisma.ticket.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          login: true,
        },
      },
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

  // Buscar todos os técnicos
  const technicians = await prisma.technician.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  // Estatísticas
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'ABERTO').length,
    emAtendimento: tickets.filter(t => t.status === 'EM_ATENDIMENTO').length,
    pendentes: tickets.filter(t => t.status === 'PENDENTE_TERCEIROS').length,
    aguardandoFeedback: tickets.filter(t => t.status === 'CONCLUIDO_AGUARDANDO_FEEDBACK').length,
    atrasados: tickets.filter(t => {
      if (['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(t.status)) return false
      return new Date() > new Date(t.validUntil)
    }).length,
  }

  return (
    <div className="min-h-screen">
      <Header user={user} title="Painel Administrativo" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboardClient 
          user={user}
          technician={user.technician}
          initialTickets={tickets}
          technicians={technicians}
          stats={stats}
        />
      </main>
    </div>
  )
}
