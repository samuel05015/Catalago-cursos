// Funções para renderização segura de Markdown

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuração do parser markdown
 */
const setupMarkdown = () => {
  // Configurações gerais do marked
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Quebras de linha correspondem a quebras reais
    pedantic: false, // Não ser muito rigoroso quanto à especificação original do markdown
    silent: false, // Não mostrar erros no console
  });

  // Opcional: extensões personalizadas podem ser adicionadas aqui
};

/**
 * Sanitiza HTML para prevenir XSS
 */
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    // Configurações de sanitização
    ALLOWED_TAGS: [
      // Tags HTML básicas e seguras
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'b', 'i', 'strong', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', // Para links
      'src', 'alt', 'title', 'width', 'height', // Para imagens
      'class', 'id', // Para estilização
    ],
    // Forçar todos os links a abrirem em nova aba
    FORBID_ATTR: ['style', 'onerror', 'onload'],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Renderiza markdown em HTML sanitizado
 */
export const renderMarkdown = (content?: string | null): string => {
  if (!content) return '';
  
  // Configurar o marked se ainda não estiver configurado
  setupMarkdown();
  
  // Converter markdown para HTML
  const html = marked.parse(content);
  
  // Sanitizar o HTML resultante
  return sanitizeHtml(String(html));
};

/**
 * Extrai e sanitiza uma prévia do texto (sem HTML)
 */
export const getMarkdownPreview = (content?: string | null, maxLength: number = 160): string => {
  if (!content) return '';
  
  // Remover marcações markdown comuns
  let plainText = content
    .replace(/#{1,6}\s?/g, '') // Remover headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remover negrito
    .replace(/\*(.+?)\*/g, '$1') // Remover itálico
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Substituir links por apenas o texto
    .replace(/!\[(.+?)\]\(.+?\)/g, '') // Remover imagens
    .replace(/`(.+?)`/g, '$1') // Remover código inline
    .replace(/```[\s\S]+?```/g, '') // Remover blocos de código
    .replace(/\n/g, ' ') // Substituir quebras de linha por espaços
    .replace(/\s+/g, ' ') // Normalizar espaços
    .trim();
  
  // Limitar ao tamanho máximo
  if (plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
};