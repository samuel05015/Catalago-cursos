'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils/slug';

// Interfaces
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  image_url: string | null;
  payment_url: string | null;
  price_display: string | null;
  category_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [courseTags, setCourseTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Carregar dados do curso
  useEffect(() => {
    loadCourseData();
    fetchCategories();
    fetchTags();
  }, [courseId]);

  async function loadCourseData() {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Buscar dados do curso
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      if (!courseData) throw new Error('Curso não encontrado');
      
      setCourse(courseData);
      setImagePreview(courseData.image_url);
      
      // Buscar tags associadas ao curso
      const { data: tagsData, error: tagsError } = await supabase
        .from('course_tag_map')
        .select('tag_id')
        .eq('course_id', courseId);
      
      if (tagsError) throw tagsError;
      
      const tagIds = tagsData?.map(tag => tag.tag_id) || [];
      setCourseTags(tagIds);
      
    } catch (err) {
      console.error('Erro ao carregar curso:', err);
      setError('Não foi possível carregar os dados do curso. Verifique se o ID é válido.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
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
    }
  }

  async function fetchTags() {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const { data, error } = await supabase
        .from('course_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setAvailableTags(data || []);
    } catch (err) {
      console.error('Erro ao buscar tags:', err);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!course) return;
    
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Tratar checkboxes
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setCourse(prev => prev ? { ...prev, [name]: checkbox.checked } : null);
    } 
    // Tratar campos numéricos
    else if (type === 'number') {
      setCourse(prev => prev ? { ...prev, [name]: parseInt(value) } : null);
    }
    // Tratar outros campos
    else {
      setCourse(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setCourseTags(prev => {
      const tagIndex = prev.indexOf(tagId);
      if (tagIndex > -1) {
        // Remover tag
        const newTags = [...prev];
        newTags.splice(tagIndex, 1);
        return newTags;
      } else {
        // Adicionar tag
        return [...prev, tagId];
      }
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir edição manual do slug
    const { value } = e.target;
    // Forçar formato de slug
    const formattedSlug = createSlug(value);
    setCourse(prev => prev ? { ...prev, slug: formattedSlug } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo e tamanho da imagem
    if (!file.type.startsWith('image/')) {
      setError('O arquivo deve ser uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5 MB
      setError('A imagem deve ter menos de 5 MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function uploadImage() {
    if (!imageFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `courses/${fileName}`;
      
      // Upload da imagem para o Storage do Supabase
      const { data, error } = await supabase
        .storage
        .from('course-images') // Bucket do Supabase (precisa ser criado no painel)
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type
        });
      
      if (error) throw error;
      
      // Gerar URL pública para a imagem
      const { data: publicURL } = supabase
        .storage
        .from('course-images')
        .getPublicUrl(filePath);
        
      setUploadProgress(100);
      return publicURL.publicUrl;
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      throw new Error('Falha ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    
    setSaving(true);
    setError(null);

    try {
      // Validação básica
      if (!course.title.trim()) {
        throw new Error('O título do curso é obrigatório');
      }
      if (!course.short_description.trim()) {
        throw new Error('A descrição curta é obrigatória');
      }
      if (!course.category_id) {
        throw new Error('Selecione uma categoria');
      }

      // Upload da imagem (se houver)
      let imageUrl = course.image_url;
      if (imageFile) {
        imageUrl = await uploadImage() || course.image_url;
      }

      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Atualizar o curso
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          title: course.title,
          slug: course.slug || createSlug(course.title),
          short_description: course.short_description,
          full_description: course.full_description,
          image_url: imageUrl,
          payment_url: course.payment_url,
          price_display: course.price_display,
          category_id: course.category_id,
          is_published: course.is_published,
          is_featured: course.is_featured,
          sort_order: course.sort_order
        })
        .eq('id', courseId);
      
      if (updateError) throw new Error(`Erro ao atualizar curso: ${updateError.message}`);

      // Excluir relações de tags existentes
      const { error: deleteTagsError } = await supabase
        .from('course_tag_map')
        .delete()
        .eq('course_id', courseId);
      
      if (deleteTagsError) {
        console.error('Erro ao excluir tags existentes:', deleteTagsError);
      }

      // Inserir novas relações com tags (se houver)
      if (courseTags.length > 0) {
        const tagMappings = courseTags.map(tagId => ({
          course_id: courseId,
          tag_id: tagId
        }));

        const { error: tagMapError } = await supabase
          .from('course_tag_map')
          .insert(tagMappings);

        if (tagMapError) {
          console.error('Erro ao associar tags:', tagMapError);
        }
      }

      // Redirecionar para a lista de cursos
      router.push('/admin/cursos');
      router.refresh();
    } catch (err) {
      console.error('Erro ao atualizar curso:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao atualizar o curso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do curso...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded">
          <h2 className="text-lg font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <Link 
            href="/admin/cursos"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Voltar para lista de cursos
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded">
          <h2 className="text-lg font-bold mb-2">Curso não encontrado</h2>
          <p>Não foi possível encontrar um curso com o ID especificado.</p>
          <Link 
            href="/admin/cursos"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Voltar para lista de cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Editar Curso</h1>
        <Link 
          href="/admin/cursos"
          className="text-primary-400 hover:text-primary-300 transition-colors"
        >
          Voltar para lista
        </Link>
      </div>

      {error && (
        <div className="bg-error-900/30 border-l-4 border-error-500 text-error-300 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-md border border-dark-700">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Título do Curso <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Desenvolvimento Web com React"
                  required
                />
              </div>
              
              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-white mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={course.slug}
                  onChange={handleSlugChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: desenvolvimento-web-com-react"
                />
                <p className="mt-1 text-sm text-gray-300">
                  Identificador único para URL.
                </p>
              </div>
              
              {/* Descrição Curta */}
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-white mb-1">
                  Descrição Curta <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  value={course.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Uma breve descrição do curso (1-2 frases)"
                  required
                />
              </div>
              
              {/* Descrição Completa */}
              <div>
                <label htmlFor="full_description" className="block text-sm font-medium text-white mb-1">
                  Descrição Completa
                </label>
                <textarea
                  id="full_description"
                  name="full_description"
                  value={course.full_description || ''}
                  onChange={handleChange}
                  rows={8}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Descrição detalhada do curso. Suporta formatação markdown."
                />
                <p className="mt-1 text-sm text-gray-300">
                  Você pode usar markdown para formatação.
                </p>
              </div>
              
              {/* URL de Pagamento */}
              <div>
                <label htmlFor="payment_url" className="block text-sm font-medium text-white mb-1">
                  URL de Inscrição/Pagamento
                </label>
                <input
                  type="url"
                  id="payment_url"
                  name="payment_url"
                  value={course.payment_url || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://exemplo.com/pagamento"
                />
              </div>
              
              {/* Preço (Display) */}
              <div>
                <label htmlFor="price_display" className="block text-sm font-medium text-white mb-1">
                  Preço/Valor (Texto)
                </label>
                <input
                  type="text"
                  id="price_display"
                  name="price_display"
                  value={course.price_display || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: R$ 97,00 ou Grátis"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Categoria */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-white mb-1">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={course.category_id || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-500 rounded min-h-[100px] bg-gray-700">
                  {availableTags.length > 0 ? (
                    availableTags.map(tag => (
                      <div 
                        key={tag.id} 
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          courseTags.includes(tag.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300 text-sm">Nenhuma tag disponível. Crie tags primeiro.</p>
                  )}
                </div>
              </div>
              
              {/* Upload de Imagem */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-white mb-1">
                  Imagem de Capa
                </label>
                <div className="space-y-2">
                  {imagePreview && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-white cursor-pointer file:bg-gray-600 file:border-0 file:text-white file:p-2 file:rounded file:cursor-pointer"
                  />
                  <p className="text-sm text-gray-300">
                    Recomendado: JPG, PNG - proporção 16:9 - máximo 5 MB
                  </p>
                  
                  {isUploading && (
                    <div className="w-full bg-dark-600 rounded h-2 mt-2">
                      <div 
                        className="bg-primary-600 h-2 rounded" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* URL da imagem (alternativa) */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-white mb-1">
                  URL da Imagem (alternativo ao upload)
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={course.image_url || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              {/* Checkboxes e ordem */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={course.is_published}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm text-white">
                    Publicar curso
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={course.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-white">
                    Destacar curso
                  </label>
                </div>
                
                <div>
                  <label htmlFor="sort_order" className="block text-sm font-medium text-white mb-1">
                    Ordem de exibição
                  </label>
                  <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    value={course.sort_order}
                    onChange={handleChange}
                    className="w-24 p-2 border border-gray-500 rounded bg-gray-700 text-white focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                  />
                  <p className="mt-1 text-sm text-gray-300">
                    Cursos com valores menores aparecem primeiro
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-8 space-x-4 border-t border-dark-700 pt-6">
            <Link
              href="/admin/cursos"
              className="px-4 py-2 border border-dark-600 rounded-lg shadow-sm text-gray-300 hover:bg-dark-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || isUploading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-500 hover:shadow-glow transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Atualizar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}