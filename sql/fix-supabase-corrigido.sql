-- SQL CORRIGIDO - Execute no Supabase Dashboard (SQL Editor)
-- Execute cada bloco separadamente se necessário

-- BLOCO 1: Criar tabela course_tag_map (nome correto)
CREATE TABLE IF NOT EXISTS course_tag_map (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- BLOCO 2: Habilitar RLS e criar policy
ALTER TABLE course_tag_map ENABLE ROW LEVEL SECURITY;

-- Remover policy se existir e criar nova
DROP POLICY IF EXISTS "Course tags are viewable by everyone" ON course_tag_map;
CREATE POLICY "Course tags are viewable by everyone" ON course_tag_map
  FOR SELECT USING (true);

-- BLOCO 3: Inserir categorias (SEM campo description - não existe)
INSERT INTO course_categories (name, slug) VALUES
  ('Programação', 'programacao'),
  ('Design', 'design'),
  ('Marketing', 'marketing'),
  ('Negócios', 'negocios'),
  ('Dados', 'dados')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name;

-- BLOCO 4: Inserir tags (SEM campo color - não existe)
INSERT INTO course_tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Python', 'python'),
  ('Figma', 'figma'),
  ('SEO', 'seo'),
  ('HTML', 'html'),
  ('CSS', 'css'),
  ('Node.js', 'nodejs')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name;

-- BLOCO 5: Inserir cursos (campos corretos conforme schema)
INSERT INTO courses (title, slug, short_description, category_id, owner_id, price_display, is_published, is_featured) 
SELECT 
  'JavaScript Completo - Do Básico ao Avançado',
  'javascript-completo-basico-avancado',
  'Aprenda JavaScript moderno com projetos práticos e exemplos reais',
  c.id,
  'c048dbc4-7ab6-46c9-8586-0b69e7dfdf4c',  -- ID do usuário admin que criamos
  'R$ 299,90',
  true,
  true
FROM course_categories c WHERE c.slug = 'programacao'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, short_description, category_id, owner_id, price_display, is_published, is_featured) 
SELECT 
  'Design UX/UI Moderno',
  'design-ux-ui-moderno',
  'Crie interfaces incríveis e centradas no usuário',
  c.id,
  'c048dbc4-7ab6-46c9-8586-0b69e7dfdf4c',
  'R$ 249,90',
  true,
  false
FROM course_categories c WHERE c.slug = 'design'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, short_description, category_id, owner_id, price_display, is_published, is_featured) 
SELECT 
  'Marketing Digital Estratégico',
  'marketing-digital-estrategico',
  'Domine as principais estratégias de marketing online',
  c.id,
  'c048dbc4-7ab6-46c9-8586-0b69e7dfdf4c',
  'R$ 199,90',
  true,
  true
FROM course_categories c WHERE c.slug = 'marketing'
ON CONFLICT (slug) DO NOTHING;

-- BLOCO 6: Verificar resultados
SELECT 'Categorias' as tipo, count(*) as total FROM course_categories
UNION ALL
SELECT 'Tags', count(*) FROM course_tags
UNION ALL
SELECT 'Cursos', count(*) FROM courses
UNION ALL
SELECT 'Course-Tags', count(*) FROM course_tag_map;