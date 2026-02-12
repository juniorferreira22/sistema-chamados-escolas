# ⚡ Guia Rápido - Primeiros Passos

## ✅ Checklist de Instalação

### 1️⃣ Verificar Pré-requisitos

```bash
# Verificar Node.js (precisa ser 18+)
node --version

# Se não tiver Node.js instalado, baixe em: https://nodejs.org
```

### 2️⃣ Instalar Dependências

```bash
cd sistema-chamados-escolas
npm install
```

⏱️ **Tempo estimado**: 2-3 minutos

### 3️⃣ Configurar Banco de Dados

#### Opção Fácil: Neon.tech (Recomendado)

1. Acesse: https://neon.tech
2. Clique em "Sign Up" (pode usar conta Google/GitHub)
3. Crie um novo projeto
4. Copie a "Connection String"
5. Cole no arquivo `.env` (crie se não existir)

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
JWT_SECRET="minhaChaveSuperSecreta123!@#"
```

💡 **Dica**: Use um gerador de senha forte para o JWT_SECRET

### 4️⃣ Criar Tabelas e Popular Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar tabelas
npx prisma migrate dev --name init

# Popular com 22 escolas e 3 técnicos
npm run seed
```

✅ **Pronto!** Dados iniciais criados.

### 5️⃣ Iniciar Aplicação

```bash
npm run dev
```

Abra: http://localhost:3000

## 🎮 Primeiro Acesso

### Como Escola

1. Acesse http://localhost:3000
2. Login: `escola01`
3. Senha: `escola01123`
4. Explore o dashboard!

### Como Admin

1. Acesse http://localhost:3000
2. Login: `admin`
3. Senha: `admin123`
4. Veja todos os chamados!

## 🎯 Primeiro Chamado (Teste)

### Passo 1: Login como Escola
- Login: `escola01` / `escola01123`

### Passo 2: Criar Chamado
1. Clique em "Novo Chamado"
2. Título: "Computador da sala 5 não liga"
3. Categoria: "Hardware/Componentes"
4. Descrição: "O computador da sala 5 não está ligando. Já tentei apertar o botão mas nada acontece."
5. Clique em "Criar Chamado"

### Passo 3: Login como Técnico
- Faça logout e entre com: `admin` / `admin123`

### Passo 4: Atender Chamado
1. Veja o chamado criado no dashboard
2. Clique nele
3. Clique em "Atribuir para Mim"
4. Mude status para "Em Atendimento"
5. Depois mude para "Aguardando Feedback"

### Passo 5: Enviar Feedback
1. Faça logout e entre novamente como: `escola01` / `escola01123`
2. Clique no chamado
3. Clique em "Enviar Feedback"
4. Dê 5 estrelas ⭐⭐⭐⭐⭐
5. Escolha "Problema Resolvido"
6. Envie!

## 🎨 Personalização Rápida

### Mudar Nome da Aplicação

Edite `src/app/layout.js`:
```javascript
export const metadata = {
  title: 'Seu Título Aqui',
  description: 'Sua descrição aqui',
}
```

### Mudar Cores

Edite `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#SEU_AZUL_AQUI',
    // ...
  }
}
```

## 📊 Visualizar Banco de Dados

```bash
npm run prisma:studio
```

Abre interface visual em http://localhost:5555

## 🐛 Problemas Comuns

### Erro: "DATABASE_URL not found"
➡️ Crie arquivo `.env` com suas credenciais

### Erro: "Cannot find module 'prisma'"
➡️ Rode: `npm install`

### Erro ao fazer login: "Credenciais inválidas"
➡️ Rode: `npm run seed` novamente

### Página em branco
➡️ Verifique console do navegador (F12)
➡️ Verifique terminal onde rodou `npm run dev`

## 🚀 Deploy Rápido (Vercel)

1. Crie conta em: https://vercel.com
2. Instale Vercel CLI: `npm i -g vercel`
3. No terminal do projeto: `vercel`
4. Configure variáveis de ambiente no painel da Vercel
5. Deploy! 🎉

## 📞 Precisa de Ajuda?

- 📖 Leia o README.md completo
- 📂 Veja ESTRUTURA.md para entender o código
- 🔍 Use Prisma Studio para ver os dados
- 💬 Comente e experimente!

## ⚡ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Ver banco de dados
npm run prisma:studio

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Popular novamente
npm run seed

# Build para produção
npm run build

# Rodar produção localmente
npm start
```

## 🎓 Próximos Passos

1. ✅ Teste todas as funcionalidades
2. ✅ Personalize cores e textos
3. ✅ Adicione logo da prefeitura
4. ✅ Configure email (opcional)
5. ✅ Faça deploy
6. ✅ Treine os usuários

## 💡 Dicas Profissionais

- **Backup**: Exporte dados regularmente do Prisma Studio
- **Monitoramento**: Use Vercel Analytics (gratuito)
- **Logs**: Adicione console.logs estratégicos
- **Testes**: Crie chamados de teste antes de usar em produção
- **Documentação**: Mantenha este guia atualizado com suas customizações

---

🎉 **Parabéns!** Você está pronto para usar o sistema!

Desenvolvido para a Prefeitura de Santa Cruz das Palmeiras, SP 🏫
