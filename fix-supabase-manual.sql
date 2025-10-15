-- Execute este SQL no Dashboard do Supabase (SQL Editor)

-- 1. Criar tabela course_course_tags se não existir
CREATE TABLE IF NOT EXISTS course_course_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- 2. Habilitar RLS
ALTER TABLE course_course_tags ENABLE ROW LEVEL SECURITY;

-- 3. Criar policy (remover se já existir)
DROP POLICY IF EXISTS "Course tags are viewable by everyone" ON course_course_tags;
CREATE POLICY "Course tags are viewable by everyone" ON course_course_tags
  FOR SELECT USING (true);

-- 4. Inserir categorias de exemplo
INSERT INTO course_categories (name, slug, description) VALUES
  ('Programação', 'programacao', 'Cursos de desenvolvimento de software e programação'),
  ('Design', 'design', 'Cursos de design gráfico, UX/UI e design digital'),
  ('Marketing', 'marketing', 'Cursos de marketing digital e estratégias'),
  ('Negócios', 'negocios', 'Cursos de empreendedorismo e gestão'),
  ('Dados', 'dados', 'Cursos de análise de dados e ciência de dados')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 5. Inserir tags de exemplo
INSERT INTO course_tags (name, slug, color) VALUES
  ('JavaScript', 'javascript', '#F7DF1E'),
  ('React', 'react', '#61DAFB'),
  ('Python', 'python', '#3776AB'),
  ('Figma', 'figma', '#F24E1E'),
  ('SEO', 'seo', '#4285F4'),
  ('HTML', 'html', '#E34F26'),
  ('CSS', 'css', '#1572B6'),
  ('Node.js', 'nodejs', '#339933')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

-- 6. Inserir cursos de exemplo
INSERT INTO courses (title, slug, short_description, category_id, instructor, price_display, is_published, is_featured) 
SELECT 
  'JavaScript Completo - Do Básico ao Avançado',
  'javascript-completo-basico-avancado',
  'Aprenda JavaScript moderno com projetos práticos e exemplos reais',
  c.id,
  'João Silva',
  'R$ 299,90',
  true,
  true
FROM course_categories c WHERE c.slug = 'programacao'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, short_description, category_id, instructor, price_display, is_published, is_featured) 
SELECT 
  'Design UX/UI Moderno',
  'design-ux-ui-moderno',
  'Crie interfaces incríveis e centradas no usuário',
  c.id,
  'Ana Costa',
  'R$ 249,90',
  true,
  false
FROM course_categories c WHERE c.slug = 'design'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, short_description, category_id, instructor, price_display, is_published, is_featured) 
SELECT 
  'Marketing Digital Estratégico',
  'marketing-digital-estrategico',
  'Domine as principais estratégias de marketing online',
  c.id,
  'Carlos Lima',
  'R$ 199,90',
  true,
  true
FROM course_categories c WHERE c.slug = 'marketing'
ON CONFLICT (slug) DO NOTHING;

-- 7. Verificar se tudo foi criado corretamente
SELECT 'Categorias:' as type, count(*) as total FROM course_categories
UNION ALL
SELECT 'Tags:', count(*) FROM course_tags
UNION ALL
SELECT 'Cursos:', count(*) FROM courses
UNION ALL
SELECT 'Course-Tags:', count(*) FROM course_course_tags;