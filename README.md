# Catálogo de Cursos com Next.js e Supabase

Este projeto implementa um catálogo de cursos utilizando Next.js com App Router e Supabase como backend.

## Funcionalidades

- Exibição de catálogo de cursos com imagem, título, descrição e link de compra
- Painel administrativo protegido
- Gerenciamento completo de cursos (CRUD)
- Upload de imagens para o Supabase Storage
- Autenticação e autorização
- SEO otimizado

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Implantação**: Vercel (frontend) + Supabase (backend)

## Começando

Primeiro, configure o arquivo `.env.local` com suas credenciais do Supabase e depois execute o servidor de desenvolvimento:

# Catálogo de Cursos

Um catálogo moderno de cursos desenvolvido com Next.js, Supabase e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15.5.4** - Framework React com Turbopack
- **Supabase** - Backend as a Service com PostgreSQL
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Auth** - Sistema completo de autenticação

## ✨ Funcionalidades

- 🎨 **Design moderno** com tema escuro
- 👤 **Autenticação** de usuários
- 🔐 **Painel administrativo** restrito
- 📚 **Gestão de cursos** e categorias
- 🏷️ **Sistema de tags**
- 📱 **Interface responsiva**
- 🛡️ **Segurança com RLS**

## 🌐 Demo

🔗 **Site**: [Em breve]
🔧 **Admin**: Login necessário

## 🛠️ Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/samuel05015/Catalago-cursos.git
cd Catalago-cursos
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse: http://localhost:3000

## ⚙️ Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas necessárias
3. Execute os scripts SQL incluídos
4. Adicione as credenciais no `.env.local`

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
│   ├── admin/          # Painel administrativo
│   ├── categorias/     # Páginas de categorias
│   ├── cursos/         # Páginas de cursos
│   └── login/          # Autenticação
├── components/         # Componentes reutilizáveis
├── lib/               # Utilitários e configurações
└── types/             # Tipos TypeScript
```

## 🚀 Deploy

Este projeto está configurado para deploy automático na Vercel/Netlify através de commits no GitHub.

## 👨‍💻 Desenvolvido por

**Samuel** - [GitHub](https://github.com/samuel05015)

---

⭐ Se este projeto foi útil, considere dar uma estrela!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
