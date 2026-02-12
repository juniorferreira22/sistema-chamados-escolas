import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata = {
  title: 'iTicket - Sistema de Chamados para Escolas Municipais',
  description: 'Plataforma de gerenciamento de chamados de suporte técnico para escolas municipais',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
