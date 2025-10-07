import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Course } from '@/types/course';

// Tipo para os metadados dinâmicos
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Buscar a categoria pelo slug
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: category } = await supabase
    .from('course_categories')
    .select('name')
    .eq('slug', params.slug)
    .single();

  return {
    title: category?.name ? `${category.name} - Catálogo de Cursos` : 'Categoria - Catálogo de Cursos',
    description: category?.name 
      ? `Explore os cursos da categoria ${category.name}` 
      : 'Explore os cursos por categoria'
  };
}

// Componente para exibir um card de curso
function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-dark-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-accent-900/20 shadow-lg shadow-accent-900/10 hover:shadow-accent-800/30 hover:border-accent-700/40 transition-all duration-300 group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {course.image_url ? (
          <Image 
            src={course.image_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/50 to-transparent"></div>
        
        {course.is_featured && (
          <div className="absolute top-3 right-3 bg-secondary-500/80 text-white 
                         px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-secondary-400/30 animate-pulse">
            Destaque
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-2">
          {course.category_name && (
            <span className="text-xs text-accent-400 font-medium uppercase tracking-wide flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {course.category_name}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent-300 transition-colors duration-300 line-clamp-1">{course.title}</h3>
        <p className="text-gray-300 mb-6 line-clamp-2 h-12 flex-grow">
          {course.short_description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-accent-900/20 mt-auto">
          <span className="text-lg font-bold text-success-400">
            {course.price_display || 'Consulte'}
          </span>
          <Link 
            href={`/cursos/${course.slug}`}
            className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white px-4 py-2 rounded-lg 
                     flex items-center gap-1 hover:shadow-glow transition-all duration-300"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Obter o slug da categoria a partir dos parâmetros da URL
  const { slug } = params;
  
  // Buscar detalhes da categoria e seus cursos no Supabase
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  // Buscar a categoria pelo slug
  const { data: category, error: categoryError } = await supabase
    .from('course_categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  // Se a categoria não for encontrada, retornar 404
  if (categoryError || !category) {
    return notFound();
  }
  
  // Buscar cursos relacionados à categoria
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select(`
      *,
      course_categories:category_id (
        name,
        slug
      )
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  
  // Formatar os cursos com informações de categoria
  const formattedCourses: Course[] = courses?.map(course => ({
    ...course,
    category_name: course.course_categories?.name,
    category_slug: course.course_categories?.slug
  })) || [];
  
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-400 transition-colors">Home</Link>
          <span className="mx-2 text-dark-600">/</span>
          <Link href="/#categories" className="hover:text-accent-400 transition-colors">Categorias</Link>
          <span className="mx-2 text-dark-600">/</span>
          <span className="text-white">{category.name}</span>
        </div>
      </div>
      
      {/* Cabeçalho da categoria */}
      <section className="bg-gradient-to-r from-accent-600 via-primary-500 to-secondary-600 text-white py-16 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-10 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-800/50 via-primary-900/60 to-secondary-800/50 backdrop-blur-sm"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-glow animate-gradient-text">{category.name}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow">
            {category.description || `Explore todos os cursos da categoria ${category.name}`}
          </p>
        </div>
      </section>
      
      {/* Lista de cursos */}
      <section className="container mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-white to-secondary-400">
            Cursos Disponíveis
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            <span className="bg-accent-900/30 px-3 py-1 rounded-full border border-accent-700/30">{formattedCourses.length}</span> {formattedCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'} na categoria <span className="text-accent-300 font-medium">{category.name}</span>
          </p>
        </div>
        
        {coursesError && (
          <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-lg mb-10">
            <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-red-400">Erro ao carregar cursos</h2>
            <p className="text-red-600 dark:text-red-300">
              Não foi possível carregar os cursos. Tente novamente mais tarde.
            </p>
          </div>
        )}
        
        {!coursesError && formattedCourses.length === 0 && (
          <div className="text-center p-10 bg-dark-900/60 rounded-lg mb-10 backdrop-blur-sm border border-dark-700 shadow-lg">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4v16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Nenhum curso disponível</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Ainda não temos cursos publicados nesta categoria. Volte em breve para novidades!
            </p>
            <Link 
              href="/"
              className="mt-6 inline-block bg-gradient-to-r from-accent-600 to-secondary-600 text-white px-6 py-3 rounded-lg
                       hover:shadow-glow transition-all duration-300 border border-accent-500/20"
            >
              Ver todas as categorias
            </Link>
          </div>
        )}

        {formattedCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedCourses.map((course, index) => (
              <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Voltar para página inicial */}
      <div className="container mx-auto px-6 py-10 mb-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-accent-400 hover:text-accent-300 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}