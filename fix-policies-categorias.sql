-- SQL para verificar e corrigir políticas RLS para course_categories
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
WHERE tablename = 'course_categories';

-- BLOCO 2: Remover políticas existentes e criar novas
DROP POLICY IF EXISTS "Course categories are viewable by everyone" ON course_categories;
DROP POLICY IF EXISTS "Course categories can be inserted by authenticated users" ON course_categories;
DROP POLICY IF EXISTS "Course categories can be updated by authenticated users" ON course_categories;
DROP POLICY IF EXISTS "Course categories can be deleted by authenticated users" ON course_categories;

-- BLOCO 3: Criar políticas completas para course_categories
-- Política para SELECT (visualizar)
CREATE POLICY "Course categories are viewable by everyone" ON course_categories
  FOR SELECT USING (true);

-- Política para INSERT (criar)
CREATE POLICY "Course categories can be inserted by authenticated users" ON course_categories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE (atualizar)
CREATE POLICY "Course categories can be updated by authenticated users" ON course_categories
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para DELETE (excluir)
CREATE POLICY "Course categories can be deleted by authenticated users" ON course_categories
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- BLOCO 4: Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'course_categories';

-- BLOCO 5: Habilitar RLS se não estiver
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;

-- BLOCO 6: Verificar políticas após criação
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'course_categories';