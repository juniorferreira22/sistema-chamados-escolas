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
    const content = body.content?.trim()

    if (!content) {
      return NextResponse.json(
        { error: 'Digite uma mensagem para enviar' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        createdById: true,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }

    const canComment =
      session.role === 'TECHNICIAN' ||
      (session.role === 'SCHOOL' && ticket.createdById === session.userId)

    if (!canComment) {
      return NextResponse.json(
        { error: 'Sem permissão para comentar neste chamado' },
        { status: 403 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        ticketId: ticket.id,
        content,
        author: session.name,
        authorId: session.userId,
        isInternal: false,
      },
    })

    const comments = await prisma.comment.findMany({
      where: { ticketId: ticket.id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      comment,
      comments,
      message: 'Comentário enviado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar comentário' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params: paramsPromise }) {
  const params = await paramsPromise

  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'NÃ£o autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const commentId = body.commentId
    const content = body.content?.trim()

    if (!commentId) {
      return NextResponse.json(
        { error: 'ComentÃ¡rio nÃ£o informado' },
        { status: 400 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Digite uma mensagem para salvar' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        createdById: true,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Chamado nÃ£o encontrado' },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment || comment.ticketId !== ticket.id) {
      return NextResponse.json(
        { error: 'ComentÃ¡rio nÃ£o encontrado' },
        { status: 404 }
      )
    }

    const canAccessTicket =
      session.role === 'TECHNICIAN' ||
      (session.role === 'SCHOOL' && ticket.createdById === session.userId)

    const canEditComment =
      canAccessTicket &&
      (session.role === 'TECHNICIAN' || comment.authorId === session.userId)

    if (!canEditComment) {
      return NextResponse.json(
        { error: 'Sem permissÃ£o para editar este comentÃ¡rio' },
        { status: 403 }
      )
    }

    await prisma.comment.update({
      where: { id: comment.id },
      data: { content },
    })

    const comments = await prisma.comment.findMany({
      where: { ticketId: ticket.id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      comments,
      message: 'ComentÃ¡rio atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao editar comentÃ¡rio:', error)
    return NextResponse.json(
      { error: 'Erro ao editar comentÃ¡rio' },
      { status: 500 }
    )
  }
}
