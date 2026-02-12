# 🏫 Sistema de Chamados - Escolas Municipais

Sistema completo de gerenciamento de chamados de suporte técnico para as escolas municipais de Santa Cruz das Palmeiras, SP.

## 📋 Sobre o Sistema

Plataforma web desenvolvida para facilitar a abertura, acompanhamento e resolução de chamados técnicos das escolas municipais. O sistema possui dois perfis de usuário:

- **Escolas**: Podem criar e acompanhar seus chamados
- **Técnicos**: Podem gerenciar todos os chamados, atribuir responsáveis e atualizar status

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT com cookies HTTP-only
- **UI/UX**: Design mobile-first e responsivo

## 📦 Pré-requisitos

- Node.js 18+ instalado
- Conta em um provedor de PostgreSQL gratuito (recomendado: Neon, Supabase ou Railway)

## 🔧 Instalação

### 1. Clone ou baixe o projeto

```bash
cd sistema-chamados-escolas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Database - Use um dos provedores gratuitos
# Neon: https://neon.tech (recomendado)
# Supabase: https://supabase.com
# Railway: https://railway.app
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT Secret - Gere uma string aleatória forte
JWT_SECRET="sua-chave-secreta-super-forte-e-aleatoria-aqui"

# App
NEXT_PUBLIC_APP_NAME="Sistema de Chamados - Escolas Municipais"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Como obter um banco de dados PostgreSQL gratuito:

**Opção 1 - Neon (Recomendado):**
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a string de conexão PostgreSQL
5. Cole em `DATABASE_URL` no arquivo `.env`

**Opção 2 - Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (modo "Session pooling")
5. Cole em `DATABASE_URL` no arquivo `.env`

### 4. Configure o banco de dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco
npx prisma migrate dev --name init

# Popular o banco com dados iniciais (22 escolas + 3 técnicos)
npm run seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 👥 Credenciais de Acesso

### Técnicos / Administradores

- **Administrador**: `admin` / `admin123`
- **Técnico 1**: `tecnico1` / `tecnico123`
- **Técnico 2**: `tecnico2` / `tecnico123`

### Escolas

As 22 escolas possuem login no formato `escolaXX` e senha `escolaXX123`:

- **Escola 01**: `escola01` / `escola01123`
- **Escola 02**: `escola02` / `escola02123`
- **...** (até escola22)

## 🎯 Funcionalidades

### Para Escolas

- ✅ Login seguro com credenciais pré-definidas
- ✅ Dashboard com visão geral dos chamados
- ✅ Criar novos chamados com:
  - Título e descrição detalhada
  - Categoria (Software, Hardware, Office, Impressora, Rede, Outro)
  - Prioridade (Baixa, Normal, Alta, Urgente)
- ✅ Acompanhar status dos chamados em tempo real
- ✅ Visualizar histórico de alterações
- ✅ Enviar feedback após conclusão
- ✅ Prazo de 3 dias úteis automaticamente calculado

### Para Técnicos/Administradores

- ✅ Dashboard administrativo com estatísticas
- ✅ Visualizar todos os chamados do sistema
- ✅ Filtros avançados (por status, técnico, atrasados, etc)
- ✅ Busca por título, descrição ou escola
- ✅ Atribuir chamados para técnicos
- ✅ Alterar status dos chamados:
  - Aberto
  - Em Atendimento
  - Aguardando Feedback
  - Pendente (Terceiros)
  - Finalizado
  - Cancelado
  - Não Resolvido
- ✅ Visualizar histórico completo
- ✅ Ver informações de contato das escolas

## 📱 Design Responsivo

O sistema foi desenvolvido com abordagem mobile-first, funcionando perfeitamente em:
- 📱 Smartphones
- 💻 Tablets
- 🖥️ Desktops

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Cookies HTTP-only (proteção contra XSS)
- Validação de permissões em todas as rotas
- SQL Injection prevention com Prisma

## 📊 Estrutura do Banco de Dados

### Principais Modelos

- **User**: Usuários do sistema (escolas e técnicos)
- **School**: Dados específicos das escolas
- **Technician**: Dados específicos dos técnicos
- **Ticket**: Chamados de suporte
- **Feedback**: Avaliações dos chamados
- **TicketHistory**: Histórico de alterações
- **Comment**: Comentários (futura expansão)

## 🚀 Deploy em Produção

### Opção 1: Vercel (Recomendado para Next.js)

1. Crie conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente
4. Deploy automático!

### Opção 2: Railway

1. Crie conta em [railway.app](https://railway.app)
2. Faça deploy do PostgreSQL
3. Faça deploy da aplicação Next.js
4. Configure as variáveis de ambiente

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npm run prisma:migrate

# Abrir Prisma Studio (visualizador de dados)
npm run prisma:studio

# Popular banco com dados
npm run seed
```

## 🎨 Customização

### Cores do Sistema

As cores podem ser ajustadas em `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Azul - cor principal */ },
  accent: { /* Amarelo - cor de destaque */ },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
}
```

### Logo

Substitua o SVG no componente de login e header por sua logo personalizada.

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

- Verifique se a `DATABASE_URL` está correta
- Confirme que o banco está acessível
- Rode `npx prisma migrate reset` para resetar

### Erro ao fazer login

- Verifique se rodou `npm run seed`
- Confirme que as credenciais estão corretas
- Limpe cookies do navegador

### Páginas não carregam

- Rode `npm run build` para verificar erros
- Veja o console do navegador para mais detalhes

## 📞 Suporte

Para dúvidas ou problemas:
- Email: suporte.ti@educacao.santacruz.sp.gov.br
- Abra um chamado no próprio sistema!

## 📄 Licença

Este sistema foi desenvolvido para uso da Prefeitura Municipal de Santa Cruz das Palmeiras, SP.

---

Desenvolvido com ❤️ para melhorar o suporte técnico nas escolas municipais.
