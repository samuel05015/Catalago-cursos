'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils/slug';

// Interface para representar a categoria
interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Interface para representar a tag
interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Interface para o formulário de curso
interface CourseForm {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  image_url: string;
  payment_url: string;
  price_display: string;
  category_id: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  tags: string[];
}

export default function NewCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    image_url: '',
    payment_url: '',
    price_display: '',
    category_id: '',
    is_published: false,
    is_featured: false,
    sort_order: 0,
    tags: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Carregar categorias e tags ao montar o componente
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  // Atualizar slug automaticamente quando o título mudar
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: createSlug(formData.title) }));
    }
  }, [formData.title]);

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
      setError('Não foi possível carregar as categorias. Tente novamente mais tarde.');
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
      setError('Não foi possível carregar as tags. Tente novamente mais tarde.');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Tratar checkboxes
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } 
    // Tratar campos numéricos
    else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    }
    // Tratar outros campos
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const tagIndex = prev.tags.indexOf(tagId);
      if (tagIndex > -1) {
        // Remover tag
        const newTags = [...prev.tags];
        newTags.splice(tagIndex, 1);
        return { ...prev, tags: newTags };
      } else {
        // Adicionar tag
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir edição manual do slug
    const { value } = e.target;
    // Forçar formato de slug
    const formattedSlug = createSlug(value);
    setFormData(prev => ({ ...prev, slug: formattedSlug }));
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
        
      return publicURL.publicUrl;
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      throw new Error('Falha ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!formData.title.trim()) {
        throw new Error('O título do curso é obrigatório');
      }
      if (!formData.short_description.trim()) {
        throw new Error('A descrição curta é obrigatória');
      }
      if (!formData.category_id) {
        throw new Error('Selecione uma categoria');
      }

      // Upload da imagem (se houver)
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage() || '';
      }

      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Inserir o curso
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert([
          {
            title: formData.title,
            slug: formData.slug || createSlug(formData.title),
            short_description: formData.short_description,
            full_description: formData.full_description,
            image_url: imageUrl,
            payment_url: formData.payment_url,
            price_display: formData.price_display,
            category_id: formData.category_id,
            is_published: formData.is_published,
            is_featured: formData.is_featured,
            sort_order: formData.sort_order
          }
        ])
        .select()
        .single();
      
      if (courseError) throw new Error(`Erro ao criar curso: ${courseError.message}`);

      // Inserir relações com tags (se houver)
      if (formData.tags.length > 0) {
        const tagMappings = formData.tags.map(tagId => ({
          course_id: course.id,
          tag_id: tagId
        }));

        const { error: tagMapError } = await supabase
          .from('course_tag_map')
          .insert(tagMappings);

        if (tagMapError) {
          console.error('Erro ao associar tags:', tagMapError);
          // Não falhar completamente se as tags não forem associadas
        }
      }

      // Redirecionar para a lista de cursos
      router.push('/admin/cursos');
      router.refresh();
    } catch (err) {
      console.error('Erro ao criar curso:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao criar o curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Novo Curso</h1>
          <Link 
            href="/admin/cursos"
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            Voltar para lista
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 p-4 mb-6 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="bg-dark-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-dark-700">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                  Título do Curso <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="Ex: Desenvolvimento Web com React"
                  required
                />
              </div>
              
              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-200 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="Ex: desenvolvimento-web-com-react"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Identificador único para URL. Será gerado automaticamente se deixado em branco.
                </p>
              </div>
              
              {/* Descrição Curta */}
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-200 mb-1">
                  Descrição Curta <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="Uma breve descrição do curso (1-2 frases)"
                  required
                />
              </div>
              
              {/* Descrição Completa */}
              <div>
                <label htmlFor="full_description" className="block text-sm font-medium text-gray-200 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  id="full_description"
                  name="full_description"
                  value={formData.full_description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="Descrição detalhada do curso. Suporta formatação markdown."
                />
                <p className="mt-1 text-sm text-gray-400">
                  Você pode usar markdown para formatação.
                </p>
              </div>
              
              {/* URL de Pagamento */}
              <div>
                <label htmlFor="payment_url" className="block text-sm font-medium text-gray-200 mb-1">
                  URL de Inscrição/Pagamento
                </label>
                <input
                  type="url"
                  id="payment_url"
                  name="payment_url"
                  value={formData.payment_url}
                  onChange={handleChange}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="https://exemplo.com/pagamento"
                />
              </div>
              
              {/* Preço (Display) */}
              <div>
                <label htmlFor="price_display" className="block text-sm font-medium text-gray-200 mb-1">
                  Preço/Valor (Texto)
                </label>
                <input
                  type="text"
                  id="price_display"
                  name="price_display"
                  value={formData.price_display}
                  onChange={handleChange}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  placeholder="Ex: R$ 97,00 ou Grátis"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Categoria */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-200 mb-1">
                  Categoria <span className="text-red-400">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500"
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
                <label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 p-3 border border-dark-600 rounded min-h-[100px]">
                  {availableTags.length > 0 ? (
                    availableTags.map(tag => (
                      <div 
                        key={tag.id} 
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          formData.tags.includes(tag.id)
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                        }`}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhuma tag disponível. Crie tags primeiro.</p>
                  )}
                </div>
              </div>
              
              {/* Upload de Imagem */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-200 mb-1">
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
                    className="w-full"
                  />
                  <p className="text-sm text-gray-400">
                    Recomendado: JPG, PNG - proporção 16:9 - máximo 5 MB
                  </p>
                  
                  {isUploading && (
                    <div className="w-full bg-dark-700 rounded h-2 mt-2">
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
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-200 mb-1">
                  URL da Imagem (alternativo ao upload)
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full p-2 border border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500"
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
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm text-gray-200">
                    Publicar curso imediatamente
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-gray-200">
                    Destacar curso
                  </label>
                </div>
                
                <div>
                  <label htmlFor="sort_order" className="block text-sm font-medium text-gray-200 mb-1">
                    Ordem de exibição
                  </label>
                  <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="w-24 p-2 border border-dark-600 bg-dark-700 text-white rounded focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    Cursos com valores menores aparecem primeiro
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-8 space-x-4 border-t pt-6">
            <Link
              href="/admin/cursos"
              className="px-4 py-2 border border-dark-600 rounded shadow-sm text-gray-200 hover:bg-dark-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-4 py-2 bg-primary-600 text-white rounded shadow-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Curso'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
