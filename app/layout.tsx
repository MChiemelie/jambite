import { Metadata } from 'next';
import { lexend } from '@/fonts';
import { Practice, Theme } from '@/providers';
import './globals.css';
import { ReactScan } from '@/components/dev';

export const metadata: Metadata = {
  title: 'Jambite - Practice with AI',
  description: 'Jambite - Ace JAMB with AI assisted CBT Practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.className}`} suppressHydrationWarning>
      <body>
        <Theme>
          <Practice>
            <ReactScan />
            {children}
          </Practice>
        </Theme>
      </body>
    </html>
  );
}
