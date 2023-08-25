import './globals.css';
import { Assistant } from 'next/font/google';
import { Providers } from '@/components';

export const metadata = {
  title: 'Jambite - Ace Your JAMB!',
  description: 'Practice your JAMB Computer Based Test, and put yourself ahead the game. With a wide range of 17 subjects available, Prepare effectively for your exams by accessing a comprehensive collection of over 20,000 past questions.',
}

const inter = Assistant({
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  )
}