# Guia de Deploy na Vercel

## 1. Preparar o projeto para produção

### Criar .gitignore (se não existir)
node_modules/
.next/
.env.local
.env
.vercel
dist/
build/

### Configurar variáveis de ambiente de produção
# Você precisará configurar estas variáveis na Vercel:
NEXT_PUBLIC_SUPABASE_URL=https://zbmzusquamkjlskcyrxr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui

## 2. Preparar para o Git

# Inicializar repositório (se não feito)
git init
git add .
git commit -m "feat: catálogo de cursos completo"

# Criar repositório no GitHub
# Vá em: https://github.com/new
# Nome: catalogo-cursos
# Público ou Privado (sua escolha)

# Conectar com GitHub
git branch -M main
git remote add origin https://github.com/samuel05015/catalogo-cursos.git
git push -u origin main

## 3. Deploy na Vercel

# Opção A: Via site (mais fácil)
# 1. Acesse: https://vercel.com
# 2. Faça login com GitHub
# 3. Clique "Import Project"
# 4. Selecione seu repositório
# 5. Configure as variáveis de ambiente
# 6. Deploy automático!

# Opção B: Via CLI
npm i -g vercel
vercel login
vercel
# Siga as instruções