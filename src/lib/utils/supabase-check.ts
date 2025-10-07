/**
 * Verificação do ambiente de execução do Supabase
 * Este arquivo é usado para garantir que a aplicação funcione mesmo sem o Supabase configurado
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Verifica se as configurações do Supabase estão presentes e válidas
 * Útil para desenvolvimento ou ambientes sem Supabase
 */
export function checkSupabaseConfig() {
  // Verifica se as variáveis de ambiente necessárias estão definidas
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Se faltam variáveis de ambiente
  if (!url || !key) {
    return { 
      available: false, 
      message: "Variáveis de ambiente do Supabase não configuradas. Veja o arquivo .env.local.example."
    };
  }
  
  // Se as variáveis parecem ser os placeholders
  if (url === "https://seu-projeto.supabase.co" || 
      key === "sua-chave-anonima-aqui") {
    return { 
      available: false, 
      message: "Configurações padrão do Supabase detectadas. Atualize .env.local com suas credenciais reais."
    };
  }
  
  return { available: true };
}

/**
 * Tenta inicializar o cliente Supabase e verificar a conexão
 * Retorna o cliente ou null em caso de erro
 */
export async function initSupabaseClient() {
  const config = checkSupabaseConfig();
  
  if (!config.available) {
    console.warn("Supabase não configurado:", config.message);
    return null;
  }
  
  try {
    const client = createClient();
    
    // Teste simples para verificar se a conexão está funcionando
    const { error } = await client.from('_dummy_query').select('*').limit(1);
    
    // Se houver erro de conexão e não apenas um erro de tabela não encontrada
    if (error && !error.message.includes('relation "_dummy_query" does not exist')) {
      console.error("Erro ao conectar ao Supabase:", error);
      return null;
    }
    
    return client;
  } catch (error) {
    console.error("Erro ao inicializar cliente Supabase:", error);
    return null;
  }
}