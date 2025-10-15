import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { marked } from 'marked';

// Interface para os detalhes do curso
interface CourseDetails {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  image_url: string | null;
  payment_url: string | null;
  price_display: string | null;
  is_featured: boolean;
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
  tags?: { id: string; name: string; slug: string }[];
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  // Obter o slug do curso a partir dos parâmetros da URL
  const { slug } = params;
  
  // Buscar detalhes do curso no Supabase
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  // Buscar o curso pelo slug
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_categories:category_id (
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  // Se o curso não for encontrado ou não estiver publicado, retornar 404
  if (error || !course) {
    return notFound();
  }
  
  // Buscar as tags associadas ao curso
  const { data: tagRelations } = await supabase
    .from('course_tag_map')
    .select(`
      tag_id,
      course_tags:tag_id (
        id,
        name,
        slug
      )
    `)
    .eq('course_id', course.id);
  
  const tags = tagRelations?.map(relation => relation.course_tags) || [];
  
  // Formatar o curso com informações de categoria e tags
  const courseDetails: CourseDetails = {
    ...course,
    category_name: course.course_categories?.name,
    category_slug: course.course_categories?.slug,
    tags
  };
  
  // Processar markdown na descrição completa, se houver
  const htmlDescription = courseDetails.full_description 
    ? marked.parse(courseDetails.full_description) as string
    : '';
  
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-400 transition-colors">Home</Link>
          <span className="mx-2 text-dark-600">/</span>
          <Link href="/#cursos" className="hover:text-accent-400 transition-colors">Cursos</Link>
          {courseDetails.category_slug && (
            <>
              <span className="mx-2 text-dark-600">/</span>
              <Link 
                href={`/categorias/${courseDetails.category_slug}`} 
                className="hover:text-accent-400 transition-colors"
              >
                {courseDetails.category_name}
              </Link>
            </>
          )}
          <span className="mx-2 text-dark-600">/</span>
          <span className="text-white">{courseDetails.title}</span>
        </div>
      </div>
      
      <div className="bg-dark-950/40 backdrop-blur rounded-xl shadow-lg overflow-hidden max-w-7xl mx-auto mb-12 border border-dark-700">
        {/* Header com imagem e título */}
        <div className="relative">
          {courseDetails.image_url ? (
            <div className="w-full h-72 md:h-96 lg:h-[500px] relative">
              <Image 
                src={courseDetails.image_url}
                alt={courseDetails.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
            </div>
          ) : (
            <div className="w-full h-72 md:h-96 bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center">
              <span className="text-gray-400">Imagem não disponível</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black to-transparent text-white">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-200 to-white">{courseDetails.title}</h1>
              <div className="flex flex-wrap gap-3 mb-2">
                {courseDetails.category_name && (
                  <span className="bg-accent-900/70 text-accent-100 text-sm px-4 py-1.5 rounded-full border border-accent-700/50 backdrop-blur-sm">
                    {courseDetails.category_name}
                  </span>
                )}
                {courseDetails.is_featured && (
                  <span className="bg-secondary-900/70 text-secondary-100 text-sm px-4 py-1.5 rounded-full border border-secondary-700/50 backdrop-blur-sm">
                    Destaque
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Conteúdo do curso */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Coluna principal */}
            <div className="lg:w-2/3">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white border-b border-accent-700/30 pb-2">
                  Sobre o curso
                </h2>
                <p className="text-gray-100 text-lg mb-8 leading-relaxed">
                  {courseDetails.short_description}
                </p>
                
                {htmlDescription && (
                  <div 
                    className="prose dark:prose-invert prose-lg max-w-none 
                              prose-headings:text-white
                              prose-headings:border-b prose-headings:border-accent-700/30 prose-headings:pb-2
                              prose-p:text-gray-200
                              prose-a:text-accent-400 hover:prose-a:text-accent-300 prose-a:transition-colors
                              prose-strong:text-accent-200
                              prose-code:bg-dark-800 prose-code:text-secondary-300
                              prose-pre:bg-dark-800 prose-pre:border prose-pre:border-dark-700"
                    dangerouslySetInnerHTML={{ __html: htmlDescription }}
                  />
                )}
              </div>
              
              {courseDetails.tags && courseDetails.tags.length > 0 && (
                <div className="mb-8 pb-8 border-t border-dark-700/50 pt-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    Tags relacionadas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {courseDetails.tags.map(tag => (
                      <Link 
                        key={tag.id} 
                        href={`/tags/${tag.slug}`}
                        className="bg-dark-800/70 border border-dark-700 
                                text-gray-200 px-4 py-2 rounded-full text-sm 
                                hover:bg-dark-700 hover:border-accent-700/50 hover:text-accent-200 transition-all"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 lg:mt-0">
              <div className="bg-gradient-to-b from-dark-900/90 via-dark-800/80 to-dark-900/90 
                           backdrop-blur-lg p-8 rounded-2xl border border-emerald-700/20
                           shadow-2xl shadow-emerald-900/20 sticky top-24 relative overflow-hidden">
                {/* Efeito de brilho de fundo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                {courseDetails.price_display && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/20 to-green-900/20 
                              border border-emerald-700/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-emerald-200 text-sm font-medium">Investimento especial:</span>
                    </div>
                    <div className="text-4xl font-black text-emerald-400 drop-shadow-lg">
                      {courseDetails.price_display?.startsWith('R$') 
                        ? courseDetails.price_display 
                        : `R$ ${courseDetails.price_display}`
                      }
                    </div>
                    <p className="text-emerald-300/80 text-sm mt-2">
                      ✨ Valor promocional por tempo limitado
                    </p>
                  </div>
                )}
                
                {courseDetails.payment_url ? (
                  <div className="space-y-4 mb-6">
                    {/* Botão principal de inscrição - VERDE */}
                    <a 
                      href={courseDetails.payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 
                               hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600
                               text-white text-center py-5 px-8 rounded-2xl font-bold text-lg
                               shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-500/30
                               transform hover:-translate-y-1 hover:scale-105 
                               transition-all duration-300 border border-emerald-400/30
                               relative overflow-hidden group animate-pulse"
                    >
                      {/* Efeito de brilho */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                    opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                      
                      {/* Ícone e texto */}
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>INSCREVER-SE AGORA</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </a>
                    
                    {/* Botão secundário - Mais informações */}
                    <button 
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-700 
                               hover:from-gray-700 hover:to-gray-600
                               text-gray-200 hover:text-white text-center py-3 px-6 
                               rounded-xl font-medium border border-gray-600/50 hover:border-gray-500
                               transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Mais Informações</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 
                              border border-amber-600/30 text-amber-200 
                              text-center py-5 px-6 rounded-2xl font-medium mb-6 
                              backdrop-blur-sm relative overflow-hidden">
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Em breve - Aguarde o lançamento!</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-emerald-700/30 pt-6 mt-6">
                  <h3 className="font-bold mb-6 text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Informações do curso
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 
                                  border border-blue-700/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span className="text-gray-300">Categoria:</span>
                      </div>
                      <span className="font-bold text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/50">
                        {courseDetails.category_name || 'Não categorizado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 
                                  border border-emerald-700/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-300">Status:</span>
                      </div>
                      <span className="font-bold text-emerald-300 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-700/50 
                                   animate-pulse">
                        🟢 Disponível
                      </span>
                    </div>
                    
                    {courseDetails.is_featured && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 
                                    border border-amber-700/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <span className="text-gray-300">Destaque:</span>
                        </div>
                        <span className="font-bold text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50 
                                     animate-bounce">
                          ⭐ Curso em destaque
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                </div> {/* Fechar div z-10 */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6 mb-12">
        <div className="text-center">
          <Link
            href="/#cursos"
            className="inline-flex items-center text-accent-400 hover:text-accent-300 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para todos os cursos
          </Link>
        </div>
      </div>
    </div>
  );
}