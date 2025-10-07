// Cliente Supabase com privilégios de admin para bypass de RLS quando necessário

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Verificar se temos as variáveis de ambiente necessárias
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY env var não está definida');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL env var não está definida');
}

// Criar cliente com service role key (bypass RLS)
const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false, // Não atualizar tokens automaticamente
          persistSession: false, // Não persistir sessão
        },
      }
    )
  : null;

// Exportar cliente admin (uso com cautela, apenas no servidor)
export default supabaseAdmin;