/**
 * Script para criar usuário administrativo no Supabase
 * Execute: node scripts/create-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const ADMIN_EMAIL = 'sh05015130405@gmail.com';
const ADMIN_PASSWORD = 'Samu05015';

async function createAdminUser() {
  console.log('🔧 Criando usuário administrativo...\n');
  
  // Verificar configuração
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    console.log('❌ Configuração do Supabase incompleta!');
    console.log('Verifique o arquivo .env.local');
    return false;
  }
  
  try {
    // Criar cliente admin (com service role para criar usuários)
    const supabaseAdmin = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Criando usuário...');
    
    // Tentar criar o usuário
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        role: 'admin',
        name: 'Administrador'
      }
    });
    
    if (error) {
      // Se o usuário já existe, isso é ok
      if (error.message.includes('User already registered')) {
        console.log('✅ Usuário já existe!');
        console.log('📝 Tentando atualizar a senha...');
        
        // Atualizar senha do usuário existente
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          data?.user?.id || 'by-email', 
          { 
            password: ADMIN_PASSWORD,
            email_confirm: true
          }
        );
        
        if (updateError) {
          console.log('⚠️  Erro ao atualizar:', updateError.message);
        } else {
          console.log('✅ Senha atualizada com sucesso!');
        }
      } else {
        console.log('❌ Erro:', error.message);
        return false;
      }
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('👤 ID:', data.user?.id);
    }
    
    console.log('\n🎉 Pronto! Agora você pode fazer login com:');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Senha: ${ADMIN_PASSWORD}`);
    console.log('\n🌐 Acesse: http://localhost:3001/login');
    
    return true;
    
  } catch (err) {
    console.log('❌ Erro inesperado:', err.message);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Erro:', err);
      process.exit(1);
    });
}

module.exports = createAdminUser;