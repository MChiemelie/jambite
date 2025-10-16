import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NetworkStatus from '@/components/custom/network';
import ReactScan from '@/components/dev/react-scan';
import { lexend } from '@/fonts';
import { metadata } from '@/libraries/metadata';
import { Providers } from '@/providers';
import './globals.css';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${lexend.className} select-none`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <NetworkStatus />
          <ReactScan />

          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
