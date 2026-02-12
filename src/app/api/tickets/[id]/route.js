import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Buscar ticket específico
export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

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
        },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (session.role === 'SCHOOL' && ticket.createdById !== session.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este chamado' },
        { status: 403 }
      )
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Erro ao buscar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar chamado' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar ticket
export async function PATCH(request, { params: paramsPromise }) {
  const params = await paramsPromise
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, assignedToId, priority } = body

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }

    // Apenas técnicos podem atualizar tickets
    if (session.role !== 'TECHNICIAN') {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar chamados' },
        { status: 403 }
      )
    }

    const updateData = {}
    const historyEntries = []

    // Atualizar status
    if (status && status !== ticket.status) {
      updateData.status = status
      
      if (['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(status)) {
        updateData.resolvedAt = new Date()
      }

      historyEntries.push({
        ticketId: ticket.id,
        action: 'STATUS_ALTERADO',
        oldValue: ticket.status,
        newValue: status,
        description: `Status alterado de ${ticket.status} para ${status}`,
        createdBy: session.name,
      })
    }

    // Atribuir técnico
    if (assignedToId !== undefined) {
      if (assignedToId === null) {
        updateData.assignedToId = null
        historyEntries.push({
          ticketId: ticket.id,
          action: 'TECNICO_REMOVIDO',
          oldValue: ticket.assignedToId,
          newValue: null,
          description: 'Técnico removido do chamado',
          createdBy: session.name,
        })
      } else if (assignedToId !== ticket.assignedToId) {
        updateData.assignedToId = assignedToId
        
        const technician = await prisma.technician.findUnique({
          where: { id: assignedToId },
          include: {
            user: {
              select: { name: true },
            },
          },
        })

        historyEntries.push({
          ticketId: ticket.id,
          action: 'TECNICO_ATRIBUIDO',
          oldValue: ticket.assignedToId,
          newValue: assignedToId,
          description: `Chamado atribuído para ${technician?.user.name}`,
          createdBy: session.name,
        })
      }
    }

    // Atualizar prioridade
    if (priority && priority !== ticket.priority) {
      updateData.priority = priority
      historyEntries.push({
        ticketId: ticket.id,
        action: 'PRIORIDADE_ALTERADA',
        oldValue: ticket.priority,
        newValue: priority,
        description: `Prioridade alterada de ${ticket.priority} para ${priority}`,
        createdBy: session.name,
      })
    }

    // Atualizar ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
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
    })

    // Criar entradas no histórico
    if (historyEntries.length > 0) {
      await prisma.ticketHistory.createMany({
        data: historyEntries,
      })
    }

    return NextResponse.json({
      ticket: updatedTicket,
      message: 'Chamado atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar chamado' },
      { status: 500 }
    )
  }
}
