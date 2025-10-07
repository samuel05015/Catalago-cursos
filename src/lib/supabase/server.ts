// Cliente Supabase para uso no servidor

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Database } from '@/types/supabase';

// Cliente para uso em componentes de servidor e Server Actions
// Usando cache() para evitar criar múltiplos clientes durante renderização
export const createClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Cliente para uso em Server Actions
export const createServerActionClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

export default createClient;