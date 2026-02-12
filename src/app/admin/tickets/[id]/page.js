import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Header from '@/components/Header'
import AdminTicketDetailClient from './AdminTicketDetailClient'

export default async function AdminTicketDetail({ params: paramsPromise }) {
  const params = await paramsPromise
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  if (session.role !== 'TECHNICIAN') {
    redirect('/escola/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { technician: true },
  })

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      createdBy: {
        include: {
          school: true,
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
      history: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!ticket) {
    redirect('/admin/dashboard')
  }

  // Buscar todos os técnicos para atribuição
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

  return (
    <div className="min-h-screen">
      <Header user={user} title="Gerenciar Chamado" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTicketDetailClient 
          ticket={ticket}
          technicians={technicians}
          currentTechnicianId={user.technician.id}
        />
      </main>
    </div>
  )
}
