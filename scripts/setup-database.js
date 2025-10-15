/**
 * Script para criar e popular as tabelas do banco de dados
 * Execute: npm run setup-db
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...\n');
  
  // Verificar configuração
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    console.log('❌ Configuração do Supabase incompleta!');
    console.log('Verifique o arquivo .env.local');
    return false;
  }
  
  try {
    // Criar cliente admin
    const supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'setup-database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executando script SQL...');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Executando ${commands.length} comandos...\n`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⚙️  Executando comando ${i + 1}/${commands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            // Tentar executar diretamente se RPC falhar
            const { error: directError } = await supabase
              .from('_temp')
              .select('*')
              .limit(0);
              
            // Ignore alguns erros comuns
            if (!error.message.includes('already exists') && 
                !error.message.includes('duplicate key') &&
                !error.message.includes('relation "_temp" does not exist')) {
              console.log(`⚠️  Aviso no comando ${i + 1}:`, error.message);
            }
          }
        } catch (cmdError) {
          console.log(`⚠️  Aviso no comando ${i + 1}:`, cmdError.message);
        }
      }
    }
    
    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas criadas...');
    
    const tables = ['course_categories', 'course_tags', 'courses', 'course_course_tags'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (error) {
          results[table] = `❌ Erro: ${error.message}`;
        } else {
          results[table] = '✅ OK';
        }
      } catch (err) {
        results[table] = `❌ Erro: ${err.message}`;
      }
    }
    
    console.log('\n📊 Status das tabelas:');
    Object.entries(results).forEach(([table, status]) => {
      console.log(`${status} ${table}`);
    });
    
    // Verificar dados de exemplo
    console.log('\n📈 Verificando dados...');
    
    try {
      const { data: categories, error: catError } = await supabase
        .from('course_categories')
        .select('*');
        
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('*');
        
      console.log(`✅ ${categories?.length || 0} categorias encontradas`);
      console.log(`✅ ${courses?.length || 0} cursos encontrados`);
      
    } catch (err) {
      console.log('⚠️  Erro ao verificar dados:', err.message);
    }
    
    console.log('\n🎉 Configuração do banco de dados concluída!');
    console.log('🌐 Agora você pode acessar: http://localhost:3001/categorias');
    
    return true;
    
  } catch (err) {
    console.log('❌ Erro na configuração:', err.message);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Erro:', err);
      process.exit(1);
    });
}

module.exports = setupDatabase;