'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definindo a interface para os objetos de categoria
interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Não foi possível carregar as categorias. Tente novamente mais tarde.');
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
      
      // Primeiro, verificar se há cursos associados a esta categoria
      const { data: coursesWithCategory, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('category_id', deleteId)
        .limit(1);
      
      if (coursesError) {
        console.error('Erro ao verificar cursos associados:', coursesError);
        throw new Error('Erro ao verificar dependências da categoria');
      }
      
      if (coursesWithCategory && coursesWithCategory.length > 0) {
        throw new Error('Não é possível excluir esta categoria porque há cursos associados a ela. Remova ou reclassifique os cursos primeiro.');
      }
      
      // Se não há cursos associados, prosseguir com a exclusão
      const { error } = await supabase
        .from('course_categories')
        .delete()
        .eq('id', deleteId);
      
      if (error) {
        console.error('Erro do Supabase ao excluir:', error);
        throw new Error(`Erro ao excluir categoria: ${error.message}`);
      }
      
      // Atualiza a lista removendo a categoria excluída
      setCategories(categories.filter(category => category.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      setError(null); // Limpar erro anterior se houver
      
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err);
      setError(err.message || 'Não foi possível excluir a categoria. Tente novamente.');
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Categorias</h1>
        <Link 
          href="/admin/categorias/nova" 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-500 hover:shadow-glow transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nova Categoria
        </Link>
      </div>

      {error && (
        <div className="bg-error-900/30 border-l-4 border-error-500 text-error-300 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando categorias...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="bg-dark-800 rounded-lg shadow overflow-hidden border border-dark-700">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-dark-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(category.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/categorias/${category.id}`} className="text-primary-400 hover:text-primary-300 mr-4">
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(category.id)} 
                      className="text-error-400 hover:text-error-300"
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
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-white mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-300 mb-4">Comece criando sua primeira categoria de cursos.</p>
          <Link
            href="/admin/categorias/nova"
            className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-600 transition-colors"
          >
            Criar Categoria
          </Link>
        </div>
      )}

      {/* Modal de Confirmação para Excluir */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 max-w-md w-full shadow-glow">
            <h3 className="text-lg font-bold mb-4 text-white">Confirmar exclusão</h3>
            <p className="mb-6 text-gray-300">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-dark-600 rounded shadow hover:bg-dark-700 text-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-error-700 text-white rounded shadow hover:bg-error-600 transition-colors"
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