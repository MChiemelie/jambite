import { Sidebar } from '@/components/sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}