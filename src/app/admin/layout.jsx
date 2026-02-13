import { redirect } from 'next/navigation'
import { getSession } from '../../lib/auth'
import prisma from '../../lib/prisma'
import AdminShell from '../../components/AdminShell'

export const metadata = {
  title: 'Admin'
}

export default async function AdminLayout() {
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

  if (!user) {
    redirect('/')
  }

  const tickets = await prisma.ticket.findMany({
    include: {
      createdBy: { select: { id: true, name: true, login: true } },
      assignedTo: { include: { user: { select: { id: true, name: true } } } },
      feedback: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const technicians = await prisma.technician.findMany({
    include: { user: { select: { id: true, name: true } } },
  })

  // Renderiza o shell com a aplica\u00e7\u00e3o SPA
  return (
    <AdminShell user={user} initialTickets={tickets} technicians={technicians} />
  )
}
