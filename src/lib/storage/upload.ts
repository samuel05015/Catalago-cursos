// Funções para upload e gerenciamento de imagens no Supabase Storage

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../supabase/client';

// Nome do bucket no Supabase Storage
const BUCKET_NAME = 'course-images';

// Tipos permitidos de arquivo
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Tamanho máximo do arquivo em bytes (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * Faz validação básica do arquivo
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Verificar tipo de arquivo
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  // Verificar tamanho do arquivo
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Faz upload de uma imagem para o Supabase Storage
 */
export const uploadImage = async (file: File): Promise<{ url: string; path: string }> => {
  // Validar o arquivo
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Inicializar cliente do Supabase
  const supabase = createClient();
  
  // Fazer o upload
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600', // 1 hora de cache
      upsert: false, // Não sobrescrever se existir
    });

  // Verificar erro
  if (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }

  // Obter URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
  };
};

/**
 * Remove uma imagem do Storage
 */
export const deleteImage = async (path: string): Promise<void> => {
  // Extrair o caminho do arquivo da URL ou usar o caminho direto
  const filePath = path.includes('/') 
    ? path.split('/').pop()! 
    : path;

  // Inicializar cliente do Supabase
  const supabase = createClient();
  
  // Remover a imagem
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Erro ao remover a imagem:', error);
    throw new Error(`Erro ao remover imagem: ${error.message}`);
  }
};