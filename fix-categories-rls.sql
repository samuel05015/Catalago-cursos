-- Script para verificar e corrigir políticas RLS da tabela course_categories

-- 1. Verificar as políticas existentes para course_categories
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'course_categories';

-- 2. Verificar se RLS está habilitado na tabela
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'course_categories';

-- 3. Remover políticas existentes se existirem
DROP POLICY IF EXISTS "course_categories_select_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_insert_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_update_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_delete_policy" ON course_categories;

-- 4. Criar novas políticas mais permissivas para course_categories

-- Política SELECT: Permitir leitura para todos
CREATE POLICY "course_categories_select_policy" ON course_categories
FOR SELECT USING (true);

-- Política INSERT: Permitir inserção para usuários autenticados
CREATE POLICY "course_categories_insert_policy" ON course_categories
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política UPDATE: Permitir atualização para usuários autenticados  
CREATE POLICY "course_categories_update_policy" ON course_categories
FOR UPDATE USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Política DELETE: Permitir deleção para usuários autenticados
CREATE POLICY "course_categories_delete_policy" ON course_categories
FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'course_categories'
ORDER BY policyname;