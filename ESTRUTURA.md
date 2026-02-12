# 📂 Estrutura do Projeto

## Organização de Pastas

```
sistema-chamados-escolas/
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── seed.js              # Script para popular banco
├── src/
│   ├── app/
│   │   ├── page.js          # Página de login
│   │   ├── layout.js        # Layout principal
│   │   ├── globals.css      # Estilos globais
│   │   ├── api/             # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js
│   │   │   │   └── logout/route.js
│   │   │   └── tickets/
│   │   │       ├── route.js
│   │   │       └── [id]/
│   │   │           ├── route.js
│   │   │           └── feedback/route.js
│   │   ├── escola/          # Área da escola
│   │   │   ├── dashboard/
│   │   │   │   ├── page.js
│   │   │   │   └── SchoolDashboardClient.js
│   │   │   └── tickets/[id]/
│   │   │       ├── page.js
│   │   │       └── SchoolTicketDetailClient.js
│   │   └── admin/           # Área administrativa
│   │       ├── dashboard/
│   │       │   ├── page.js
│   │       │   └── AdminDashboardClient.js
│   │       └── tickets/[id]/
│   │           ├── page.js
│   │           └── AdminTicketDetailClient.js
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.js
│   │   └── TicketCard.js
│   └── lib/                 # Utilitários e configs
│       ├── prisma.js        # Cliente Prisma
│       ├── auth.js          # Funções de autenticação
│       └── utils.js         # Funções auxiliares
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

## 🔑 Principais Conceitos

### App Router (Next.js 14)

Este projeto usa o novo App Router do Next.js 14, que traz várias melhorias:

- **Server Components por padrão**: Páginas são renderizadas no servidor
- **Client Components**: Marcados com `'use client'` para interatividade
- **API Routes**: Em `app/api/` com arquivos `route.js`

### Autenticação

O sistema usa JWT (JSON Web Tokens) com cookies HTTP-only:

1. Login → JWT gerado → Cookie setado
2. Requests → Cookie enviado automaticamente
3. Server → Valida token e autoriza

### Banco de Dados

Prisma ORM fornece:
- Type-safe queries
- Migrations automáticas
- Schema declarativo
- Cliente auto-gerado

## 🎯 Fluxos Principais

### Fluxo de Criação de Chamado

```
Escola faz login
  → Acessa dashboard
  → Clica em "Novo Chamado"
  → Preenche formulário
  → POST /api/tickets
  → Ticket criado com status ABERTO
  → validUntil calculado (+3 dias úteis)
  → Histórico criado
  → Redirecionado para dashboard
```

### Fluxo de Atendimento

```
Técnico faz login
  → Acessa dashboard admin
  → Visualiza chamado
  → Atribui para si ou outro técnico
  → PATCH /api/tickets/[id] (assignedToId)
  → Status → EM_ATENDIMENTO
  → Resolve problema
  → Status → CONCLUIDO_AGUARDANDO_FEEDBACK
  → Escola recebe notificação visual
```

### Fluxo de Feedback

```
Escola vê chamado concluído
  → Clica em "Enviar Feedback"
  → Avalia de 1-5 estrelas
  → Escolhe status final:
    - FINALIZADO (resolvido)
    - NAO_RESOLVIDO (não resolvido)
    - CANCELADO (cancelar)
  → POST /api/tickets/[id]/feedback
  → Feedback salvo
  → Status atualizado
  → resolvedAt preenchido
```

## 🛠️ Personalização Comum

### 1. Adicionar Nova Categoria

**Schema (prisma/schema.prisma):**
```prisma
enum TicketCategory {
  SOFTWARE
  HARDWARE
  OFFICE
  IMPRESSORA
  REDE
  TELEFONIA  // ← Nova categoria
  OUTRO
}
```

**Utils (src/lib/utils.js):**
```javascript
export function getCategoryLabel(category) {
  const labels = {
    // ... outras categorias
    TELEFONIA: 'Telefonia',
  }
  return labels[category] || category
}

export function getCategoryIcon(category) {
  const icons = {
    // ... outros ícones
    TELEFONIA: '📞',
  }
  return icons[category] || '📋'
}
```

**Form (SchoolDashboardClient.js):**
```jsx
<option value="TELEFONIA">Problemas com Telefonia</option>
```

### 2. Adicionar Campo ao Ticket

**Schema:**
```prisma
model Ticket {
  // ... campos existentes
  urgency     String?  // Novo campo
}
```

**Migração:**
```bash
npx prisma migrate dev --name add_urgency_field
```

**API:**
```javascript
// Em /api/tickets/route.js
const { urgency } = body
// ... 
ticket = await prisma.ticket.create({
  data: {
    // ... outros campos
    urgency,
  }
})
```

### 3. Enviar Email de Notificação

Instale Nodemailer ou similar:
```bash
npm install nodemailer
```

Adicione em `/api/tickets/route.js`:
```javascript
import { sendEmail } from '@/lib/email'

// Após criar ticket
await sendEmail({
  to: 'admin@educacao.sp.gov.br',
  subject: `Novo Chamado: ${ticket.title}`,
  text: `Um novo chamado foi aberto pela ${user.name}`
})
```

### 4. Adicionar Comentários

Já existe model `Comment` no schema! Para implementar:

**API Route:** `/api/tickets/[id]/comments/route.js`
```javascript
export async function POST(request, { params }) {
  const { content } = await request.json()
  const session = await getSession()
  
  const comment = await prisma.comment.create({
    data: {
      ticketId: params.id,
      content,
      author: session.name,
      authorId: session.userId,
      isInternal: session.role === 'TECHNICIAN',
    }
  })
  
  return NextResponse.json({ comment })
}
```

**UI:** Adicionar seção de comentários nas páginas de detalhes.

## 🔍 Debugging

### Prisma Studio

Visualize e edite dados do banco facilmente:
```bash
npm run prisma:studio
```

Abre em `http://localhost:5555`

### Logs

Adicione logs estratégicos:
```javascript
console.log('[TICKET CREATED]', ticket.id, ticket.title)
```

### Next.js DevTools

Instale a extensão do Next.js para React DevTools.

## 📊 Métricas e Analytics (Expansão Futura)

Para adicionar analytics:

1. **Instalar Vercel Analytics:**
```bash
npm install @vercel/analytics
```

2. **Adicionar ao layout:**
```javascript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

3. **Criar Dashboard de Métricas:**
- Tempo médio de resolução
- Chamados por categoria
- Escolas com mais chamados
- Taxa de satisfação (feedbacks)

## 🚀 Performance

### Otimizações Implementadas

- ✅ Server Components quando possível
- ✅ Lazy loading de modais
- ✅ Prisma connection pooling
- ✅ Tailwind CSS (JIT mode)
- ✅ Next.js Image optimization

### Otimizações Futuras

- [ ] Redis para cache de sessões
- [ ] Revalidation strategy do Next.js
- [ ] Compressão de imagens (se anexos forem adicionados)
- [ ] CDN para assets estáticos

## 🔐 Segurança Adicional

### Headers HTTP

Adicione em `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
}
```

### Rate Limiting

Para produção, considere implementar rate limiting nas APIs.

## 📱 Progressive Web App (PWA)

Para transformar em PWA:

1. Instalar `next-pwa`
2. Criar `manifest.json`
3. Adicionar Service Worker
4. Permitir instalação home screen

## 🎓 Recursos de Aprendizado

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

💡 **Dica**: Explore o código, faça experimentos e personalize conforme as necessidades da sua prefeitura!
