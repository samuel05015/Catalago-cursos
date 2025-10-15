/**
 * Script para executar SQL diretamente no Supabase
 * Cria as tabelas que ainda estão faltando
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function executeSQL(sql) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    console.log('❌ Configuração incompleta!');
    return false;
  }
  
  const supabase = createClient(url, serviceKey);
  
  try {
    const { data, error } = await supabase.rpc('sql', { query: sql });
    
    if (error) {
      console.log('⚠️  SQL Error:', error.message);
      return false;
    }
    
    console.log('✅ SQL executado com sucesso!');
    return true;
  } catch (err) {
    console.log('❌ Erro:', err.message);
    return false;
  }
}

async function fixDatabase() {
  console.log('🔧 Corrigindo estrutura do banco...\n');
  
  // SQL para criar as tabelas que faltam
  const sqls = [
    `CREATE TABLE IF NOT EXISTS course_course_tags (
      course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
      tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
      PRIMARY KEY (course_id, tag_id)
    );`,
    
    `ALTER TABLE course_course_tags ENABLE ROW LEVEL SECURITY;`,
    
    `CREATE POLICY IF NOT EXISTS "Course tags are viewable by everyone" ON course_course_tags
      FOR SELECT USING (true);`,
      
    // Inserir mais categorias
    `INSERT INTO course_categories (name, slug, description) VALUES
      ('Programação', 'programacao', 'Cursos de desenvolvimento de software'),
      ('Design', 'design', 'Cursos de design gráfico e UX/UI'),
      ('Marketing', 'marketing', 'Cursos de marketing digital'),
      ('Negócios', 'negocios', 'Cursos de empreendedorismo'),
      ('Dados', 'dados', 'Cursos de análise de dados')
    ON CONFLICT (slug) DO NOTHING;`,
    
    // Inserir tags
    `INSERT INTO course_tags (name, slug, color) VALUES
      ('JavaScript', 'javascript', '#F7DF1E'),
      ('React', 'react', '#61DAFB'),
      ('Python', 'python', '#3776AB'),
      ('Figma', 'figma', '#F24E1E'),
      ('SEO', 'seo', '#4285F4')
    ON CONFLICT (slug) DO NOTHING;`,
    
    // Inserir cursos de exemplo
    `INSERT INTO courses (title, slug, short_description, category_id, instructor, price_display, is_published, is_featured) VALUES
      ('JavaScript Completo', 'javascript-completo', 'Aprenda JavaScript do básico ao avançado', 
       (SELECT id FROM course_categories WHERE slug = 'programacao'), 'João Silva', 'R$ 299,90', true, true),
      ('Design UX/UI', 'design-ux-ui', 'Crie interfaces incríveis', 
       (SELECT id FROM course_categories WHERE slug = 'design'), 'Ana Costa', 'R$ 249,90', true, false),
      ('Marketing Digital', 'marketing-digital', 'Estratégias de marketing online', 
       (SELECT id FROM course_categories WHERE slug = 'marketing'), 'Carlos Lima', 'R$ 199,90', true, true)
    ON CONFLICT (slug) DO NOTHING;`
  ];
  
  for (const sql of sqls) {
    console.log('⚙️  Executando SQL...');
    await executeSQL(sql);
  }
  
  console.log('\n🎉 Banco corrigido! Teste novamente a página de categorias.');
}

fixDatabase();