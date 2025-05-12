import { Metadata } from 'next';
import { lexend } from '@/fonts';
import { Theme } from '@/providers';
import './globals.css';
import { ReactScan } from '@/components/dev';

export const metadata: Metadata = {
  title: 'Jambite - CBT with AI',
  description: 'Jambite - Ace JAMB with AI assisted CBT Practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.className}`} suppressHydrationWarning>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
