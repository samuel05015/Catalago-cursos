-- SQL SUPER SIMPLES - Execute no Supabase Dashboard
-- Este deve funcionar 100%

-- 1. Inserir categorias básicas
INSERT INTO course_categories (name, slug) VALUES
  ('Programação', 'programacao'),
  ('Design', 'design'),
  ('Marketing', 'marketing'),
  ('Negócios', 'negocios'),
  ('Dados', 'dados')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 2. Verificar se funcionou
SELECT * FROM course_categories ORDER BY name;