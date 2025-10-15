-- Script SQL para corrigir as políticas RLS dos cursos

-- 1. Primeiro, vamos verificar as políticas existentes
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'courses';

-- 2. Remover políticas existentes se existirem
DROP POLICY IF EXISTS "courses_select_policy" ON courses;
DROP POLICY IF EXISTS "courses_insert_policy" ON courses; 
DROP POLICY IF EXISTS "courses_update_policy" ON courses;
DROP POLICY IF EXISTS "courses_delete_policy" ON courses;

-- 3. Criar novas políticas mais permissivas

-- Política SELECT: Permitir leitura para todos (cursos publicados) e autenticados (todos os cursos)
CREATE POLICY "courses_select_policy" ON courses
FOR SELECT USING (
  is_published = true OR auth.uid() IS NOT NULL
);

-- Política INSERT: Permitir inserção para usuários autenticados
CREATE POLICY "courses_insert_policy" ON courses
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política UPDATE: Permitir atualização para usuários autenticados  
CREATE POLICY "courses_update_policy" ON courses
FOR UPDATE USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Política DELETE: Permitir deleção para usuários autenticados
CREATE POLICY "courses_delete_policy" ON courses
FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY policyname;