import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearAuthCookie()
    
    return NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro ao processar logout' },
      { status: 500 }
    )
  }
}
