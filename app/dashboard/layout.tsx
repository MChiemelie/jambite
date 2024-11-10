import { Inter } from 'next/font/google';
import { Sidebar } from '@/layout/siderbar/sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mt-16 sm:ml-[240px] sm:mt-3">
      <Sidebar />
      {children}
    </main>
  );
}
