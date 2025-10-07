import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Metadata } from 'next';

// Definindo os metadados da página
export const metadata: Metadata = {
  title: 'Categorias - Catálogo de Cursos',
  description: 'Explore nosso catálogo de cursos por categorias.',
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  course_count?: number;
}

export default async function CategoriesIndexPage() {
  // Inicializar variáveis
  let categories = null;
  let error = null;
  let configError = null;
  let processedCategories: Category[] = [];

  try {
    // Buscar categorias do Supabase
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Verificar se Supabase está configurado
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key || url === "https://seu-projeto.supabase.co" || key === "sua-chave-anonima-aqui") {
      configError = "Configuração do Supabase não encontrada ou inválida. Por favor, configure o arquivo .env.local com valores válidos.";
    } else {
      // Consulta para buscar todas as categorias e contar cursos publicados
      const response = await supabase
        .from('course_categories')
        .select(`
          *,
          courses:courses (
            count,
            is_published
          )
        `)
        .eq('courses.is_published', true)
        .order('name', { ascending: true });
      
      categories = response.data;
      error = response.error;
      
      // Processar os dados para contar apenas cursos publicados
      processedCategories = categories?.map(category => {
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          course_count: category.courses?.length || 0
        };
      }) || [];
    }
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    error = { message: "Erro ao conectar ao banco de dados" };
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-16 mb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Categorias de Cursos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200 animate-fade-in">
              Explore nossos cursos organizados por áreas de interesse
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="container mx-auto px-6 mb-16">
        {(error || configError) && (
          <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-lg mb-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-red-400">
              {configError ? "Erro de configuração" : "Erro ao carregar categorias"}
            </h2>
            <p className="text-red-600 dark:text-red-300">
              {configError || "Não foi possível carregar as categorias. Tente novamente mais tarde."}
            </p>
            {configError && (
              <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-900/30 text-left mx-auto max-w-2xl">
                <p className="text-sm text-gray-300 mb-2">Para corrigir este problema:</p>
                <ol className="list-decimal list-inside text-sm text-gray-300">
                  <li className="mb-1">Edite o arquivo <code className="bg-dark-800 px-1 rounded text-red-300">.env.local</code> na raiz do projeto</li>
                  <li className="mb-1">Configure as variáveis <code className="bg-dark-800 px-1 rounded text-red-300">NEXT_PUBLIC_SUPABASE_URL</code> e <code className="bg-dark-800 px-1 rounded text-red-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                  <li>Reinicie o servidor de desenvolvimento</li>
                </ol>
              </div>
            )}
          </div>
        )}
        
        {!error && processedCategories.length === 0 && (
          <div className="text-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-2 dark:text-gray-300">Nenhuma categoria disponível</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ainda não temos categorias publicadas. Volte em breve para novidades!
            </p>
            <Link 
              href="/"
              className="mt-6 inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-full 
                       hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {processedCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         rounded-xl p-6 text-center hover:shadow-md 
                         transform hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 dark:bg-blue-700 rounded-full 
                              flex items-center justify-center text-white text-2xl font-bold">
                  {category.name[0]}
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {category.name}
                </h3>
                {(category.course_count ?? 0) > 0 && (
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 
                                 text-xs px-2 py-1 rounded-full">
                    {category.course_count} {category.course_count === 1 ? 'curso' : 'cursos'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-6 py-6 mb-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a página inicial
        </Link>
      </section>
    </div>
  );
}