import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request, { params: paramsPromise }) {
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
    const { rating, comment, finalStatus } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Avaliação deve ser entre 1 e 5' },
        { status: 400 }
      )
    }

    if (!finalStatus || !['FINALIZADO', 'CANCELADO', 'NAO_RESOLVIDO'].includes(finalStatus)) {
      return NextResponse.json(
        { error: 'Status final inválido' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o criador do ticket
    if (ticket.createdById !== session.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para avaliar este chamado' },
        { status: 403 }
      )
    }

    // Valida se o status permite envio de feedback
    if (ticket.status !== 'CONCLUIDO_AGUARDANDO_FEEDBACK') {
      return NextResponse.json(
        { error: 'Chamado não está aguardando feedback' },
        { status: 400 }
      )
    }

    // Registra o feedback e marca como finalizado
    const [feedback, updatedTicket] = await prisma.$transaction([
      prisma.feedback.create({
        data: {
          ticketId: params.id,
          rating,
          comment,
        },
      }),
      prisma.ticket.update({
        where: { id: params.id },
        data: {
          status: finalStatus,
          resolvedAt: new Date(),
        },
      }),
    ])

    // Registra a conclusião com base no feedback
    await prisma.ticketHistory.create({
      data: {
        ticketId: params.id,
        action: 'FEEDBACK_ENVIADO',
        newValue: finalStatus,
        description: `Feedback enviado com avaliação ${rating}/5. Status final: ${finalStatus}`,
        createdBy: session.name,
      },
    })

    return NextResponse.json({
      feedback,
      ticket: updatedTicket,
      message: 'Feedback enviado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao enviar feedback:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar feedback' },
      { status: 500 }
    )
  }
}
