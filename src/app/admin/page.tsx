import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Função para obter o status do usuário (se é admin ou não)
async function getUserRole() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }
  
  // Verifica se o usuário tem a role de admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('role', 'admin')
    .maybeSingle();
    
  const isAdmin = Boolean(roleData) || 
    // Alternativa: verificar claim personalizada
    session.user.app_metadata?.role === 'admin';
    
  return {
    user: session.user,
    isAdmin
  };
}

export default async function AdminPage() {
  // Verificar autenticação e permissões
  const userRole = await getUserRole();
  
  if (!userRole) {
    redirect('/login?redirectTo=/admin');
  }
  
  // Opcional: redirecionar usuários não-admin para uma página de acesso negado
  // if (!userRole.isAdmin) {
  //   redirect('/acesso-negado');
  // }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/cursos" className="bg-dark-800 border border-dark-700 p-6 rounded-lg shadow-md hover:shadow-glow hover:border-primary-600 transition-all duration-300">
          <h2 className="text-xl font-bold mb-2 text-white">Gerenciar Cursos</h2>
          <p className="text-gray-300">Criar, editar e publicar cursos no catálogo.</p>
        </Link>
        
        <Link href="/admin/categorias" className="bg-dark-800 border border-dark-700 p-6 rounded-lg shadow-md hover:shadow-glow hover:border-secondary-600 transition-all duration-300">
          <h2 className="text-xl font-bold mb-2 text-white">Categorias</h2>
          <p className="text-gray-300">Gerenciar categorias de cursos.</p>
        </Link>
        
        <Link href="/admin/tags" className="bg-dark-800 border border-dark-700 p-6 rounded-lg shadow-md hover:shadow-glow hover:border-accent-600 transition-all duration-300">
          <h2 className="text-xl font-bold mb-2 text-white">Tags</h2>
          <p className="text-gray-300">Gerenciar tags para organização dos cursos.</p>
        </Link>
      </div>
      
      <div className="bg-dark-800 border-l-4 border-primary-500 p-4 rounded">
        <h2 className="text-lg font-bold mb-2 text-white">Bem-vindo ao Painel de Administração</h2>
        <p className="text-gray-300">
          Aqui você pode gerenciar todo o conteúdo do catálogo de cursos. Para começar, 
          você precisa conectar este projeto ao seu backend do Supabase.
        </p>
        <div className="mt-4">
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Configure as variáveis de ambiente no arquivo <code className="bg-dark-900 px-2 py-1 rounded text-primary-400">.env.local</code></li>
            <li>Crie as tabelas e policies no seu projeto Supabase</li>
            <li>Configure o bucket de armazenamento de imagens</li>
            <li>Adicione sua conta como administrador</li>
          </ol>
        </div>
      </div>
    </div>
  );
}