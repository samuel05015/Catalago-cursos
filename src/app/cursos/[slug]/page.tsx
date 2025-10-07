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
              <div className="bg-dark-900/80 backdrop-blur-sm p-8 rounded-xl border border-dark-700
                           shadow-lg shadow-accent-900/10 sticky top-24">
                {courseDetails.price_display && (
                  <div className="mb-6">
                    <span className="text-gray-300 text-sm">Investimento:</span>
                    <div className="text-3xl font-bold text-success-400 mt-1">
                      {courseDetails.price_display}
                    </div>
                  </div>
                )}
                
                {courseDetails.payment_url ? (
                  <a 
                    href={courseDetails.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-accent-600 to-secondary-600 text-white text-center py-4 px-6 
                             rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-900/20
                             transition-all duration-300 mb-6 border border-accent-500/20"
                  >
                    Inscrever-se Agora
                  </a>
                ) : (
                  <div className="bg-dark-800/80 text-gray-400 
                              text-center py-4 px-6 rounded-xl font-medium mb-6 border border-dark-700">
                    Em breve
                  </div>
                )}
                
                <div className="border-t border-dark-700/50 pt-6 mt-6">
                  <h3 className="font-semibold mb-4 text-white">
                    Informações do curso
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex justify-between">
                      <span>Categoria:</span>
                      <span className="font-medium text-accent-300">{courseDetails.category_name || 'Não categorizado'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Publicado:</span>
                      <span className="font-medium text-success-300">Disponível</span>
                    </li>
                  </ul>
                </div>
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