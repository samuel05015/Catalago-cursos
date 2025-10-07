'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ThemeToggle from '@/components/shared/theme-toggle';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica o estado da autenticação ao carregar o componente
  useEffect(() => {
    // Verificar se o código está executando no navegador
    if (typeof window === 'undefined') return;
    
    // Verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'https://seu-projeto.supabase.co' || 
        supabaseKey === 'sua-chave-anon') {
      console.warn('Supabase não configurado corretamente. Autenticação desabilitada.');
      setError('Configuração do Supabase pendente');
      setLoading(false);
      return;
    }
    
    async function initSupabase() {
      try {
        // Importação dinâmica para evitar erros durante SSR
        const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
        const supabase = createClientComponentClient();
        setSupabaseInitialized(true);
        
        // Verifica a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        // Assina as mudanças de auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        setError('Erro ao conectar com Supabase');
      } finally {
        setLoading(false);
      }
    }
    
    initSupabase();
  }, []);

  // Função para fazer logout
  const handleLogout = async () => {
    if (!supabaseInitialized) return;
    
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="relative z-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        {/* Gradient background with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/80 via-primary-900/80 to-secondary-900/80 opacity-90"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent-400 rounded-full shadow-glow animate-ping-slow"></div>
        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-primary-400 rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-secondary-400 rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '1.5s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Bottom highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>
      </div>
      
      {/* Main navigation content */}
      <div className="container mx-auto flex justify-between items-center py-4 px-6 relative">
        {/* Logo apenas, sem texto */}
        <Link href="/" className="group relative">
          <div className="relative">
            {/* Logo extremamente grande */}
            <Image
              src="/evoluir.png"
              alt="Logo Evoluir"
              width={128}
              height={128}
              className="relative z-10 object-contain group-hover:scale-105 transition-all duration-300"
            />
          </div>
        </Link>
        
        {/* Navigation links */}
        <div className="flex gap-8 items-center">
          <Link
            href="/"
            className={`group flex items-center gap-2 transition-all duration-300 relative ${pathname === '/' ? 'text-accent-300' : 'text-white'}`}
          >
            {/* Icon with glow effect */}
            <div className="relative">
              <div className={`absolute -inset-1 rounded-full blur-sm bg-accent-500/30 transition-opacity duration-300 ${pathname === '/' ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}></div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 relative z-10 transition-transform duration-300 ${pathname === '/' ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            
            <span className={`font-medium transition-all duration-300 ${pathname === '/' ? '' : 'group-hover:text-accent-300'}`}>Cursos</span>
            
            {/* Bottom highlight animation */}
            <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-accent-500 to-accent-300 transition-all duration-300 
                          ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
          </Link>
          
          <Link
            href="/categorias"
            className={`group flex items-center gap-2 transition-all duration-300 relative 
                       ${pathname === '/categorias' || pathname.startsWith('/categorias/') ? 'text-secondary-300' : 'text-white'}`}
          >
            {/* Icon with glow effect */}
            <div className="relative">
              <div className={`absolute -inset-1 rounded-full blur-sm bg-secondary-500/30 transition-opacity duration-300 
                             ${pathname === '/categorias' || pathname.startsWith('/categorias/') ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}></div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 relative z-10 transition-transform duration-300 
                                                                ${pathname === '/categorias' || pathname.startsWith('/categorias/') ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            
            <span className={`font-medium transition-all duration-300 ${pathname === '/categorias' || pathname.startsWith('/categorias/') ? '' : 'group-hover:text-secondary-300'}`}>
              Categorias
            </span>
            
            {/* Bottom highlight animation */}
            <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-secondary-500 to-secondary-300 transition-all duration-300 
                          ${pathname === '/categorias' || pathname.startsWith('/categorias/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
          </Link>
          
          {/* Authentication section */}
          <div className="pl-4 flex items-center gap-4 border-l border-white/10">
            {!loading && user ? (
              <div className="flex items-center gap-4">
                {/* Admin panel button */}
                <Link
                  href="/admin"
                  className={`group relative px-4 py-2 overflow-hidden rounded-xl transition-all duration-300
                             ${pathname.startsWith('/admin') ? 'text-white' : 'text-white hover:text-white'}`}
                >
                  {/* Button background */}
                  <div className={`absolute inset-0 transition-all duration-300 rounded-xl
                                  ${pathname.startsWith('/admin') 
                                    ? 'bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600 opacity-100' 
                                    : 'bg-dark-800/50 group-hover:bg-gradient-to-r group-hover:from-accent-700 group-hover:via-accent-600 group-hover:to-primary-700 opacity-80'}`}>
                  </div>
                  
                  {/* Button border */}
                  <div className="absolute inset-0 rounded-xl border border-accent-500/50 group-hover:border-accent-400/70 transition-colors duration-300"></div>
                  
                  {/* Button content */}
                  <div className="flex items-center gap-2 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden md:inline">Painel Admin</span>
                    <span className="md:hidden">Admin</span>
                  </div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </Link>
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="group relative px-4 py-2 overflow-hidden rounded-xl transition-all duration-300 text-white"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-error-700 to-error-600 opacity-90 rounded-xl group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button border */}
                  <div className="absolute inset-0 rounded-xl border border-error-500/50 group-hover:border-error-400/70 transition-colors duration-300"></div>
                  
                  {/* Button content */}
                  <div className="flex items-center gap-2 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H3zm7 4a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 13.586V8a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Sair</span>
                  </div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative px-4 py-2 overflow-hidden rounded-xl transition-all duration-300 text-white"
              >
                {/* Button background with gradient */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-500
                               ${pathname === '/login' 
                                 ? 'bg-gradient-to-r from-secondary-500 via-secondary-600 to-accent-600' 
                                 : 'bg-gradient-to-r from-secondary-600 to-accent-700 group-hover:from-secondary-500 group-hover:to-accent-600'}`}>
                </div>
                
                {/* Button border */}
                <div className="absolute inset-0 rounded-xl border border-secondary-500/50 group-hover:border-secondary-400/70 transition-colors duration-300"></div>
                
                {/* Button content */}
                <div className="flex items-center gap-2 relative z-10">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full blur-sm bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Login</span>
                </div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}