'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils/slug';

export default function NewTagPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar dados
      if (!formData.name.trim()) {
        throw new Error('O nome da tag é obrigatório');
      }

      const slug = createSlug(formData.name);

      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();

      // Verificar se já existe uma tag com o mesmo slug
      const { data: existingTag, error: checkError } = await supabase
        .from('course_tags')
        .select('id')
        .eq('slug', slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar tag existente');
      }

      if (existingTag) {
        throw new Error('Já existe uma tag com este nome');
      }

      // Inserir nova tag
      const { data, error: insertError } = await supabase
        .from('course_tags')
        .insert([
          { name: formData.name, slug }
        ])
        .select();

      if (insertError) throw new Error('Erro ao criar tag');

      // Redirecionar para a lista de tags
      router.push('/admin/tags');
      router.refresh();
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao criar a tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nova Tag</h1>
        <Link 
          href="/admin/tags"
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
              Nome da Tag
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
              placeholder="Digite o nome da tag"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-400">
              O slug será gerado automaticamente a partir do nome.
            </p>
          </div>

          <div className="flex items-center justify-end mt-6">
            <Link
              href="/admin/tags"
              className="px-4 py-2 border border-gray-600 rounded shadow-sm text-gray-200 hover:bg-gray-700 mr-4"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded shadow-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}