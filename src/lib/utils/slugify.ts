// Funções utilitárias para geração de slugs únicos

import { createClient } from "../supabase/client";

/**
 * Converte um texto para formato de slug
 * - Converte para minúsculas
 * - Remove acentos
 * - Substitui espaços por hífens
 * - Remove caracteres especiais
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normaliza decomposição para lidar com acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove hífens duplicados
    .trim(); // Remove espaços no início e fim
};

/**
 * Gera um slug único para uma tabela específica
 * - Cria um slug base a partir do texto
 * - Verifica se já existe na tabela
 * - Se existir, adiciona um sufixo numérico
 * 
 * @param title - Texto para conversão em slug
 * @param table - Tabela onde verificar a unicidade (courses, course_categories, course_tags)
 * @param existingId - ID do item atual (para caso de edição)
 * @returns Slug único garantido
 */
export const generateUniqueSlug = async (
  title: string, 
  table: 'courses' | 'course_categories' | 'course_tags', 
  existingId?: string
): Promise<string> => {
  // Gera o slug base a partir do título
  const baseSlug = slugify(title);
  
  if (!baseSlug) return '';
  
  let isUnique = false;
  let counter = 1;
  let finalSlug = baseSlug;
  
  // Inicializa o cliente do Supabase
  const supabase = createClient();
  
  // Loop até encontrar um slug único
  while (!isUnique) {
    // Consulta o Supabase para verificar se o slug já existe
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar unicidade do slug:', error);
      throw error;
    }
    
    // Se não encontrou nada ou encontrou o mesmo item (caso de edição)
    if (!data || (existingId && data.id === existingId)) {
      isUnique = true;
    } else {
      // Adiciona um sufixo numérico e tenta novamente
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  
  return finalSlug;
};

/**
 * Gera um slug de forma síncrona (para preview em tempo real)
 * Útil para mostrar ao usuário como ficaria o slug antes de salvar
 * Não garante unicidade - apenas para visualização
 */
export const previewSlug = (text: string): string => {
  return slugify(text);
};