import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';

// Interface para os cursos
interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  image_url: string | null;
  price_display: string | null;
  is_featured: boolean;
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
}

// Componente de card de curso
function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-xl overflow-hidden border border-dark-700
                   hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300 group
                   relative backdrop-blur-sm">
      {/* Fundo com efeito de brilho nos cantos */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* Overlay em grade */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative h-52 bg-dark-700 overflow-hidden">
        {course.image_url ? (
          <>
            <Image 
              src={course.image_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-900 to-primary-900 text-gray-400 relative overflow-hidden">
            {/* Padrão de grade para fundos vazios */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-40 relative z-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {course.is_featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-600 
                         px-3 py-1 rounded-full text-xs font-bold shadow-md text-white
                         backdrop-blur-sm border border-yellow-500/50 z-10 animate-pulse-slow">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Destaque
            </div>
          </div>
        )}
      </div>
      <div className="p-6 relative z-10">
        <div className="mb-2">
          {course.category_name && (
            <span className="text-xs text-accent-400 font-medium uppercase tracking-wide flex items-center gap-1 bg-dark-900/50 inline-block px-2 py-1 rounded border border-dark-700/50 hover:border-accent-700/30 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {course.category_name}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-1 group-hover:text-accent-400 transition-colors duration-200 relative">
          <span className="absolute -left-2 -top-1 transform -translate-y-1/2 w-1 h-6 bg-accent-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          {course.title}
        </h3>
        <p className="text-gray-300 mb-6 line-clamp-2 h-12 group-hover:text-gray-200 transition-colors duration-300">
          {course.short_description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-dark-700 relative">
          <span className="relative overflow-hidden inline-block">
            <span className="text-lg font-bold text-success-DEFAULT group-hover:text-success-400 transition-colors duration-300">
              {course.price_display || 'Consulte'}
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-success-500/50 group-hover:w-full transition-all duration-300 delay-75"></span>
          </span>
          
          <Link 
            href={`/cursos/${course.slug}`}
            className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white px-4 py-2 rounded-lg 
                     flex items-center gap-1 hover:shadow-glow transition-all duration-300 
                     border border-accent-500/20 group-hover:border-accent-500/40
                     relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-400/0 via-white/20 to-accent-400/0 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10">Saiba mais</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  // TESTE DE RENDERIZAÇÃO - REMOVER DEPOIS
  // Buscar cursos publicados do Supabase
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_categories:category_id (
        name,
        slug
      )
    `)
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
    <div className="min-h-screen text-center">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 mb-16 relative overflow-hidden">
        {/* Efeito de partículas/círculos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-60 w-40 h-40 bg-primary-600/20 rounded-full blur-2xl animate-bounce-slow"></div>
          <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 animate-spin-slow"></div>
          <div className="absolute inset-0 bg-[url('/window.svg')] bg-repeat opacity-[0.02]"></div>
          
          {/* Partículas */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-glow animate-ping-slow"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-accent-400 rounded-full shadow-glow animate-ping-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-secondary-400 rounded-full shadow-glow animate-ping-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary-400/50 rounded-full shadow-glow animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Grade simulada */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex justify-center items-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-accent-400/50 bg-accent-900/30 text-accent-200 text-sm animate-fade-in backdrop-blur-sm shadow-lg shadow-accent-900/20 group hover:border-accent-300 transition-all duration-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent-400/30 flex items-center justify-center backdrop-blur">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-accent-400 opacity-50"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-300"></span>
                </span>
                <span>✨ Conhecimento ao seu alcance</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-center w-full">
              <span className="block relative">
                Catálogo de <span className="relative">
                  <span className="absolute -inset-1 blur-sm bg-accent-500/20 rounded-lg"></span>
                  <span className="relative">Cursos</span>
                </span>
              </span> 
              <span className="bg-gradient-to-r from-accent-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent animate-gradient-text">Online</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-100 animate-fade-in text-center backdrop-blur-sm bg-dark-900/30 rounded-lg py-3 px-6 inline-block border border-dark-700/50 shadow-lg">
              Explore nossa seleção de cursos de alta qualidade e <span className="text-accent-300 font-medium">impulsione sua carreira</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <Link 
                href="#cursos" 
                className="bg-gradient-to-r from-accent-600 via-accent-500 to-secondary-600 text-white
                         px-8 py-4 rounded-lg font-semibold shadow-2xl border border-accent-500
                         hover:shadow-accent-500/50 hover:-translate-y-1 hover:scale-105 
                         transition-all duration-300 flex items-center gap-2 text-lg relative
                         overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-400/0 via-white/20 to-accent-400/0 
                              -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="relative z-10">Explorar Cursos</span>
              </Link>
              <Link 
                href="/categorias" 
                className="bg-transparent border border-accent-500 text-white
                         px-8 py-4 rounded-lg font-semibold shadow-lg 
                         hover:bg-accent-900/30 hover:border-accent-400 transition-all duration-300 flex items-center gap-2
                         group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Ver Categorias
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="container mx-auto px-6 mb-20">
        <div className="text-center mb-16 relative">
          {/* Decoração de fundo */}
          <div className="absolute -inset-20 bg-primary-600/5 blur-3xl rounded-full opacity-70 pointer-events-none"></div>
          
          <div className="inline-block mb-3 px-4 py-2 bg-primary-900/30 border border-primary-800/70 rounded-full text-primary-300 text-sm backdrop-blur-sm shadow-lg relative">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span>Conhecimento para todos</span>
            </div>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700/0 via-primary-700/20 to-primary-700/0 blur-xl h-10 w-full"></div>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center relative">
              Nossos <span className="text-primary-400 text-shadow animate-pulse-slow">Cursos</span>
            </h2>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-center backdrop-blur-sm bg-dark-900/20 py-3 px-6 rounded-lg inline-block border border-dark-800/50 shadow-lg mb-6">
            Expanda seus conhecimentos com nossos cursos <span className="text-primary-300 font-medium">cuidadosamente selecionados</span> para impulsionar sua carreira
          </p>
          
          <div className="mt-6 inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-700/0 via-primary-700/20 to-primary-700/0 rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <Link 
              href="/categorias"
              className="inline-block text-primary-400 hover:text-primary-300 transition-colors group relative"
            >
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>Ver todas as categorias</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500/50 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="text-center p-10 bg-error-900/20 border border-error-800 rounded-lg mb-10 animate-fade-in backdrop-blur-sm shadow-lg">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-error-900/30 rounded-full blur-xl"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-error-800 to-error-600 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-error-400">Erro ao carregar cursos</h2>
            <p className="text-gray-300 max-w-lg mx-auto">
              Não foi possível carregar os cursos. Tente novamente mais tarde.
            </p>
            <div className="h-0.5 w-24 bg-error-700 mx-auto mt-4"></div>
          </div>
        )}
        
        {!error && formattedCourses.length === 0 && (
          <div className="text-center p-10 bg-dark-800/50 border border-dark-700 rounded-lg mb-10 animate-fade-in backdrop-blur-sm shadow-lg">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-primary-900/30 rounded-full blur-xl"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Nenhum curso disponível</h2>
            <p className="text-gray-300 max-w-lg mx-auto">
              Ainda não temos cursos publicados. Volte em breve para novidades!
            </p>
            <div className="h-0.5 w-24 bg-primary-700 mx-auto mt-4"></div>
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

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-6 mb-20 pt-20 relative">
        {/* Efeitos de decoração */}
        <div className="absolute -left-20 top-1/3 w-40 h-40 bg-secondary-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-1/3 w-40 h-40 bg-accent-600/5 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-12 relative">
          <div className="inline-block mb-3 px-4 py-2 bg-secondary-900/30 border border-secondary-800/70 rounded-full text-secondary-300 text-sm backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Áreas de Conhecimento</span>
            </div>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-700/0 via-secondary-700/20 to-secondary-700/0 blur-xl h-10 w-full"></div>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center relative">
              <span className="text-secondary-400 text-shadow animate-pulse-slow">Categorias</span> de Cursos
            </h2>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-center backdrop-blur-sm bg-dark-900/20 rounded-lg py-2 px-4 inline-block">
            Explore cursos organizados por áreas de interesse e <span className="text-secondary-300">encontre o conhecimento</span> que você precisa
          </p>
        </div>

        <CategoryGrid categories={formattedCourses
          .map(course => ({ 
            id: course.category_id || undefined, 
            name: course.category_name, 
            slug: course.category_slug 
          }))
          .filter(cat => Boolean(cat.id))
          .filter((cat, index, self) => 
            cat.id && self.findIndex(c => c.id === cat.id) === index
          )
        } />
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient and effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950 to-black"></div>
        
        {/* Animated circles background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 left-1/3 w-80 h-80 bg-gradient-to-br from-accent-600/20 to-primary-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary-600/20 to-accent-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 left-10 w-64 h-64 bg-gradient-to-br from-primary-600/15 to-secondary-600/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          
          {/* Animated pattern overlay */}
          <div className="absolute inset-0 bg-[url('/window.svg')] bg-repeat opacity-[0.03] animate-slide-slow"></div>
          
          {/* Geometric lines background */}
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className="w-[1000px] h-[1000px] border border-secondary-500/10 rounded-full animate-spin-very-slow"></div>
            <div className="absolute w-[800px] h-[800px] border border-primary-500/10 rounded-full animate-spin-very-slow" style={{animationDuration: '120s', animationDirection: 'reverse'}}></div>
            <div className="absolute w-[600px] h-[600px] border border-accent-500/10 rounded-full animate-spin-very-slow" style={{animationDuration: '90s'}}></div>
            <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full animate-spin-very-slow" style={{animationDuration: '60s', animationDirection: 'reverse'}}></div>
          </div>
          
          {/* Particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-secondary-400 rounded-full shadow-glow animate-ping-slow"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-primary-400 rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent-400 rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary-400/30 rounded-full shadow-glow animate-ping-slow" style={{animationDelay: '2s'}}></div>
          
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Decorative icon */}
            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/30 via-secondary-600/30 to-primary-600/30 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 to-primary-600/20 rounded-full blur-lg animate-spin-slow" style={{animationDuration: '10s'}}></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-secondary-600 rounded-full flex items-center justify-center shadow-lg shadow-accent-600/30 relative overflow-hidden">
                  {/* Inner texture */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:5px_5px]"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Orbiting particles */}
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{animationDuration: '5s'}}></div>
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-secondary-400 rounded-full transform translate-x-1/2 -translate-y-1/2 animate-orbit" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary-400 rounded-full transform -translate-x-1/2 translate-y-1/2 animate-orbit" style={{animationDuration: '6s', animationDelay: '0.5s'}}></div>
            </div>
            
            {/* Main heading with gradient */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block">
                <span className="bg-gradient-to-r from-accent-300 via-white to-secondary-300 bg-clip-text text-transparent animate-gradient-text">
                  Pronto para começar 
                </span>
                <br/>
                <span className="text-white">sua jornada<span className="text-accent-400">?</span></span>
                
                {/* Decorative underline */}
                <div className="h-1 w-40 md:w-60 bg-gradient-to-r from-accent-600 via-secondary-500 to-primary-600 rounded-full mx-auto mt-4"></div>
              </h2>
            </div>
            
            {/* Description text */}
            <div className="mb-12 max-w-2xl mx-auto">
              <p className="text-xl text-center text-gray-300 backdrop-blur-sm bg-dark-900/30 py-4 px-8 rounded-xl border border-accent-900/30 shadow-xl">
                Acesse nossos cursos e descubra um mundo de 
                <span className="relative inline-block px-2">
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-600/20 to-secondary-600/20 blur-sm rounded-md"></span>
                  <span className="relative text-accent-300 font-medium">conhecimentos</span>
                </span>
                que transformarão sua carreira hoje mesmo.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              {/* Primary button */}
              <Link 
                href="#cursos"
                className="group bg-gradient-to-r from-accent-600 via-secondary-600 to-primary-600 p-0.5 rounded-xl font-semibold shadow-lg shadow-accent-900/30
                       hover:shadow-accent-700/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300
                       relative overflow-hidden"
              >
                <div className="relative bg-dark-950 rounded-[0.7rem] px-8 py-4 transition-all duration-300 group-hover:bg-opacity-90 group-hover:bg-gradient-to-r group-hover:from-dark-900/95 group-hover:to-dark-950/95">
                  {/* Shine animation */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-500 to-secondary-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-white text-lg">Explorar Cursos</span>
                  </div>
                </div>
              </Link>
              
              {/* Secondary button */}
              <Link 
                href="/login"
                className="group bg-transparent border border-accent-700/50 text-white
                         px-8 py-4 rounded-xl font-semibold hover:border-accent-500
                         transition-all duration-300 flex items-center gap-2
                         relative overflow-hidden backdrop-blur-sm"
              >
                {/* Side illumination */}
                <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-400 via-secondary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-lg"></span>
                <span className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary-400 via-secondary-500 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-lg"></span>
                
                {/* Overlay flash */}
                <span className="absolute inset-0 bg-accent-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Icon with glow effect */}
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 bg-accent-500 rounded-full opacity-0 group-hover:opacity-30 blur-md animate-pulse-slow"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-400 group-hover:text-accent-300 transition-colors duration-300 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <span className="relative z-10 text-lg">Login</span>
                
                {/* Button highlight on hover */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-accent-500 to-primary-500 transform -translate-x-1/2 group-hover:w-4/5 transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Grid de categorias
function CategoryGrid({ categories }: { categories: { id?: string, name?: string, slug?: string }[] }) {
  const categoryColors = [
    { 
      from: "from-secondary-600", 
      to: "to-primary-600", 
      hover: "group-hover:text-secondary-300",
      bg: "bg-secondary-900/20",
      border: "group-hover:border-secondary-500/70",
      glow: "group-hover:shadow-secondary-700/30"
    },
    { 
      from: "from-accent-600", 
      to: "to-secondary-600", 
      hover: "group-hover:text-accent-300",
      bg: "bg-accent-900/20",
      border: "group-hover:border-accent-500/70",
      glow: "group-hover:shadow-accent-700/30"
    },
    { 
      from: "from-primary-600", 
      to: "to-accent-600", 
      hover: "group-hover:text-primary-300",
      bg: "bg-primary-900/20",
      border: "group-hover:border-primary-500/70",
      glow: "group-hover:shadow-primary-700/30"
    },
    { 
      from: "from-indigo-600", 
      to: "to-purple-600", 
      hover: "group-hover:text-indigo-300",
      bg: "bg-indigo-900/20",
      border: "group-hover:border-indigo-500/70",
      glow: "group-hover:shadow-indigo-700/30"
    }
  ];

  // Se não houver categorias, mostre uma mensagem
  if (!categories.length) {
    return (
      <div className="text-center p-10 bg-dark-800/50 border border-dark-700 rounded-lg animate-fade-in backdrop-blur-sm shadow-lg">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-secondary-900/30 rounded-full blur-xl"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary-700 to-secondary-900 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-secondary-400">Nenhuma categoria</h3>
        <p className="text-gray-300 max-w-lg mx-auto">
          Ainda não há categorias disponíveis.
        </p>
        <div className="h-0.5 w-24 bg-secondary-700 mx-auto mt-4"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
      {/* Decorative elements */}
      <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-secondary-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-64 h-64 bg-primary-900/10 rounded-full blur-3xl"></div>
      
      {categories.map((category, index) => {
        const colorSet = categoryColors[index % categoryColors.length];
        
        return (
          <Link
            key={category.id || index}
            href={category.slug ? `/categorias/${category.slug}` : '#'}
            className={`bg-dark-900/60 backdrop-blur-sm border border-dark-700 ${colorSet.border}
                     rounded-xl p-6 text-center hover:shadow-lg ${colorSet.glow}
                     transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 animate-fade-in
                     group relative overflow-hidden`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute inset-0 ${colorSet.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Decorative particles */}
            <div className="absolute top-[20%] right-[20%] w-1 h-1 bg-white rounded-full shadow-glow opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow"></div>
            <div className="absolute bottom-[30%] left-[25%] w-1 h-1 bg-white rounded-full shadow-glow opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative p-2">
              <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className={`relative w-20 h-20 mx-auto mb-5 bg-gradient-to-br ${colorSet.from} ${colorSet.to} rounded-2xl 
                            flex items-center justify-center text-white text-3xl font-bold
                            group-hover:shadow-lg transition-all duration-500 rotate-3
                            group-hover:-rotate-6 group-hover:scale-110 overflow-hidden z-10`}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <span className="relative z-10">{category.name?.[0] || '?'}</span>
                
                {/* Inner glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Corner shine effect */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-md rotate-45 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            <h3 className={`text-xl font-medium text-white mb-3 ${colorSet.hover} transition-all duration-300 relative z-10 group-hover:scale-105`}>
              {category.name || 'Categoria sem nome'}
              <div className="h-0.5 w-0 mx-auto bg-gradient-to-r from-white/40 to-white/0 group-hover:w-2/3 transition-all duration-300 mt-2"></div>
            </h3>
            
            {/* View indicator */}
            <div className="mt-4 relative">
              <span className={`text-xs px-3 py-1 rounded-full bg-dark-900/80 border border-dark-800/50 text-gray-400 group-hover:text-white inline-flex items-center gap-1 transition-all duration-300 group-hover:-translate-y-1`}>
                <span>Ver cursos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            
            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        );
      })}
    </div>
  );
}