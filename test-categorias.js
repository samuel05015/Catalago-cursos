// Teste para verificar se as categorias estão sendo retornadas
// Execute este arquivo ou copie o código para o console do navegador

const testCategorias = async () => {
  try {
    console.log('Testando busca de categorias...');
    
    // Simular a mesma consulta da página
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();
    
    const response = await supabase
      .from('course_categories')
      .select('*')
      .order('name', { ascending: true });
    
    console.log('Resposta do Supabase:', response);
    console.log('Dados:', response.data);
    console.log('Erro:', response.error);
    console.log('Quantidade de categorias:', response.data?.length || 0);
    
    if (response.data && response.data.length > 0) {
      console.log('Categorias encontradas:');
      response.data.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (slug: ${cat.slug})`);
      });
    }
    
    // Testar consulta específica para "Tecnologia"
    const techResponse = await supabase
      .from('course_categories')
      .select('*')
      .eq('slug', 'tecnologia');
      
    console.log('Consulta específica "tecnologia":', techResponse);
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Se estiver no navegador, execute: testCategorias()
console.log('Para testar, execute: testCategorias()');