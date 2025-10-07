/**
 * Utilitário para criar slugs a partir de strings
 * @param text Texto para converter em slug
 * @returns Uma string formatada como slug (minúsculas, sem acentos, com hífens)
 */
export function createSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Normaliza para decomposição canônica
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais exceto espaços e hífens
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove múltiplos hífens sequenciais
}