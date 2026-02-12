import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { calculateValidUntil } from '@/lib/utils'

// GET - Listar tickets
export async function GET(request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    let where = {}

    // Filtrar por role do usuário
    if (session.role === 'SCHOOL') {
      where.createdById = session.userId
    }

    // Aplicar filtros adicionais
    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    const tickets = await prisma.ticket.findMany({
      where,
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

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tickets' },
      { status: 500 }
    )
  }
}

// POST - Criar novo ticket
export async function POST(request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Apenas escolas podem criar tickets
    if (session.role !== 'SCHOOL') {
      return NextResponse.json(
        { error: 'Apenas escolas podem criar chamados' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, category, categoryDetail, priority } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Calcular data de validade (3 dias úteis)
    const validUntil = calculateValidUntil()

    // Criar ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        categoryDetail: category === 'OUTRO' ? categoryDetail : null,
        priority: priority || 'NORMAL',
        createdById: session.userId,
        validUntil,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            login: true,
          },
        },
      },
    })

    // Criar registro no histórico
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        action: 'CRIADO',
        newValue: 'ABERTO',
        description: 'Chamado criado',
        createdBy: session.name,
      },
    })

    return NextResponse.json({ 
      ticket,
      message: 'Chamado criado com sucesso' 
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao criar chamado' },
      { status: 500 }
    )
  }
}
