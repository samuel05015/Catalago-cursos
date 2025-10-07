// Middleware para proteção de rotas e autenticação
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  
  // Inicializa o cliente do Supabase usando os cookies
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Redirecionar para login se acessar área admin sem autenticação
  if (pathname.startsWith('/admin') && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Passa adiante se estiver autenticado ou não for área restrita
  return res;
}

// Definir quais caminhos este middleware deve ser executado
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};