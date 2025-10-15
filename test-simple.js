/**
 * Teste simples do Supabase
 * Execute: node test-simple.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSimple() {
  console.log('🧪 Teste simples do Supabase...\n');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🔗 URL:', url);
  console.log('🔑 Key:', key ? 'Definida' : 'Não definida');
  
  if (!url || !key) {
    console.log('❌ Configuração incompleta!');
    return;
  }
  
  try {
    // Criar cliente
    const supabase = createClient(url, key);
    
    // 1. Inserir categoria de teste
    console.log('📝 Inserindo categoria de teste...');
    const { data: insertData, error: insertError } = await supabase
      .from('course_categories')
      .insert({ name: 'Teste', slug: 'teste' })
      .select();
    
    if (insertError) {
      console.log('⚠️  Erro ao inserir:', insertError.message);
    } else {
      console.log('✅ Categoria inserida:', insertData);
    }
    
    // 2. Buscar todas as categorias
    console.log('\n📋 Buscando todas as categorias...');
    const { data: categories, error: selectError } = await supabase
      .from('course_categories')
      .select('*')
      .order('name');
    
    if (selectError) {
      console.log('❌ Erro ao buscar:', selectError.message);
    } else {
      console.log('✅ Categorias encontradas:');
      categories?.forEach((cat, i) => {
        console.log(`  ${i + 1}. ${cat.name} (${cat.slug})`);
      });
    }
    
    // 3. Contar registros
    const { count, error: countError } = await supabase
      .from('course_categories')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('⚠️  Erro ao contar:', countError.message);
    } else {
      console.log(`\n📊 Total de categorias: ${count}`);
    }
    
    console.log('\n🎉 Teste concluído!');
    
  } catch (err) {
    console.log('❌ Erro no teste:', err.message);
  }
}

testSimple();