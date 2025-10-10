import { Sidebar } from '@/components/sidebar';
import { User } from '@/providers';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <User>
      <Sidebar>{children}</Sidebar>
    </User>
  );
}
