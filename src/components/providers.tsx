'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster 
          closeButton 
          position="top-right" 
          expand={false} 
          theme="light"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#000000',
              border: '1px solid #E5E5E5',
              borderRadius: '0px', // Rectangular look
              fontFamily: 'inherit',
            },
            className: 'font-medium uppercase tracking-wider text-xs',
          }} 
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
