-- Script completo para corrigir todas as políticas RLS

-- ==== POLÍTICAS PARA COURSES ====

-- Verificar políticas existentes para courses
SELECT 'COURSES - Políticas existentes:' as info;
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'courses';

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "courses_select_policy" ON courses;
DROP POLICY IF EXISTS "courses_insert_policy" ON courses; 
DROP POLICY IF EXISTS "courses_update_policy" ON courses;
DROP POLICY IF EXISTS "courses_delete_policy" ON courses;

-- Criar novas políticas para courses
CREATE POLICY "courses_select_policy" ON courses
FOR SELECT USING (
  is_published = true OR auth.uid() IS NOT NULL
);

CREATE POLICY "courses_insert_policy" ON courses
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "courses_update_policy" ON courses
FOR UPDATE USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "courses_delete_policy" ON courses
FOR DELETE USING (auth.uid() IS NOT NULL);

-- ==== POLÍTICAS PARA COURSE_CATEGORIES ====

-- Verificar políticas existentes para course_categories
SELECT 'COURSE_CATEGORIES - Políticas existentes:' as info;
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'course_categories';

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "course_categories_select_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_insert_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_update_policy" ON course_categories;
DROP POLICY IF EXISTS "course_categories_delete_policy" ON course_categories;

-- Criar novas políticas para course_categories
CREATE POLICY "course_categories_select_policy" ON course_categories
FOR SELECT USING (true);

CREATE POLICY "course_categories_insert_policy" ON course_categories
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "course_categories_update_policy" ON course_categories
FOR UPDATE USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "course_categories_delete_policy" ON course_categories
FOR DELETE USING (auth.uid() IS NOT NULL);

-- ==== POLÍTICAS PARA COURSE_TAGS (se existir) ====

-- Verificar se a tabela course_tags existe
SELECT 'COURSE_TAGS - Verificando existência:' as info;
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'course_tags'
) as table_exists;

-- Se existir, criar políticas para course_tags
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_tags') THEN
        -- Remover políticas existentes
        DROP POLICY IF EXISTS "course_tags_select_policy" ON course_tags;
        DROP POLICY IF EXISTS "course_tags_insert_policy" ON course_tags;
        DROP POLICY IF EXISTS "course_tags_update_policy" ON course_tags;
        DROP POLICY IF EXISTS "course_tags_delete_policy" ON course_tags;
        
        -- Criar novas políticas
        CREATE POLICY "course_tags_select_policy" ON course_tags
        FOR SELECT USING (true);
        
        CREATE POLICY "course_tags_insert_policy" ON course_tags
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
        
        CREATE POLICY "course_tags_update_policy" ON course_tags
        FOR UPDATE USING (auth.uid() IS NOT NULL)
        WITH CHECK (auth.uid() IS NOT NULL);
        
        CREATE POLICY "course_tags_delete_policy" ON course_tags
        FOR DELETE USING (auth.uid() IS NOT NULL);
        
        RAISE NOTICE 'Políticas para course_tags criadas com sucesso';
    ELSE
        RAISE NOTICE 'Tabela course_tags não existe';
    END IF;
END
$$;

-- ==== VERIFICAÇÃO FINAL ====

-- Verificar todas as políticas criadas
SELECT 'VERIFICAÇÃO FINAL - Todas as políticas:' as info;
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename IN ('courses', 'course_categories', 'course_tags')
ORDER BY tablename, policyname;