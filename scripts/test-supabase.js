/**
 * Script para testar a configuração do Supabase
 * Execute: npm run test-supabase
 */

import { createClient } from '@supabase/supabase-js';

async function testSupabaseConfig() {
  console.log('🔍 Testando configuração do Supabase...\n');
  
  // Verificar variáveis de ambiente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('📋 Verificação de Variáveis:');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${url ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ Definida' : '❌ Não definida'}\n`);
  
  if (!url || !anonKey) {
    console.log('❌ Configuração incompleta!');
    console.log('Por favor, configure o arquivo .env.local com as chaves do seu projeto Supabase.\n');
    return false;
  }
  
  // Verificar se os valores não são placeholders
  if (url.includes('seu-projeto') || anonKey.includes('sua-chave')) {
    console.log('❌ Valores de placeholder detectados!');
    console.log('Por favor, substitua os valores no .env.local pelas chaves reais do Supabase.\n');
    return false;
  }
  
  try {
    // Testar conexão
    console.log('🔗 Testando conexão...');
    const supabase = createClient(url, anonKey);
    
    // Tentar uma operação simples
    const { data, error } = await supabase
      .from('cursos')
      .select('count')
      .limit(1);
    
    if (error) {
      // Verificar se é erro de tabela não existir (esperado em projetos novos)
      if (error.message.includes('relation "cursos" does not exist')) {
        console.log('⚠️  Conexão OK, mas tabelas ainda não foram criadas');
        console.log('Execute o SQL do arquivo SUPABASE_SETUP.md para criar as tabelas.\n');
        return true;
      } else {
        console.log('❌ Erro na conexão:', error.message);
        return false;
      }
    }
    
    console.log('✅ Supabase configurado e funcionando!');
    console.log('✅ Tabelas criadas e acessíveis\n');
    return true;
    
  } catch (err) {
    console.log('❌ Erro ao testar:', err);
    return false;
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testSupabaseConfig()
    .then(success => {
      if (success) {
        console.log('🎉 Configuração do Supabase OK!');
        process.exit(0);
      } else {
        console.log('💡 Consulte o arquivo SUPABASE_SETUP.md para instruções detalhadas.');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Erro no teste:', err);
      process.exit(1);
    });
}

export default testSupabaseConfig;