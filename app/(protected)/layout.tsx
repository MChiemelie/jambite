import { Sidebar } from '@/components/sidebar';
import User from '@/providers/user';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <User>
      <Sidebar>{children}</Sidebar>
    </User>
  );
}
