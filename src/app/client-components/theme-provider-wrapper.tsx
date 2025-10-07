'use client';

import { ThemeProvider } from '@/lib/context/theme-context';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}