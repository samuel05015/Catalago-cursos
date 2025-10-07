'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definindo a interface para os objetos de curso
interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  image_url: string | null;
  price_display: string | null;
  category_id: string | null;
  category_name?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Buscar cursos com nome da categoria
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories:category_id (
            name
          )
        `)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Formatar dados para incluir o nome da categoria
      const formattedCourses = data?.map(course => ({
        ...course,
        category_name: course.course_categories?.name
      })) || [];
      
      setCourses(formattedCourses);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(id: string) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Excluir o curso
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', deleteId);
      
      if (error) throw error;
      
      // Atualizar a lista local
      setCourses(courses.filter(course => course.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Erro ao excluir curso:', err);
      setError('Ocorreu um erro ao excluir o curso.');
    }
  }

  async function togglePublishStatus(courseId: string, newStatus: boolean) {
    setUpdatingStatus(courseId);
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Atualizar status de publicação
      const { error } = await supabase
        .from('courses')
        .update({ is_published: newStatus })
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Atualizar a lista local
      setCourses(
        courses.map(course => 
          course.id === courseId 
            ? { ...course, is_published: newStatus } 
            : course
        )
      );

      // Mostrar feedback
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar status do curso:', err);
      setError('Ocorreu um erro ao atualizar o status do curso.');
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
        <Link 
          href="/admin/cursos/novo" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Novo Curso
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando cursos...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {course.image_url ? (
                        <div className="flex-shrink-0 h-10 w-16 mr-4">
                          <img 
                            src={course.image_url} 
                            alt={course.title} 
                            className="h-10 w-16 object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-16 bg-gray-200 rounded mr-4" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                          {course.is_featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Destacado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {course.short_description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {course.category_name || 'Sem categoria'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.price_display || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => togglePublishStatus(course.id, !course.is_published)}
                      disabled={updatingStatus === course.id}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        course.is_published 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${updatingStatus === course.id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {updatingStatus === course.id 
                        ? 'Atualizando...' 
                        : course.is_published ? 'Publicado' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/cursos/${course.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-500 mb-4">Comece criando seu primeiro curso.</p>
          <Link
            href="/admin/cursos/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Criar Curso
          </Link>
        </div>
      )}

      {/* Modal de Confirmação para Excluir */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded shadow hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}