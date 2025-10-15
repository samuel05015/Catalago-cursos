-- SQL para manter apenas a categoria TECNOLOGIA
-- Execute no Supabase Dashboard (SQL Editor)

-- BLOCO 1: Criar/Atualizar categoria Tecnologia se não existir
INSERT INTO course_categories (name, slug) VALUES
  ('Tecnologia', 'tecnologia')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name;

-- BLOCO 2: Atualizar cursos existentes para usar a categoria Tecnologia
UPDATE courses 
SET category_id = (
  SELECT id FROM course_categories WHERE slug = 'tecnologia'
)
WHERE category_id IS NOT NULL;

-- BLOCO 3: Excluir todas as outras categorias (manter apenas Tecnologia)
DELETE FROM course_categories 
WHERE slug != 'tecnologia';

-- BLOCO 4: Verificar resultado final
SELECT 
  'Categorias restantes' as tipo, 
  name as nome, 
  slug,
  (SELECT count(*) FROM courses WHERE category_id = course_categories.id) as cursos_associados
FROM course_categories;

-- BLOCO 5: Verificar cursos atualizados
SELECT 
  title as curso_titulo,
  cc.name as categoria_nome
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id;