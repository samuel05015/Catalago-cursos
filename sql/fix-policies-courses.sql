-- SQL para corrigir políticas RLS da tabela courses
-- Execute no Supabase Dashboard (SQL Editor)

-- BLOCO 1: Verificar políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'courses';

-- BLOCO 2: Remover políticas existentes e criar novas
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Courses can be inserted by authenticated users" ON courses;
DROP POLICY IF EXISTS "Courses can be updated by authenticated users" ON courses;
DROP POLICY IF EXISTS "Courses can be deleted by authenticated users" ON courses;

-- BLOCO 3: Criar políticas completas para courses
-- Política para SELECT (visualizar)
CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (true);

-- Política para INSERT (criar)
CREATE POLICY "Courses can be inserted by authenticated users" ON courses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE (atualizar)
CREATE POLICY "Courses can be updated by authenticated users" ON courses
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para DELETE (excluir)
CREATE POLICY "Courses can be deleted by authenticated users" ON courses
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- BLOCO 4: Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';

-- BLOCO 5: Habilitar RLS se não estiver
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- BLOCO 6: Verificar políticas após criação
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'courses';