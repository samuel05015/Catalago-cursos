import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Importando o wrapper do Navigation que é um Client Component
import NavigationWrapper from "@/app/client-components/navigation-wrapper";
import { ThemeProviderWrapper } from "@/app/client-components/theme-provider-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catálogo de Cursos",
  description: "Explore nosso catálogo de cursos online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col
                   bg-dark-900 text-gray-100
                   transition-colors duration-300`}
      >
        <ThemeProviderWrapper>
          <NavigationWrapper />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-dark-800 border-t border-accent-800/50 p-6 text-center text-gray-300">
            <div className="container mx-auto">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Catálogo de Cursos - Todos os direitos reservados
              </p>
              <p className="text-xs mt-2 text-accent-400">
                Desenvolvido com Next.js, Tailwind e Supabase
              </p>
            </div>
          </footer>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
