import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getSession, hashPassword } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { type, login, password, name, role, extra } = body

    if (!type || !login || !password || !name) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Apenas administradores podem criar novos admin
    if (role === 'ADMIN' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Apenas ADMIN pode criar usuários ADMIN' }, { status: 403 })
    }

    // Técnicos e admin podem criar usuários normais
    if (!(session.role === 'TECHNICIAN' || session.role === 'ADMIN')) {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    const hashed = await hashPassword(password)

    // Criar usuário conforme o tipo recebido
    if (type === 'user') {
      // Definição de role: técnico ou escola
      const created = await prisma.user.create({
        data: {
          login,
          password: hashed,
          name,
          role: role || 'SCHOOL',
        },
      })

      const { password: _, ...userWithoutPassword } = created
      return NextResponse.json({ user: userWithoutPassword })
    }

    if (type === 'technician') {
      // Dados adicionais do técnico: profissão, telefone, email
      const created = await prisma.user.create({
        data: {
          login,
          password: hashed,
          name,
          role: 'TECHNICIAN',
          technician: {
            create: {
              occupation: extra?.occupation || 'Técnico',
              phone: extra?.phone || null,
              email: extra?.email || null,
            },
          },
        },
        include: { technician: true },
      })

      const { password: _, ...userWithoutPassword } = created
      return NextResponse.json({ user: userWithoutPassword })
    }

    if (type === 'school') {
      // Dados adicionais da escola: endereço, telefone, email, distrito, INEP
      const created = await prisma.user.create({
        data: {
          login,
          password: hashed,
          name,
          role: 'SCHOOL',
          school: {
            create: {
              address: extra?.address || '',
              phone: extra?.phone || '',
              email: extra?.email || '',
              district: extra?.district || null,
              inep: extra?.inep || null,
            },
          },
        },
        include: { school: true },
      })

      const { password: _, ...userWithoutPassword } = created
      return NextResponse.json({ user: userWithoutPassword })
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  } catch (error) {
    console.error('Erro ao criar registro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
