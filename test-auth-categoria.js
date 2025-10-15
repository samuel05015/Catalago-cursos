// Teste de autenticação - Execute no console do navegador na página admin
// ou crie este arquivo como test-auth.js e execute com node

const testAuth = async () => {
  try {
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();
    
    // Verificar usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Erro ao verificar usuário:', userError);
      return;
    }
    
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }
    
    console.log('Usuário logado:', user.email);
    
    // Testar inserção de categoria
    const { data, error } = await supabase
      .from('course_categories')
      .insert([
        { name: 'Teste Categoria', slug: 'teste-categoria' }
      ])
      .select();
      
    if (error) {
      console.error('Erro ao inserir categoria:', error);
    } else {
      console.log('Categoria inserida com sucesso:', data);
      
      // Limpar o teste
      const { error: deleteError } = await supabase
        .from('course_categories')
        .delete()
        .eq('slug', 'teste-categoria');
        
      if (deleteError) {
        console.error('Erro ao limpar teste:', deleteError);
      } else {
        console.log('Teste limpo com sucesso');
      }
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Se estiver no Node.js, descomente a linha abaixo:
// testAuth();

// Se estiver no navegador, execute: testAuth()