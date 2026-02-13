import { NextResponse } from 'next/server'
import prisma from "../../../../lib/prisma"
import { comparePasswords, generateToken, setAuthCookie } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const { login, password } = await request.json()

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Login e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Procura o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { login },
      include: {
        school: true,
        technician: true,
      },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Compara a senha fornecida com a armazenada
    const isValidPassword = await comparePasswords(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Cria o token de autenticação
    const token = generateToken({
      userId: user.id,
      login: user.login,
      name: user.name,
      role: user.role,
    })

    // Armazena o token nos cookies
    await setAuthCookie(token)

    // Retorna os dados do usuário sem a senha
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}
