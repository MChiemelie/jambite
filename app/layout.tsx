import './globals.css';
import React from 'react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/utilities';
import PracticeProvider from '@/providers/practiceProvider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <PracticeProvider>{children}</PracticeProvider>
      </body>
    </html>
  );
}
