import ReactScan from '@/components/dev/react-scan';
import { lexend } from '@/fonts';
import { Providers } from '@/providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { metadata } from '@/libraries/metadata';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.className} select-none`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <ReactScan />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
