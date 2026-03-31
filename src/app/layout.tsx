import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const oswald = Oswald({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AVREN — Premium Outdoor & Streetwear',
  description: 'A high-end, scalable eCommerce platform inspired by minimal, bold, immersive design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
