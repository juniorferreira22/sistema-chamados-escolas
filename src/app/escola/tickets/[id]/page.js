import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Header from '@/components/Header'
import SchoolTicketDetailClient from './SchoolTicketDetailClient'

export default async function SchoolTicketDetail({ params }) {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  if (session.role !== 'SCHOOL') {
    redirect('/admin/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { school: true },
  })

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
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
      history: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          isInternal: false, // Apenas comentários públicos
        },
      },
    },
  })

  if (!ticket) {
    redirect('/escola/dashboard')
  }

  // Verificar se o ticket pertence à escola
  if (ticket.createdById !== session.userId) {
    redirect('/escola/dashboard')
  }

  return (
    <div className="min-h-screen">
      <Header user={user} title="Detalhes do Chamado" />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SchoolTicketDetailClient ticket={ticket} />
      </main>
    </div>
  )
}
