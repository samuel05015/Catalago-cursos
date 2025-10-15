# 🚀 Configuração do Supabase - Catálogo de Cursos

Este guia irá te ajudar a configurar o Supabase para o projeto de catálogo de cursos.

## 📋 Pré-requisitos

1. Conta no Supabase (gratuita): https://supabase.com
2. Projeto criado no Supabase

## 🔧 Passos para Configuração

### 1. Criar/Acessar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login ou crie uma conta
3. Clique em "New Project" ou acesse um projeto existente
4. Escolha uma organização
5. Configure:
   - **Nome do projeto**: catalogo-cursos (ou o que preferir)
   - **Senha do banco**: Crie uma senha segura (anote ela!)
   - **Região**: Escolha a mais próxima (ex: South America - São Paulo)

### 2. Obter Chaves do Projeto

Após criar o projeto:

1. Acesse **Settings** (⚙️) no menu lateral
2. Clique em **API**
3. Você verá duas informações importantes:

#### 📍 Project URL
```
https://[SEU-PROJECT-ID].supabase.co
```

#### 🔑 API Keys
- **anon/public**: Use esta para operações públicas
- **service_role**: Use apenas no servidor (operações administrativas)

### 3. Configurar Variáveis de Ambiente

Substitua os valores no arquivo `.env.local` que foi criado:

```env
# URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co

# Chave pública (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]

# Chave de serviço (service role key)
SUPABASE_SERVICE_ROLE_KEY=[SUA-SERVICE-ROLE-KEY]
```

### 4. Criar Tabelas no Banco de Dados

No painel do Supabase:

1. Vá para **Table Editor** (📊)
2. Clique em **New Table**

#### Tabela: `categorias`
```sql
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela: `tags`
```sql
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  cor VARCHAR DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela: `cursos`
```sql
CREATE TABLE cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  descricao TEXT,
  conteudo TEXT,
  imagem_url VARCHAR,
  categoria_id UUID REFERENCES categorias(id),
  instrutor VARCHAR,
  duracao_horas INTEGER,
  nivel VARCHAR CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  preco DECIMAL(10,2),
  publicado BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela de relacionamento: `cursos_tags`
```sql
CREATE TABLE cursos_tags (
  curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (curso_id, tag_id)
);
```

### 5. Configurar RLS (Row Level Security)

1. Vá para **Authentication** > **Policies**
2. Para cada tabela, habilite RLS e crie policies adequadas

#### Exemplo de Policy para `cursos` (leitura pública):
```sql
CREATE POLICY "Cursos são visíveis publicamente" ON cursos
  FOR SELECT USING (publicado = true);
```

### 6. Adicionar Dados de Exemplo (Opcional)

Execute no **SQL Editor**:

```sql
-- Inserir categorias
INSERT INTO categorias (nome, slug, descricao) VALUES
('Programação', 'programacao', 'Cursos de desenvolvimento de software'),
('Design', 'design', 'Cursos de design gráfico e UX/UI'),
('Marketing', 'marketing', 'Cursos de marketing digital');

-- Inserir tags
INSERT INTO tags (nome, slug, cor) VALUES
('JavaScript', 'javascript', '#F7DF1E'),
('React', 'react', '#61DAFB'),
('Node.js', 'nodejs', '#339933');
```

### 7. Testar a Configuração

1. Salve o arquivo `.env.local`
2. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse: http://localhost:3000

## ✅ Verificação

Se tudo estiver configurado corretamente:
- ✅ O site carrega sem erros
- ✅ Não aparecem mensagens de configuração inválida
- ✅ Os dados do Supabase são exibidos (se houver)

## 🆘 Solução de Problemas

### Erro: "SUPABASE_URL and SUPABASE_ANON_KEY are required"
- Verifique se o arquivo `.env.local` está na raiz do projeto
- Confirme que as variáveis não estão com valores de exemplo
- Reinicie o servidor após editar o `.env.local`

### Erro de conexão com banco
- Verifique se as URLs e chaves estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as tabelas foram criadas

## 📞 Suporte

- Documentação Supabase: https://supabase.com/docs
- Discord Supabase: https://discord.supabase.com