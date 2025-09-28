import ReactScan from '@/components/dev/react-scan';
import { lexend } from '@/fonts';
import { Providers } from '@/providers';
import './globals.css';
import { metadata } from '@/libraries/metadata';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.className} select-none break-keep [hyphens:none]`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <ReactScan />
        </Providers>
      </body>
    </html>
  );
}
