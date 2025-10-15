'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils/slug';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const { id: categoryId } = await params;
  const router = useRouter();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  async function fetchCategory() {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Categoria não encontrada');
      
      setCategory(data);
      setFormData({
        name: data.name,
        slug: data.slug
      });
    } catch (err) {
      console.error('Erro ao buscar categoria:', err);
      setError('Não foi possível carregar os dados da categoria.');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Atualizar slug automaticamente se o nome mudar e o slug não tiver sido editado manualmente
    if (name === 'name' && formData.slug === category?.slug) {
      setFormData(prev => ({ ...prev, slug: createSlug(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validação
      if (!formData.name.trim()) {
        throw new Error('O nome da categoria é obrigatório');
      }

      // Garantir que o slug seja válido
      const slug = formData.slug.trim() || createSlug(formData.name);

      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();

      // Verificar se já existe uma categoria com o mesmo slug (que não seja esta)
      const { data: existingCategory, error: checkError } = await supabase
        .from('course_categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', categoryId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar categoria existente');
      }

      if (existingCategory) {
        throw new Error('Já existe uma categoria com este nome/slug');
      }

      // Atualizar categoria
      const { error: updateError } = await supabase
        .from('course_categories')
        .update({
          name: formData.name,
          slug: slug
        })
        .eq('id', categoryId);

      if (updateError) throw new Error('Erro ao atualizar categoria');

      // Redirecionar para a lista de categorias
      router.push('/admin/categorias');
      router.refresh();
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao atualizar a categoria');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados da categoria...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded">
          <h2 className="text-lg font-bold mb-2">Categoria não encontrada</h2>
          <p>A categoria que você está tentando editar não foi encontrada.</p>
          <Link 
            href="/admin/categorias"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Voltar para lista de categorias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Editar Categoria</h1>
        <Link 
          href="/admin/categorias"
          className="text-gray-600 hover:text-gray-900"
        >
          Voltar para lista
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Nome da Categoria
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              placeholder="Digite o nome da categoria"
              disabled={saving}
              required
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="slug" 
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Slug (para URL)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              placeholder="nome-da-categoria"
              disabled={saving}
            />
            <p className="mt-1 text-sm text-gray-400">
              O slug é usado na URL. Se deixado em branco, será gerado automaticamente a partir do nome.
            </p>
          </div>

          <div className="flex items-center justify-end mt-6">
            <Link
              href="/admin/categorias"
              className="px-4 py-2 border border-gray-600 rounded shadow-sm text-gray-200 hover:bg-gray-700 mr-4"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Atualizar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}