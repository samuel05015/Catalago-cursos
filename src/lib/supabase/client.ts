// Cliente Supabase para uso no navegador (componentes cliente)

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Cliente para uso em componentes cliente (browser)
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Função para criar um cliente Supabase com tipo tipado
export default createClient;