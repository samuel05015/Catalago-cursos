-- Script SQL para criar todas as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de tags
CREATE TABLE IF NOT EXISTS course_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  color VARCHAR DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  content TEXT,
  image_url VARCHAR,
  category_id UUID REFERENCES course_categories(id),
  instructor VARCHAR,
  duration_hours INTEGER,
  level VARCHAR CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  price DECIMAL(10,2),
  price_display VARCHAR,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de relacionamento curso-tags
CREATE TABLE IF NOT EXISTS course_course_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_course_categories_slug ON course_categories(slug);
CREATE INDEX IF NOT EXISTS idx_course_tags_slug ON course_tags(slug);

-- Habilitar RLS (Row Level Security)
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_course_tags ENABLE ROW LEVEL SECURITY;

-- Criar policies para leitura pública
CREATE POLICY IF NOT EXISTS "Categories are viewable by everyone" ON course_categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Tags are viewable by everyone" ON course_tags
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Published courses are viewable by everyone" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY IF NOT EXISTS "Course tags are viewable by everyone" ON course_course_tags
  FOR SELECT USING (true);

-- Inserir dados de exemplo
INSERT INTO course_categories (name, slug, description) VALUES
  ('Programação', 'programacao', 'Cursos de desenvolvimento de software e programação'),
  ('Design', 'design', 'Cursos de design gráfico, UX/UI e design digital'),
  ('Marketing', 'marketing', 'Cursos de marketing digital e estratégias de marketing'),
  ('Negócios', 'negocios', 'Cursos de empreendedorismo e gestão de negócios'),
  ('Dados', 'dados', 'Cursos de análise de dados, ciência de dados e BI')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO course_tags (name, slug, color) VALUES
  ('JavaScript', 'javascript', '#F7DF1E'),
  ('React', 'react', '#61DAFB'),
  ('Node.js', 'nodejs', '#339933'),
  ('Python', 'python', '#3776AB'),
  ('HTML', 'html', '#E34F26'),
  ('CSS', 'css', '#1572B6'),
  ('TypeScript', 'typescript', '#3178C6'),
  ('Vue.js', 'vuejs', '#4FC08D'),
  ('Angular', 'angular', '#DD0031'),
  ('Figma', 'figma', '#F24E1E'),
  ('Photoshop', 'photoshop', '#31A8FF'),
  ('SEO', 'seo', '#4285F4'),
  ('Google Ads', 'google-ads', '#34A853'),
  ('Facebook Ads', 'facebook-ads', '#1877F2'),
  ('Excel', 'excel', '#217346'),
  ('Power BI', 'power-bi', '#F2C811')
ON CONFLICT (slug) DO NOTHING;

-- Inserir cursos de exemplo
INSERT INTO courses (title, slug, short_description, description, category_id, instructor, duration_hours, level, price, price_display, is_published, is_featured) VALUES
  (
    'JavaScript Moderno - Do Básico ao Avançado',
    'javascript-moderno-basico-avancado',
    'Aprenda JavaScript moderno com ES6+, DOM manipulation, async/await e muito mais.',
    'Curso completo de JavaScript moderno cobrindo desde conceitos básicos até tópicos avançados como Promises, async/await, modules e muito mais.',
    (SELECT id FROM course_categories WHERE slug = 'programacao'),
    'João Silva',
    40,
    'beginner',
    299.90,
    'R$ 299,90',
    true,
    true
  ),
  (
    'React - Criando Aplicações Modernas',
    'react-aplicacoes-modernas',
    'Domine React e crie aplicações web modernas e responsivas.',
    'Aprenda React desde o básico, incluindo hooks, context API, roteamento e integração com APIs.',
    (SELECT id FROM course_categories WHERE slug = 'programacao'),
    'Maria Santos',
    35,
    'intermediate',
    399.90,
    'R$ 399,90',
    true,
    false
  ),
  (
    'Design UX/UI Completo',
    'design-ux-ui-completo',
    'Aprenda a criar interfaces incríveis com foco na experiência do usuário.',
    'Curso completo de UX/UI Design cobrindo research, wireframes, protótipos e design systems.',
    (SELECT id FROM course_categories WHERE slug = 'design'),
    'Ana Costa',
    30,
    'beginner',
    249.90,
    'R$ 249,90',
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Associar tags aos cursos
INSERT INTO course_course_tags (course_id, tag_id) VALUES
  -- JavaScript curso
  ((SELECT id FROM courses WHERE slug = 'javascript-moderno-basico-avancado'), (SELECT id FROM course_tags WHERE slug = 'javascript')),
  ((SELECT id FROM courses WHERE slug = 'javascript-moderno-basico-avancado'), (SELECT id FROM course_tags WHERE slug = 'html')),
  ((SELECT id FROM courses WHERE slug = 'javascript-moderno-basico-avancado'), (SELECT id FROM course_tags WHERE slug = 'css')),
  
  -- React curso
  ((SELECT id FROM courses WHERE slug = 'react-aplicacoes-modernas'), (SELECT id FROM course_tags WHERE slug = 'react')),
  ((SELECT id FROM courses WHERE slug = 'react-aplicacoes-modernas'), (SELECT id FROM course_tags WHERE slug = 'javascript')),
  ((SELECT id FROM courses WHERE slug = 'react-aplicacoes-modernas'), (SELECT id FROM course_tags WHERE slug = 'typescript')),
  
  -- Design curso
  ((SELECT id FROM courses WHERE slug = 'design-ux-ui-completo'), (SELECT id FROM course_tags WHERE slug = 'figma')),
  ((SELECT id FROM courses WHERE slug = 'design-ux-ui-completo'), (SELECT id FROM course_tags WHERE slug = 'photoshop'))
ON CONFLICT DO NOTHING;