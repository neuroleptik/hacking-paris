import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../../app/globals.css';

import { cn } from '@/lib/utils';

import { Footer } from './components/footer';
import { Navbar } from './components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Club War - Ultimate Fan Loyalty Platform',
  description:
    'Stake tokens with fellow fans to power your club to victory. Compete in global rankings, join organizations, and unlock exclusive rewards on the Chiliz blockchain.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={cn('bg-black antialiased', inter.className)}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
