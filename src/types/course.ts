// Tipos e interfaces relacionadas aos cursos

// Tipo principal para um curso
export interface Course {
  // Campos principais
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  image_url?: string | null;
  payment_url?: string | null;
  price_display?: string | null;
  
  // Relacionamentos
  category_id?: string | null;
  category?: Category | null; // Para dados aninhados
  category_name?: string | null; // Para facilitar o acesso ao nome da categoria
  category_slug?: string | null; // Para facilitar o acesso ao slug da categoria
  tags?: Tag[]; // Para dados aninhados
  
  // Flags de status
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  
  // Autor/proprietário
  owner_id: string;
}

// Tipo para categoria de curso
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  course_count?: number; // Opcional, para dados agregados
}

// Tipo para tag de curso
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  course_count?: number; // Opcional, para dados agregados
}

// Tipo para mapeamento de curso-tag
export interface CourseTagMap {
  course_id: string;
  tag_id: string;
}

// Tipo para analytics de cliques
export interface AnalyticsClick {
  id: number;
  course_id: string;
  clicked_at: string;
  ip_hash?: string | null;
  user_agent?: string | null;
}

// Tipos para parâmetros de API

// Parâmetros para busca de cursos
export interface CourseSearchParams {
  page?: number;
  per_page?: number;
  category?: string; // slug da categoria
  tag?: string; // slug da tag
  search?: string;
  includeUnpublished?: boolean; // para admin
}

// Tipo para resposta da API de listagem de cursos
export interface CourseListResponse {
  courses: Course[];
  total_pages: number;
  total_count: number;
}

// Tipo para dados de criação/atualização de curso
export interface CourseFormData {
  title: string;
  short_description?: string;
  full_description?: string;
  image_url?: string;
  payment_url?: string;
  price_display?: string;
  category_id?: string | null;
  tag_ids?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

// Tipo para dados de publicação/destaque de curso
export interface CourseStatusUpdate {
  is_published?: boolean;
  is_featured?: boolean;
}

// Tipo para estatísticas de curso
export interface CourseStats {
  course_id: string;
  course_title: string;
  total_clicks: number;
  recent_clicks: number; // últimos 7 dias
}

// Tipo para dados de upload de imagem
export interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
  mimetype: string;
}