import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

// Metadata para a página
export const metadata: Metadata = {
  title: 'Login - Catálogo de Cursos',
  description: 'Faça login ou crie sua conta para acessar a plataforma.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/window.svg')] bg-no-repeat bg-center opacity-5"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-600 to-secondary-600 rounded-full 
                       flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-white to-secondary-400">
            Bem-vindo
          </h1>
          <p className="text-gray-300 mb-2">
            Faça login ou crie sua conta para acessar a plataforma
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-accent-600 to-secondary-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-dark-900/40 backdrop-blur-sm rounded-xl border border-dark-700 shadow-lg p-8 animate-fade-in">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}